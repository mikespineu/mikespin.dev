import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { expectCanvasRenders } from './helpers'

// The scene animates continuously, so a raw screenshot diff proves nothing.
// Instead, pin Math.random so the palette choice is known (index 0 -> palette 6,
// index 7 -> palette 40), then compare the canvas mean colour. Time drift alone
// barely moves the mean; a palette swap moves it a lot.
async function meanColor(page: Page, png: Buffer) {
  return page.evaluate(async (base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
    const bitmap = await createImageBitmap(new Blob([bytes]))
    const surface = new OffscreenCanvas(bitmap.width, bitmap.height)
    const context = surface.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('2d context unavailable')
    context.drawImage(bitmap, 0, 0)
    const { data } = context.getImageData(0, 0, bitmap.width, bitmap.height)
    const sum = [0, 0, 0]
    const count = data.length / 4
    for (let i = 0; i < data.length; i += 4) {
      sum[0] += data[i]
      sum[1] += data[i + 1]
      sum[2] += data[i + 2]
    }
    return sum.map((s) => s / count)
  }, png.toString('base64'))
}

const distance = (a: number[], b: number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

test('animated-gradient renders and changes gradient', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.addInitScript(() => {
    const w = window as unknown as { __rand?: number }
    const real = Math.random
    w.__rand = 0
    Math.random = () => (w.__rand === undefined ? real() : w.__rand)
  })

  await expectCanvasRenders(page, '/exp/animated-gradient')
  await expect(page).toHaveTitle('WEBgL animated Gradients')

  const canvas = page.locator('canvas').first()
  const before = await meanColor(page, await canvas.screenshot())
  await page.waitForTimeout(1500)
  const drifted = await meanColor(page, await canvas.screenshot())

  await page.evaluate(() => {
    ;(window as unknown as { __rand: number }).__rand = 0.99
  })
  await page.getByRole('button', { name: 'Change gradient' }).click()
  await page.waitForTimeout(1500)
  const after = await meanColor(page, await canvas.screenshot())

  const drift = distance(before, drifted)
  const change = distance(before, after)

  expect(pageErrors).toEqual([])
  expect(change).toBeGreaterThan(20)
  expect(change).toBeGreaterThan(drift * 3)
})
