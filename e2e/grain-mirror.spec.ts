import { expect, test } from '@playwright/test'

// Chromium's fake camera stands in for a real webcam.
test.use({
  permissions: ['camera'],
  launchOptions: {
    args: [
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
    ],
  },
})

test('runs on the example video and switches to the webcam', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error' && /shader|WebGL/i.test(m.text()))
      errors.push(m.text())
  })
  await page.goto('/exp/grain-mirror')

  const source = page.getByTestId('gm-source')
  await expect(source).toHaveAttribute('data-mode', 'example', {
    timeout: 15_000,
  })
  await expect(page.getByTestId('gm-canvas')).toBeVisible()

  await page.getByRole('button', { name: 'Webcam' }).click()
  await expect(source).toHaveAttribute('data-mode', 'webcam', {
    timeout: 15_000,
  })
  await expect(page.getByRole('alert')).toHaveCount(0)

  await page.getByRole('link', { name: /back/ }).click()
  await expect
    .poll(() => page.evaluate(() => document.querySelectorAll('video').length))
    .toBe(0)
  expect(errors).toEqual([])
})

test('copies a link that carries the settings', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/exp/grain-mirror?size=5&mode=Static&color1=ff0000')

  await page.getByRole('button', { name: 'Copy link' }).click()
  await expect(page.getByRole('status')).toHaveText('Copied')

  const link = await page.evaluate(() => navigator.clipboard.readText())
  const params = new URL(link).searchParams
  expect(params.get('size')).toBe('5')
  expect(params.get('mode')).toBe('Static')
  expect(params.get('color1')).toBe('#ff0000')
  expect(params.get('relief')).toBe('0.95')
})
