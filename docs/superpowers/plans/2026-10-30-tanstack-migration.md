# TanStack Start Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Next.js 14 with the `create-tanstack-r3f` starter (TanStack Start, R3F 9, React 19, Tailwind 4, Vite) while all six existing routes keep working.

**Architecture:** Foundation tasks run in sequence and swap the framework on branch `tanstack-migration`, leaving a stub for every route. Lanes then run in parallel, each porting one route in its own worktree and touching only its own files. Integration merges the lanes, verifies everything, and deploys. Pages are prerendered to static files, so no server runtime is needed.

**Tech Stack:** TanStack Start 1.x, Vite 8, React 19, three 0.185, @react-three/fiber 9, drei 10, Tailwind 4, Playwright. Versions come from the starter's pins.

**Spec:** None; the requirements are the Global Constraints below.

## Execution Map

| Stage | Tasks | Mode |
|---|---|---|
| Foundation | 1, 2, 3 | Sequential, one agent at a time on `tanstack-migration` |
| Lanes | 4, 5, 6, 7, 8 | Parallel, one agent per task, one worktree per lane |
| Integration | 9, 10 | Sequential; Task 10 needs user approval |

Lanes do not depend on each other. Do not start a lane until Task 3 is committed.

### Lane rules

- Branch from `tanstack-migration`, named `lane/<slug>`. Worktree: `.worktrees/<slug>`. Run `npm ci` there.
- Edit only the files listed in your task. These are shared and off limits: `package.json`, `package-lock.json`, `src/routeTree.gen.ts`, `src/routes/__root.tsx`, `src/styles.css`, `vite.config.ts`, `tsconfig.json`, `e2e/helpers.ts`, `src/utils/`.
- If you need a shared file changed, stop and report it. Do not work around it. The orchestrator makes the change on `tanstack-migration`, and open lanes merge it in.
- `src/routeTree.gen.ts` may regenerate locally. Do not commit it; run `git checkout src/routeTree.gen.ts` first.
- Old source stays readable with `git show main:<path>`.

## Global Constraints

- Node: newest LTS, 26.x (v26.13.0 on 2026-10-30). Set `engines.node` to `26.x` and `.nvmrc` to `26`. Every agent runs on it, except Task 1 on the old site.
- URLs stay identical: `/`, `/exp/animated-gradient`, `/exp/animated-texture`, `/exp/planes`, `/exp/react-three-fiber`, `/exp/reveal`.
- Port behavior, do not redesign: same copy, classes, titles, camera values, colors, shaders, leva defaults, and mailto link.
- No new runtime dependencies beyond those Task 2 lists. Keep `gsap`, `leva`, `maath`, `nice-color-palettes`, `postprocessing`, `@react-three/postprocessing`, `usehooks-ts`, and `zustand`.
- Do not change `.idea/`, or the stray untracked `Close` file. Stage files by name, never `git add -A`.
- Do not push, merge to `main`, or deploy without user approval.

## Decisions

- **Shaders:** import with Vite `?raw`, for example `import fragmentShader from './fragmentShader.glsl?raw'`. No shader uses `#pragma glslify` or `#include`, so glslify is dropped and `types/glsl.d.ts` is deleted.
- **Rendering:** prerender all six routes and serve `dist/client` as static files. The site has no server logic.
- **`effectRan` guard:** keep it. It stops StrictMode double setup. The site has no in-app links, so the missing WebGL cleanup cannot leak across navigation.
- **Tooling:** drop ESLint, whose config is Next-specific, plus `yarn.lock`. Keep `.prettierrc.json`. `package-lock.json` is regenerated.
- **Imports:** keep the `@/` alias and existing relative imports. `src/` mirrors the current layout, so moved files need no path changes.

## Review Focus

1. Upgrading three from 0.165 to 0.185 can change the look of a scene without any error. Each lane compares against the Task 1 baseline.
2. A hard reload on a deep URL must serve that page, not a 404. Covered by each lane's e2e test, run over static hosting.
3. `/` loads the HDR and normal map through relative paths, which depends on the URL. Task 5 makes them absolute and asserts no failed requests.
4. `/exp/reveal` uses leva and a CDN environment during prerender. Task 8 asserts the build and hydration succeed.
5. `/exp/*` routes have no links, so a crawler will not find them. Task 3 lists them explicitly and asserts each `index.html` exists.

---

## Foundation (sequential)

### Task 1: Capture baseline from the current site

