import { expect, test } from '@playwright/test'
import { expectCanvasRenders } from './helpers'

test('animated-gradient renders and changes gradient', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await expectCanvasRenders(page, '/exp/animated-gradient')
  await expect(page).toHaveTitle('WEBgL animated Gradients')

  const canvas = page.locator('canvas').first()
  const before = await canvas.screenshot()
  await page.getByRole('button', { name: 'Change gradient' }).click()
  await page.waitForTimeout(2500)
  const after = await canvas.screenshot()

  expect(pageErrors).toEqual([])
  expect(after.equals(before)).toBe(false)
})
