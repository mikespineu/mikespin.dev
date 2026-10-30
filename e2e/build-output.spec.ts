import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'

const experiments = [
  'animated-gradient',
  'animated-texture',
  'planes',
  'reaction-diffusion',
  'grain-mirror',
]

test('prerenders every route', () => {
  const files = [
    'index.html',
    ...experiments.map((name) => `exp/${name}/index.html`),
  ]
  const missing = files.filter((file) => !existsSync(join('dist/client', file)))

  expect(missing).toEqual([])
})
