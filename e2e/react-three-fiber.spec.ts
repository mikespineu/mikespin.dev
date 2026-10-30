import { test } from '@playwright/test'
import { expectCanvasRenders } from './helpers'

test('react-three-fiber renders a canvas', async ({ page }) => {
  await expectCanvasRenders(page, '/exp/react-three-fiber')
})
