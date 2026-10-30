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
  await expect(page.locator('a[href="mailto:michalkrecisz@yahoo.com"]').first()).toBeVisible()

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

test('clicking the logo plays the jump without errors', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/')
  await page.waitForTimeout(2000)
  await page.locator('[data-logo-anchor]').click()
  await page.waitForTimeout(1500)
  expect(pageErrors).toEqual([])
})

test('home offers the CV as a download', async ({ page, request }) => {
  await page.goto('/')
  const link = page.getByRole('link', { name: 'Download CV' })
  await expect(link).toHaveAttribute('download')
  const response = await request.get('/cv.pdf')
  expect(response.status()).toBe(200)
  await expect(page).toHaveTitle('Michał Kręcisz — Product Engineer / Software Engineer')
  await expect(page.locator('meta[name="description"]')).toHaveCount(1)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://mikespin.dev',
  )
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute('content')
  expect((await request.get(new URL(image!).pathname)).status()).toBe(200)
})

for (const width of [390, 1280]) {
  test(`open source section slides over the hero at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')

    const heading = page.getByRole('heading', { name: 'Built in the Open' })
    await heading.scrollIntoViewIfNeeded()
    await expect(heading).toBeVisible()

    const covered = await heading.evaluate((el) => {
      const { left, top } = el.getBoundingClientRect()
      return el.contains(document.elementFromPoint(left + 1, top + 1))
    })
    expect(covered).toBe(true)
  })
}

test('projects swipe on mobile and all show on desktop', async ({ page }) => {
  const overflowAt = async (width: number) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    const list = page.locator('section ul')
    await expect(list.locator('a')).toHaveCount(4)
    return list.evaluate((el) => el.scrollWidth - el.clientWidth)
  }

  expect(await overflowAt(390)).toBeGreaterThan(0)
  expect(await overflowAt(1024)).toBeLessThanOrEqual(0)
})

test('closing strip shows the gradient and contact links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/')
  await expect(page.getByLabel('GitHub')).toHaveCount(2)

  const strip = page.getByRole('link', { name: 'mikespin.dev' }).last().locator('..')
  await strip.scrollIntoViewIfNeeded()
  const box = await strip.boundingBox()
  expect(box?.height).toBe(120)
  await expect(strip.getByLabel('Email')).toBeVisible()
})
