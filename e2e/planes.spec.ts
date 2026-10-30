import { expect, test } from '@playwright/test'
import { expectCanvasRenders } from './helpers'

test('planes renders a canvas', async ({ page }) => {
  await expectCanvasRenders(page, '/exp/planes')
})

test('dragging the canvas causes no page error', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/exp/planes')
  await page.waitForTimeout(1000)

  const canvas = page.locator('canvas').filter({ visible: true }).first()
  const box = await canvas.boundingBox()
  if (!box) throw new Error('canvas has no bounding box')

  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 120, y + 60, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(500)

  expect(pageErrors).toEqual([])
})
