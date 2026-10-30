import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const paths = [
  '/',
  '/exp/animated-gradient',
  '/exp/animated-texture',
  '/exp/planes',
  '/exp/reaction-diffusion',
]

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false },
      pages: paths.map((path) => ({ path })),
    }),
    viteReact(),
  ],
})

export default config
