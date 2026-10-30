uniform vec2 resolution;
uniform sampler2D mask;
uniform float maskAspect;
uniform float mirror;
uniform float maskBlur;
uniform float blackPoint;
uniform float whitePoint;
uniform float maskMatch;
uniform float grainAmount;
uniform float grainSize;
uniform float grainCharacter;
uniform float grainSeed;
varying vec3 vColor;

const int BLUR_TAPS = 16;
const float GOLDEN_ANGLE = 2.39996323;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Screen uv -> video uv, cropped like object-fit: cover.
vec2 coverUv(vec2 uv) {
  float ratio = (resolution.x / resolution.y) / maskAspect;
  vec2 scale = ratio > 1.0 ? vec2(1.0, 1.0 / ratio) : vec2(ratio, 1.0);
  vec2 covered = (uv - 0.5) * scale + 0.5;
  covered.x = mix(covered.x, 1.0 - covered.x, mirror);
  return covered;
}

float luma(vec2 uv) {
  return dot(texture2D(mask, uv).rgb, vec3(0.2126, 0.7152, 0.0722));
}

float blurredLuma(vec2 uv) {
  if (maskBlur <= 0.0) return luma(uv);
  float sum = 0.0;
  for (int i = 0; i < BLUR_TAPS; i++) {
    float t = (float(i) + 0.5) / float(BLUR_TAPS);
    float angle = float(i) * GOLDEN_ANGLE;
    vec2 offset = vec2(cos(angle), sin(angle)) * sqrt(t) * maskBlur;
    sum += luma(uv + offset);
  }
  return sum / float(BLUR_TAPS);
}

void main(void) {
  gl_FragColor = vec4(vColor, 1.0);
  #include <colorspace_fragment>
  vec3 base = clamp(gl_FragColor.rgb, 0.0, 1.0);

  // Sampling per grain cell keeps coarse grain from slicing the mask.
  vec2 grainCell = floor(gl_FragCoord.xy / grainSize);
  vec2 cellUv = (grainCell + 0.5) * grainSize / resolution;
  float level = smoothstep(blackPoint, whitePoint, blurredLuma(coverUv(cellUv)));
  // Black gets full grain, white none; without the match grain is uniform.
  float density = mix(1.0, 1.0 - level, maskMatch);

  float noise = hash(grainCell + grainSeed * 17.0);
  float grainLayer = clamp(0.5 + (noise - 0.5) * 2.0, 0.0, 1.0);
  vec3 overlay = mix(
    2.0 * base * grainLayer,
    1.0 - 2.0 * (1.0 - base) * (1.0 - grainLayer),
    step(0.5, base)
  );
  vec3 soft = mix(base, overlay, grainAmount * density);

  float speck = step(noise, grainAmount * density);
  // Squaring-style falloff deepens the gradient's own hue instead of going black.
  vec3 speckled = mix(base, pow(base, vec3(2.5)) * 0.7, speck);

  gl_FragColor.rgb = mix(soft, speckled, grainCharacter);
}
