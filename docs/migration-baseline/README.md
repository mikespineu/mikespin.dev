# Pre-migration baseline (Next.js 14.2.4, pages router)

Captured with headless Chromium (swiftshader), 1280x800, 3 s wait after load, Node 24.21.0, `npm run dev`.

| Route | Screenshot | HTTP | Console errors |
|---|---|---|---|
| `/` | home.png | 200 | none |
| `/exp/animated-gradient` | animated-gradient.png | 200 | none |
| `/exp/animated-texture` | animated-texture.png | 200 | none |
| `/exp/planes` | planes.png | 200 | none |
| `/exp/react-three-fiber` | react-three-fiber.png | 200 | none |
| `/exp/reveal` | reveal.png | 200 | none |

No console errors, page errors or failed requests on any route.

Notes:
- Animated scenes (home, gradient, texture, planes, reveal) are captured mid-animation; exact frames will differ between runs.
- `react-three-fiber` is a mostly white page with one small red square at the top centre; this is the existing look, not a failure.
- `reveal` shows a leva control panel at top right.
- `npm run dev` prints `/bin/sh: yarn: command not found` (harmless).
