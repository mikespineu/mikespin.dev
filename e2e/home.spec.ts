import { expect, test } from '@playwright/test'
import { expectCanvasRenders } from './helpers'

test('home renders the logo canvas', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  const glb = page.waitForResponse((r) => r.url().endsWith('/ms-logo.glb'))
  const hdr = page.waitForResponse((r) =>
    r.url().endsWith('/empty_warehouse_01_1k.hdr'),
  )

  await expectCanvasRenders(page, '/')

  expect((await glb).status()).toBe(200)
  expect((await hdr).status()).toBe(200)
  await expect(page.locator('a[href="mailto:michalkrecisz@yahoo.com"]')).toBeVisible()

  await page.mouse.move(200, 200)
  await page.mouse.move(900, 600, { steps: 10 })
  await page.waitForTimeout(500)
  expect(pageErrors).toEqual([])
})

for (const width of [390, 768, 1280, 1440]) {
  test(`home layout holds at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    await page.waitForTimeout(1000)

    const anchor = await page.locator('[data-logo-anchor]').boundingBox()
    const text = await page.locator('main > div').first().boundingBox()
    const footer = await page.locator('footer').boundingBox()
    if (!anchor || !text || !footer) throw new Error('layout box missing')

    const overlaps =
      anchor.x < text.x + text.width &&
      text.x < anchor.x + anchor.width &&
      anchor.y < text.y + text.height &&
      text.y < anchor.y + anchor.height
    expect(overlaps).toBe(false)
    expect(text.y + text.height).toBeLessThanOrEqual(footer.y)

    const scrollWidth = await page.evaluate(
      () => document.querySelector('main')!.parentElement!.parentElement!.scrollWidth,
    )
    expect(scrollWidth).toBeLessThanOrEqual(width)
  })
}

test('home offers the CV as a download', async ({ page, request }) => {
  await page.goto('/')
  const link = page.getByRole('link', { name: 'Download CV' })
  await expect(link).toHaveAttribute('download')
  const response = await request.get('/cv.pdf')
  expect(response.status()).toBe(200)
  await expect(page).toHaveTitle('Michał Kręcisz — Product Engineer / Software Engineer')
})
