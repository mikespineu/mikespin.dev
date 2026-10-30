import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// The baseline README records no existing errors, so nothing else is ignored.
const IGNORED_RESPONSE_HOSTS = ['fonts.cdnfonts.com']

export async function expectCanvasRenders(page: Page, path: string) {
  const pageErrors: string[] = []
  const failedResponses: string[] = []

  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('response', (response) => {
    const { hostname } = new URL(response.url())
    if (response.status() >= 400 && !IGNORED_RESPONSE_HOSTS.includes(hostname)) {
      failedResponses.push(`${response.status()} ${response.url()}`)
    }
  })

  await page.goto(path)

  const canvas = page.locator('canvas').filter({ visible: true }).first()
  await expect(canvas).toBeVisible()
  await page.waitForTimeout(3000)
  await canvas.scrollIntoViewIfNeeded()

  const box = await canvas.boundingBox()
  expect(box?.width).toBeGreaterThan(0)
  expect(box?.height).toBeGreaterThan(0)

  const screenshot = await page.screenshot({ clip: box ?? undefined })
  expect(await countColors(page, screenshot)).toBeGreaterThan(1)

  expect(pageErrors).toEqual([])
  expect(failedResponses).toEqual([])
}

// Checks every pixel, so a small mark on a flat background still counts.
async function countColors(page: Page, png: Buffer) {
  return page.evaluate(async (base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
    const bitmap = await createImageBitmap(new Blob([bytes]))
    const surface = new OffscreenCanvas(bitmap.width, bitmap.height)
    const context = surface.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('2d context unavailable')
    context.drawImage(bitmap, 0, 0)
    const { data } = context.getImageData(0, 0, bitmap.width, bitmap.height)
    const pixels = new Uint32Array(data.buffer)
    return new Set(pixels).size
  }, png.toString('base64'))
}