**Files:**
- Create: `docs/migration-baseline/<slug>.png` (6 files; slugs: `home`, `animated-gradient`, `animated-texture`, `planes`, `react-three-fiber`, `reveal`)

**Interfaces:**
- Produces: reference screenshots for every lane's visual check.

- [ ] **Step 1: Branch and run the old site**

Run: `git checkout -b tanstack-migration && npm ci && npm run dev`
Expected: server on port 3000. Use Node 18 through `npx -p node@18` if the current Node fails.

- [ ] **Step 2: Screenshot each route**

Use a 1280×800 viewport and wait 3 s after load. Use a scratchpad Playwright script; do not add it to the repo.
Expected: 6 PNGs, none blank. Also record any console errors per route in `docs/migration-baseline/README.md`, so lanes do not chase existing faults.

- [ ] **Step 3: Commit**

```bash
git add docs/migration-baseline
git commit -m "docs: capture pre-migration baseline"
```

### Task 2: Swap framework to the starter

**Files:**
- Delete: `pages/`, `next.config.js`, `postcss.config.js`, `tailwind.config.js`, `.eslintrc.json`, `yarn.lock`, `types/glsl.d.ts`, `public/vercel.svg`
- Create (from starter): `vite.config.ts`, `tsconfig.json`, `.cta.json`, `AGENTS.md`, `.vscode/settings.json`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/styles.css`, `src/suppress-three-warnings.ts`, `public/robots.txt`
- Move: `components/` to `src/components/`, `webgl/` to `src/webgl/`, `utils/` to `src/utils/`
- Create: `.nvmrc`
- Modify: `package.json`, `package-lock.json`, `README.md`, `.gitignore`

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, the `@/*` alias to `src/*`, and all dependencies, so no lane changes `package.json`.

- [ ] **Step 1: Scaffold outside the repo**

Run in the scratchpad: `npm create tanstack-r3f@latest starter-app`
Expected: `starter-app/` without a `packages/` directory. The CLI refuses non-empty directories, which is why this happens outside the repo.

- [ ] **Step 2: Copy starter files and move code**

Copy the Create list. Do not copy the starter's `public/favicon.ico`, `logo192.png`, `logo512.png`, `manifest.json`, or `src/components/SpinningCube.tsx`. Use `git mv` for the moves, to keep history. Delete the Delete list.

- [ ] **Step 3: Write `package.json`**

Start from the starter's file, with `name: mikespin.dev` and `private: true`. Add `engines.node: "26.x"` and create `.nvmrc` containing `26`. Install Node 26 locally first; this machine has 24.21.0. Keep its pins. Add latest compatible versions as dependencies of: `gsap`, `leva` (0.10.x, for React 19), `maath`, `nice-color-palettes`, `postprocessing`, `@react-three/postprocessing` (3.x, for R3F 9), `usehooks-ts`, `zustand`. Add `@types/three` matching 0.185 and `@playwright/test`, `serve` as dev dependencies. Add script `"typecheck": "tsc --noEmit"`. Remove `lucide-react` if nothing uses it.

- [ ] **Step 4: Port document and styles**

`__root.tsx` head: keep the starter's charset and viewport, add `description` = `mikespin.dev`, and all favicon and manifest links from `main:pages/_document.js` verbatim. Remove the starter's title; Next's home page set none, so `/` has no title. `<body className="overflow-y-hidden">`.

`src/styles.css`: the two font `@import url(...)` lines first, then `@import "tailwindcss";`, then the rest of `main:styles/globals.css`, plus the starter's `box-sizing` and height rules. Tailwind 4 needs no config file.

Replace `src/routes/index.tsx` body with a stub (see Task 3). Set `.gitignore` to the union of both, keeping `.vercel` and adding `.worktrees`, `dist`, `.tanstack`, `test-results`, `playwright-report`.

- [ ] **Step 5: Verify and commit**

Run: `npm install && npm run build`
Expected: build exits 0. `npm run typecheck` still fails inside `src/webgl` and `src/components`; lanes fix those.

```bash
git add <files above by name>
git commit -m "feat: replace Next.js with TanStack Start starter"
```

### Task 3: Prerender config, route stubs, e2e harness

**Files:**
- Create: `src/routes/exp/animated-gradient.tsx`, `animated-texture.tsx`, `planes.tsx`, `react-three-fiber.tsx`, `reveal.tsx`, `playwright.config.ts`, `e2e/helpers.ts`, `e2e/build-output.spec.ts`
- Modify: `vite.config.ts`, `src/routes/index.tsx`, `src/routeTree.gen.ts`, `package.json`

**Interfaces:**
- Consumes: Task 2 scripts.
- Produces: `expectCanvasRenders(page: Page, path: string): Promise<void>` from `e2e/helpers.ts`, `npm run test:e2e`, and a frozen `routeTree.gen.ts` so lanes never conflict on it.

- [ ] **Step 1: Add one stub per route**

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exp/planes')({ component: Page })

function Page() {
  return <div>stub</div>
}
```

- [ ] **Step 2: Write the failing build test**

`e2e/build-output.spec.ts`, test `prerenders every route`: asserts these exist under `dist/client`: `index.html`, and `exp/<name>/index.html` for all five experiments.

- [ ] **Step 3: Configure the harness**

`playwright.config.ts`: `webServer` runs `npx serve dist/client -l 4173`, `baseURL` is `http://localhost:4173`, chromium launches with `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`. Add script `"test:e2e": "npm run build && playwright test"`.

- [ ] **Step 4: Run to verify failure**

Run: `npx playwright install chromium && npm run test:e2e`
Expected: FAIL, the `exp/*/index.html` files are missing.

- [ ] **Step 5: Enable prerender**

In `tanstackStart()` in `vite.config.ts`: `prerender: { enabled: true, crawlLinks: false }`, and `pages` listing all six paths. Check option names in the installed package types.

- [ ] **Step 6: Implement `expectCanvasRenders`**

Navigates to `path`. Collects `pageerror` events and responses with status >= 400. Asserts that `canvas` is visible, width and height are above 0, and that sampled pixels (via `page.screenshot`, not `readPixels`) contain more than one color after 3 s. Asserts no page errors and no failed responses. Response failures from `fonts.cdnfonts.com` are ignored, as are errors recorded as existing in the baseline README.

- [ ] **Step 7: Verify and commit**

Run: `npm run test:e2e`
Expected: PASS.

```bash
git add vite.config.ts playwright.config.ts e2e src/routes src/routeTree.gen.ts package.json package-lock.json
git commit -m "feat: prerender all routes and add e2e harness"
```

## Lanes (parallel)

Every lane follows these steps. Each task gives only its slug, files, port notes, and any extra assertions.

- [ ] **Step 1: Write failing test** `e2e/<slug>.spec.ts`: calls `expectCanvasRenders(page, '<path>')`, plus the extra assertions.
- [ ] **Step 2: Run it:** `npm run test:e2e -- e2e/<slug>.spec.ts`. Expected: FAIL, no canvas.
- [ ] **Step 3: Port the route** from the `main` source named in the task.
  - Route file uses `createFileRoute`; replace `next/head` `<Head><title>` with `head: () => ({ meta: [{ title }] })`.
  - Drop `NextPage`.
  - Change `.glsl` imports to `.glsl?raw`.
  - Add `import type` for type-only imports, which `verbatimModuleSyntax` requires.
  - Fix unused locals, which `noUnusedLocals` rejects, by removing them.
- [ ] **Step 4: Run it again.** Expected: PASS.
- [ ] **Step 5: Type check:** `npm run typecheck 2>&1 | grep -E '<lane files>'`. Expected: no output.
- [ ] **Step 6: Visual check:** screenshot at 1280×800 after 3 s, read it, compare to `docs/migration-baseline/<slug>.png`. Animations differ frame to frame; composition, colors, and text must match. Report any difference rather than tuning values, unless the notes cover it.
- [ ] **Step 7: Commit** the lane's files by name: `feat: port <slug> route`.

### Task 4: Lane `animated-gradient`

**Files:** `src/routes/exp/animated-gradient.tsx`, `src/components/AnimatedGradients.tsx`, `src/webgl/animatedGradients/*`, `e2e/animated-gradient.spec.ts`

**Interfaces:** Consumes `expectCanvasRenders`. Produces nothing for other lanes.

Source: `main:pages/exp/animated-gradient/index.tsx`. Title: `WEBgL animated Gradients`.
Extra assertion: clicking `Change gradient` causes no page error and the screenshot changes.

### Task 5: Lane `home`

**Files:** `src/routes/index.tsx`, `src/components/MsLogoRefraction.tsx`, `src/webgl/msLogoRefreaction/*`, `e2e/home.spec.ts`

**Interfaces:** Consumes `expectCanvasRenders`. Produces nothing for other lanes.

Source: `main:pages/index.tsx`.
Notes:
- Change `'empty_warehouse_01_1k.hdr'` and `'normals.jpg'` to root-relative `/` paths.
- Replace `RGBELoader` with `HDRLoader` from `three/examples/jsm/loaders/HDRLoader.js`; `RGBELoader` is deprecated.
- `setupRotation` can fire before the logo loads. Keep the current behavior unless it throws.

Extra assertions: `a[href="mailto:michalkrecisz@yahoo.com"]` is visible; responses for `/ms-logo.glb` and `/empty_warehouse_01_1k.hdr` are 200; moving the mouse over the canvas causes no page error.

### Task 6: Lane `animated-texture`

**Files:** `src/routes/exp/animated-texture.tsx`, `src/components/AnimatedTexture.tsx`, `src/webgl/animatedTexture/*`, `e2e/animated-texture.spec.ts`

**Interfaces:** Consumes `expectCanvasRenders`. Produces nothing for other lanes.

Source: `main:pages/exp/animated-texture/index.tsx`. Title: `WEBgL animated Textures`.
Extra assertion: heading `Animated Texture` is visible.

### Task 7: Lane `planes`

**Files:** `src/routes/exp/planes.tsx`, `src/components/Planes.tsx`, `src/webgl/planes/*`, `src/webgl/_starter/*`, `e2e/planes.spec.ts`

**Interfaces:** Consumes `expectCanvasRenders`. Produces nothing for other lanes.

Source: `main:pages/exp/planes/index.tsx`. Title: `webGL abstract geometry animation`.
Notes: `_starter` is an unrouted template kept for reuse. Apply the same `?raw`, `import type`, and unused-import fixes so typecheck passes. Dragging uses OrbitControls.

Extra assertion: a mouse drag on the canvas causes no page error.

### Task 8: Lane `r3f-routes`

**Files:** `src/routes/exp/react-three-fiber.tsx`, `src/routes/exp/reveal.tsx`, `src/components/baseScene/DefaultLight.tsx`, `e2e/react-three-fiber.spec.ts`, `e2e/reveal.spec.ts`

**Interfaces:** Consumes `expectCanvasRenders`. Produces nothing for other lanes.

Sources: `main:pages/exp/react-three-fiber/index.tsx`, `main:pages/exp/reveal/index.tsx`. Neither page has a title; keep it so.
Notes:
- These pages use the R3F API, so drei 10 and leva 0.10 changes land here. Keep every `useControls` default.
- If prerender fails on Canvas or leva, wrap the page body in `ClientOnly` from `@tanstack/react-router`. Report that you did.
- `Environment preset="studio"` downloads from a CDN at runtime, as it did before. Do not self-host it. If the test environment has no network, allow that request in this spec.

Extra assertions for `reveal`: the leva panel shows `transmission`; no hydration error appears in the console.

## Integration (sequential)

### Task 9: Merge lanes and verify whole site

**Files:**
- Modify: `README.md`, and whatever a merge needs

**Interfaces:**
- Consumes: all `lane/*` branches.

- [ ] **Step 1: Merge each lane**

Run: `git merge --no-ff lane/<slug>` on `tanstack-migration`, for all five.
Expected: no conflicts. A conflict means a lane broke the file rules; check that lane's diff.

- [ ] **Step 2: Run all checks**

Run: `npm run typecheck && npm run test:e2e`
Expected: both exit 0, all specs PASS.

- [ ] **Step 3: Confirm Next is gone**

Run: `grep -rnE "next/|from 'next'|NextPage|glslify" src e2e package.json vite.config.ts`
Expected: no output.

- [ ] **Step 4: Update README and commit**

Replace the Next.js text with the scripts and routes. Remove `.worktrees` entries with `git worktree remove`.

```bash
git add README.md
git commit -m "docs: update README for TanStack Start"
```

### Task 10: Deploy preview, then production (needs user approval)

Production is hosted on Vercel (confirmed by the user).

**Files:**
- Create: `vercel.json` with `buildCommand: npm run build`, `outputDirectory: dist/client`, `framework: null`

- [ ] **Step 1: Get approval** to push `tanstack-migration` and create a preview deployment.

- [ ] **Step 2: Check the preview**

Set the project's Node version to 26. If Vercel does not offer 26, fall back to 24: set `engines.node` to `24.x` and `.nvmrc` to `24`, then redeploy. Open all six URLs directly, without and with a trailing slash.
Expected: each loads with a working canvas and no 404 for assets.

- [ ] **Step 3: Get approval** to merge to `main`. Check the production URL the same way.
