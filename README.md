# mikespin.dev

Personal site with WebGL experiments, built with [TanStack Start](https://tanstack.com/start), [React Three Fiber](https://r3f.docs.pmnd.rs/) and Tailwind CSS 4.

Requires Node 26 (`nvm use`).

## Scripts

```bash
npm install
npm run dev        # dev server on port 3000
npm run build      # production build
npm run preview    # preview production build
npm run typecheck  # tsc --noEmit
npm run test       # Vitest
```

## Layout

- `src/routes/` – file-based routes (`routeTree.gen.ts` is generated)
- `src/components/` – shared components
- `src/webgl/` – scenes and shaders
- `src/utils/` – helpers
