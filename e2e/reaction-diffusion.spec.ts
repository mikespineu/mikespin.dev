import { expect, test } from '@playwright/test'

// Chromium's fake camera stands in for a real webcam.
test.use({
  permissions: ['camera'],
  launchOptions: {
    args: [
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--enable-unsafe-webgpu',
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
    ],
  },
})

// Headless software WebGPU can drop its device; that says nothing about the
// page, so only those messages are ignored.
const GPU_NOISE = /Instance dropped|Device Lost|external Instance reference/i

function collectErrors(page: import('@playwright/test').Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => {
    if (!GPU_NOISE.test(e.message)) errors.push(e.message)
  })
  return errors
}

const source = (page: import('@playwright/test').Page) =>
  page.getByTestId('rd-source')

test('loads the example video and shows the controls', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/exp/reaction-diffusion')

  await expect(page.getByRole('button', { name: 'Webcam' })).toBeVisible()
  await expect(source(page)).toHaveAttribute('data-mode', 'example', {
    timeout: 15_000,
  })
  await expect(page.getByRole('alert')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('switches to the webcam and releases it when leaving', async ({
  page,
}) => {
  const errors = collectErrors(page)
  await page.goto('/exp/reaction-diffusion')
  await expect(source(page)).toHaveAttribute('data-mode', 'example', {
    timeout: 15_000,
  })

  await page.getByRole('button', { name: 'Webcam' }).click()
  await expect(source(page)).toHaveAttribute('data-mode', 'webcam', {
    timeout: 15_000,
  })

  const video = await page.evaluate(() => {
    const el = [...document.querySelectorAll('video')].find((v) => v.srcObject)
    const stream = el?.srcObject as MediaStream | undefined
    return {
      count: document.querySelectorAll('video:not([poster])').length,
      live:
        stream?.getVideoTracks().every((t) => t.readyState === 'live') ?? false,
      width: el?.videoWidth ?? 0,
      playing: el ? !el.paused : false,
    }
  })
  // the example clip's element is gone; only the camera feed remains
  expect(video).toEqual({
    count: 1,
    live: true,
    width: expect.any(Number),
    playing: true,
  })
  expect(video.width).toBeGreaterThan(0)

  await page.getByRole('link', { name: /back/ }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect
    .poll(() => page.evaluate(() => document.querySelectorAll('video:not([poster])').length))
    .toBe(0)
  expect(errors).toEqual([])
})

test('shows a message when camera access is blocked', async ({ browser }) => {
  const context = await browser.newContext({ permissions: [] })
  const page = await context.newPage()
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = () =>
      Promise.reject(new DOMException('denied', 'NotAllowedError'))
  })
  await page.goto('/exp/reaction-diffusion')
  await expect(source(page)).toHaveAttribute('data-mode', 'example', {
    timeout: 15_000,
  })

  await page.getByRole('button', { name: 'Webcam' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'Camera access was blocked'
  )
  // the example keeps running
  await expect(source(page)).toHaveAttribute('data-mode', 'example')
  await context.close()
})
