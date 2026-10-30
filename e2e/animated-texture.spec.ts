import { expect, test } from '@playwright/test'
import { expectCanvasRenders } from './helpers'

test('animated-texture renders', async ({ page }) => {
  await expectCanvasRenders(page, '/exp/animated-texture')
  await expect(page.getByRole('heading', { name: 'Animated Texture' })).toBeVisible()
})
