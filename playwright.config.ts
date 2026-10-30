import { defineConfig } from '@playwright/test'

const port = Number(process.env.E2E_PORT) || 4173

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: `http://localhost:${port}`,
    viewport: { width: 1280, height: 800 },
    launchOptions: {
      args: [
        '--use-angle=swiftshader',
        '--enable-unsafe-swiftshader',
        '--ignore-gpu-blocklist',
      ],
    },
  },
  webServer: {
    command: `npx serve dist/client -l ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
  },
})
