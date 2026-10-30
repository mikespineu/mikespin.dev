import { expect, test } from '@playwright/test'

for (const name of ['animated-gradient', 'animated-texture', 'planes']) {
  test(`${name} back link returns home`, async ({ page }) => {
    await page.goto(`/exp/${name}`)
    await page.getByRole('link', { name: '< back' }).click()
    await expect(page).toHaveURL(/\/$/)
  })
}

test('home links open experiments', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Planes' }).click()
  await expect(page).toHaveURL(/\/exp\/planes$/)
})
