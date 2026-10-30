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
