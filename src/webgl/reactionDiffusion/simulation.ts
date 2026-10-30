import * as THREE from 'three/webgpu'
import {
  Fn,
  If,
  clamp,
  float,
  fwidth,
  hash,
  instanceIndex,
  instancedArray,
  int,
  length,
  max,
  mix,
  positionGeometry,
  pow,
  smoothstep,
  storage,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
} from 'three/tsl'

/**
 * Gray-Scott reaction-diffusion driven by a video.
 *
 * Chemicals A and B live in ping-pong storage buffers (vec2 per cell).
 *
 * The trick that makes the image appear: the Laplacian is sampled at a
 * per-cell radius `h` (bilinear taps at distance h instead of 1 cell).
 * Effective diffusion grows with h², so stripe spacing grows linearly with h:
 *   dark pixels   -> small h -> tight stripes
 *   bright pixels -> large h -> wide, lazy loops
 * The stencil is a convex combination of samples, so it stays stable for any
 * h, and unlike scaling D down it never collapses into grid-aligned blocks.
 *
 * Per frame: video -> luminance -> local-contrast boost (unsharp mask) -> h map.
 * Per step:  Gray-Scott update with the variable-radius 9-tap Laplacian.
 * Display:   iso-line of B, anti-aliased with screen-space derivatives.
 */
