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

test('animated-gradient exposes colour and grain controls', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await expectCanvasRenders(page, '/exp/animated-gradient')
  await expect(page.getByText('grain amount')).toBeVisible()
  for (const name of [
    'gradient speed',
    'scale',
    'softness',
    'relief',
    'grain speed',
    'grain mix',
  ]) {
    await expect(page.getByText(name, { exact: true })).toBeVisible()
  }

  const canvas = page.locator('canvas').first()
  const before = await meanColor(page, await canvas.screenshot())
  for (const name of ['color1', 'color2', 'color3', 'color4', 'color5']) {
    const input = page.locator(`input[id="${name}"]`)
    await input.fill('#ff0000')
    await input.press('Enter')
  }
  await page.waitForTimeout(500)
  const after = await meanColor(page, await canvas.screenshot())

  expect(pageErrors).toEqual([])
  expect(after[0]).toBeGreaterThan(200)
  expect(after[1]).toBeLessThan(40)
  expect(distance(before, after)).toBeGreaterThan(20)
})

test('animated-gradient saves a PNG and round-trips values', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  const query =
    'color1=%23112233&color2=%23223344&color3=%23334455&color4=%23445566&color5=%23556677' +
    '&speed=2&scale=1.5&softness=0.8&relief=1&grainAmount=0.2&grainMix=0.7&grainSpeed=3&grainSize=2'

  await page.goto(`/exp/animated-gradient?${query}`)
  await expect(page.locator('input[id="color1"]')).toHaveValue('#112233')
  await expect(page.locator('input[id="grainSpeed"]')).toHaveValue('3')

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'save PNG' }).click(),
  ])
  expect(download.suggestedFilename()).toBe('gradient.png')

  await page.getByRole('button', { name: 'copy values' }).click()
  await expect(page.getByRole('status')).toHaveText('Copied')
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(new URL(copied).search).toBe(`?${query}`)
})

test('animated-gradient embed shows only the background', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/exp/animated-gradient?color1=%23112233')
  await page.getByRole('button', { name: 'copy iframe' }).click()
  await expect(page.getByRole('status')).toHaveText('Copied')
  const snippet = await page.evaluate(() => navigator.clipboard.readText())
  expect(snippet).toMatch(/^<iframe src=".*embed=1"/)

  const src = snippet.match(/src="([^"]+)"/)?.[1].replaceAll('&amp;', '&')
  await page.setContent(`<iframe src="${src}" width="800" height="500"></iframe>`)
  const frame = page.frameLocator('iframe')
  await expect(frame.locator('canvas').first()).toBeVisible()
  await expect(frame.getByText('Animated Gradients')).toBeHidden()
  await expect(frame.getByText('back')).toBeHidden()
  await expect(frame.getByRole('button', { name: 'Change gradient' })).toBeHidden()
  await expect(frame.getByText('grain amount')).toHaveCount(0)
})