export function createSimulation(width: number, height: number) {
  const count = width * height
  const W = int(width)
  const H = int(height)
  const Wf = float(width)
  const Hf = float(height)

  // --- buffers --------------------------------------------------------------
  const bufA = instancedArray(count, 'vec2') // (A, B)
  const bufB = instancedArray(count, 'vec2')
  const lumBuf = instancedArray(count, 'float')
  const blurTmp = instancedArray(count, 'float')
  const meanBuf = instancedArray(count, 'float')
  const radiusBuf = instancedArray(count, 'float') // stencil radius h per cell

  // --- uniforms -------------------------------------------------------------
  const u = {
    feed: uniform(0.0545),
    kill: uniform(0.062),
    diffA: uniform(1.0),
    diffB: uniform(0.5),
    hMin: uniform(0.45), // stencil radius in the darkest areas (tight lines)
    hMax: uniform(1.3), // stencil radius in the brightest areas (wide loops)
    lumLow: uniform(0.25),
    lumHigh: uniform(0.95),
    gamma: uniform(1.0),
    localContrast: uniform(3.0), // unsharp-mask strength, makes the face read
    radiusSmoothing: uniform(0.08), // temporal smoothing of the h map
    // video "object-fit: cover" mapping: uv * coverScale + coverOffset
    coverScale: uniform(new THREE.Vector2(1, 1)),
    coverOffset: uniform(new THREE.Vector2(0, 0)),
    mirror: uniform(0),
    // seeding
    seedMode: uniform(0), // 0 = grow from centre, 1 = fill everything
    seedRadius: uniform(14),
    brushPos: uniform(new THREE.Vector2(-1000, -1000)),
    brushRadius: uniform(7),
    // display
    threshold: uniform(0.22),
    lineWidth: uniform(1.3),
    toneWidth: uniform(0.6), // extra line width in dark areas
    ink: uniform(new THREE.Color('#262626')),
    paper: uniform(new THREE.Color('#fbfbfa')),
    sourceOpacity: uniform(0),
    mapOpacity: uniform(0),
    // hover interaction (cursor position in cell coordinates)
    hoverPos: uniform(new THREE.Vector2(-1000, -1000)),
    hoverVel: uniform(new THREE.Vector2(0, 0)), // cursor velocity, cells per step
    hoverAmount: uniform(0), // 0..1, fades in/out as the cursor enters/leaves
    hoverRadius: uniform(60), // cells
    hoverSoftness: uniform(1.5), // falloff exponent: 0.3 = flat disc, 4 = soft peak
    lensStrength: uniform(0.5), // instant visual displacement (0..0.95)
    pushStrength: uniform(0.6), // real outward advection of the pattern (cells/step)
    dragStrength: uniform(0.5), // how much the pattern follows cursor motion
  }

  // Placeholder texture until the video is ready.
  const placeholder = new THREE.DataTexture(
    new Uint8Array([200, 200, 200, 255]),
    1,
    1
  )
  placeholder.needsUpdate = true
  const videoNode = texture(placeholder)

  // --- helpers --------------------------------------------------------------
  const cell = () => ({
    x: int(instanceIndex.mod(width)),
    y: int(instanceIndex.div(width)),
  })

  const idxOf = (x: any, y: any): any =>
    (y as any)
      .max(0)
      .min(H.sub(1))
      .mul(W)
      .add((x as any).max(0).min(W.sub(1)))

  /** Bilinear read of a buffer at fractional cell coordinates. */
  const sampleBilinear = (buf: any, px: any, py: any): any => {
    const cx = clamp(px, 0, Wf.sub(1))
    const cy = clamp(py, 0, Hf.sub(1))
    const fx0 = cx.floor()
    const fy0 = cy.floor()
    const fx = cx.sub(fx0)
    const fy = cy.sub(fy0)
    const x0 = int(fx0)
    const y0 = int(fy0)
    const v00 = buf.element(idxOf(x0, y0))
    const v10 = buf.element(idxOf(x0.add(1), y0))
    const v01 = buf.element(idxOf(x0, y0.add(1)))
    const v11 = buf.element(idxOf(x0.add(1), y0.add(1)))
    return mix(mix(v00, v10, fx), mix(v01, v11, fx), fy)
  }

  const videoUV = (cellUv: any) => {
    const mx = mix(cellUv.x, float(1).sub(cellUv.x), u.mirror)
    return vec2(mx, cellUv.y).mul(u.coverScale).add(u.coverOffset)
  }

  /** 1 at the cursor, 0 at hoverRadius; shape set by hoverSoftness. */
  const hoverFalloff = (r: any): any =>
    pow(clamp(float(1).sub(r.div(u.hoverRadius)), 0, 1), u.hoverSoftness).mul(
      u.hoverAmount
    )

  const luminance = (c: any) =>
    c.r.mul(0.299).add(c.g.mul(0.587)).add(c.b.mul(0.114))

  // --- kernels: setup -------------------------------------------------------

  /** Reset: A = 1, B = 0, plus a seed disk (or coarse noise everywhere). */
  const init = Fn(() => {
    const { x, y } = cell()
    const p = vec2(float(x), float(y))
    const d = length(p.sub(vec2(Wf, Hf).mul(0.5)))
    const ab = vec2(1, 0).toVar()
    If(d.lessThan(u.seedRadius), () => {
      ab.assign(vec2(0.5, 1))
    })
    // coarse noise: blobs of ~12 cells (single-pixel noise just dies out)
    const blob = hash(int(p.x.div(12)).add(int(p.y.div(12)).mul(997)))
    If(u.seedMode.greaterThan(0.5).and(blob.greaterThan(0.75)), () => {
      ab.assign(vec2(0.5, 1))
    })
    bufA.element(instanceIndex).assign(ab)
    bufB.element(instanceIndex).assign(ab)
    radiusBuf.element(instanceIndex).assign(0) // forces the map to snap on next frame
  })().compute(count)

  // --- kernels: per-frame image analysis -----------------------------------

  /** Video -> 3x3 averaged luminance. */
  const lumPass = Fn(() => {
    const { x, y } = cell()
    const cellUv = vec2(float(x).add(0.5), float(y).add(0.5)).div(vec2(Wf, Hf))
    const base = videoUV(cellUv)
    const r = vec2(1 / width, 1 / height).mul(u.coverScale)
    const lum = float(0).toVar()
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const s = texture(
          videoNode,
          base.add(r.mul(vec2(float(i), float(j))))
        ).level(float(0))
        lum.addAssign(luminance(s))
      }
    }
    lumBuf.element(instanceIndex).assign(lum.div(9))
  })().compute(count)

  // Wide separable Gaussian (sigma ~ width/30) for the local-contrast mean.
  const sigma = width / 30
  const TAPS = 9 // per side
  const stride = (2.2 * sigma) / TAPS
  const makeBlur = (
    src: typeof lumBuf,
    dst: typeof lumBuf,
    horizontal: boolean
  ) =>
    Fn(() => {
      const { x, y } = cell()
      const acc = float(0).toVar()
      let wsum = 0
      for (let t = -TAPS; t <= TAPS; t++) {
        const off = Math.round(t * stride)
        const w = Math.exp(-(off * off) / (2 * sigma * sigma))
        const idx = horizontal ? idxOf(x.add(off), y) : idxOf(x, y.add(off))
        acc.addAssign(src.element(idx).mul(w))
        wsum += w
      }
      dst.element(instanceIndex).assign(acc.div(wsum))
    })().compute(count)

  const blurH = makeBlur(lumBuf, blurTmp, true)
  const blurV = makeBlur(blurTmp, meanBuf, false)

  /** Local contrast + levels -> stencil radius h (temporally smoothed). */
  const mapPass = Fn(() => {
    const lum = lumBuf.element(instanceIndex)
    const mean = meanBuf.element(instanceIndex)
    const L = lum.add(lum.sub(mean).mul(u.localContrast))
    const t = pow(smoothstep(u.lumLow, u.lumHigh, L), u.gamma)
    const target = mix(u.hMin, u.hMax, t)
    const prev = radiusBuf.element(instanceIndex)
    const k = mix(u.radiusSmoothing, float(1), float(prev.lessThan(0.01)))
    prev.assign(mix(prev, target, k))
  })().compute(count)

  // --- kernels: simulation step --------------------------------------------

  const makeStep = (src: typeof bufA, dst: typeof bufA) =>
    Fn(() => {
      const { x, y } = cell()
      const px = float(x)
      const py = float(y)
      const c = src.element(instanceIndex).toVar()

      // Cursor push: semi-Lagrangian advection of the centre value. Inside the
      // hover radius the cell takes the value from "upstream", so stripes are
      // carried outward (and along the cursor's motion). The reaction then
      // heals the pattern once the cursor moves on.
      const toCell = vec2(px, py).sub(u.hoverPos)
      const r = length(toCell)
      const fall = hoverFalloff(r)
      If(fall.greaterThan(0.001), () => {
        const radial = toCell.div(r.max(0.5)).mul(u.pushStrength)
        const vel = radial.add(u.hoverVel.mul(u.dragStrength)).mul(fall)
        c.assign(sampleBilinear(src, px.sub(vel.x), py.sub(vel.y)))
      })

      const h = radiusBuf.element(instanceIndex).max(0.3).toVar()
      const d = h.mul(0.70710678)

      // Karl Sims' 3x3 weights (0.2 edges / 0.05 corners), taps at radius h
      const axis = sampleBilinear(src, px.add(h), py)
        .add(sampleBilinear(src, px.sub(h), py))
        .add(sampleBilinear(src, px, py.add(h)))
        .add(sampleBilinear(src, px, py.sub(h)))
      const diag = sampleBilinear(src, px.add(d), py.add(d))
        .add(sampleBilinear(src, px.sub(d), py.add(d)))
        .add(sampleBilinear(src, px.add(d), py.sub(d)))
        .add(sampleBilinear(src, px.sub(d), py.sub(d)))
      const lap = axis.mul(0.2).add(diag.mul(0.05)).sub(c)

      const a = c.x
      const b = c.y
      const abb = a.mul(b).mul(b)
      const na = a
        .add(u.diffA.mul(lap.x))
        .sub(abb)
        .add(u.feed.mul(float(1).sub(a)))
      const nb = b
        .add(u.diffB.mul(lap.y))
        .add(abb)
        .sub(u.kill.add(u.feed).mul(b))

      // pointer brush: inject B
      const dBrush = length(vec2(px, py).sub(u.brushPos))
      const brush = smoothstep(u.brushRadius, u.brushRadius.mul(0.5), dBrush)
      const out = vec2(
        mix(na as any, float(0.5), brush),
        mix(nb as any, float(1), brush)
      )

      dst.element(instanceIndex).assign(clamp(out, 0, 1))
    })().compute(count)

  const stepAB = makeStep(bufA, bufB)
  const stepBA = makeStep(bufB, bufA)

  // --- display material -----------------------------------------------------
  const readA = storage(bufA.value, 'vec2', count).toReadOnly()
  const readR = storage(radiusBuf.value, 'float', count).toReadOnly()

  const material = new THREE.MeshBasicNodeMaterial()
  material.vertexNode = vec4(positionGeometry.xy, 0, 1) // fullscreen, camera-independent
  material.colorNode = Fn(() => {
    const p0 = uv().mul(vec2(Wf, Hf)).sub(0.5)

    // Lens: look up the field closer to the cursor, so lines appear pushed out.
    const toPix = p0.sub(u.hoverPos)
    const lens = hoverFalloff(length(toPix)).mul(u.lensStrength.min(0.95))
    const p = p0.sub(toPix.mul(lens))
    const v = sampleBilinear(readA, p.x, p.y).y

    // darkness from the radius map, used to thicken lines in shadows
    const hHere = sampleBilinear(readR, p.x, p.y)
    const hNorm = clamp(
      hHere.sub(u.hMin).div(max(u.hMax.sub(u.hMin), 1e-3)),
      0,
      1
    )
    const dark = float(1).sub(hNorm)

    // iso-line at `threshold`, width in screen pixels
    const dist = v.sub(u.threshold).abs()
    const w = fwidth(v).max(1e-5)
    const halfW = w
      .mul(u.lineWidth)
      .mul(float(1).add(dark.mul(u.toneWidth)))
      .mul(0.5)
    const line = float(1).sub(smoothstep(halfW, halfW.add(w), dist))

    const src = texture(videoNode, videoUV(uv()))
    const paper = mix(vec3(u.paper as any), src.rgb, u.sourceOpacity)
    const bg = mix(paper, vec3(hNorm), u.mapOpacity)
    return vec4(mix(bg, vec3(u.ink as any), line), 1)
  })()

  return {
    width,
    height,
    uniforms: u,
    material,
    init,
    /** The (A, B) state after an even number of steps — for readback in tests. */
    state: bufA.value,
    /** Run once per frame before stepping. */
    analysis: [lumPass, blurH, blurV, mapPass],
    stepAB,
    stepBA,
    setSource(tex: THREE.Texture, srcWidth: number, srcHeight: number) {
      videoNode.value = tex
      // object-fit: cover
      const simAspect = width / height
      const srcAspect = srcWidth / srcHeight
      if (srcAspect > simAspect) {
        const s = simAspect / srcAspect
        u.coverScale.value.set(s, 1)
        u.coverOffset.value.set((1 - s) / 2, 0)
      } else {
        const s = srcAspect / simAspect
        u.coverScale.value.set(1, s)
        u.coverOffset.value.set(0, (1 - s) / 2)
      }
    },
    dispose() {
      material.dispose()
      placeholder.dispose()
    },
  }
}

export type Simulation = ReturnType<typeof createSimulation>
