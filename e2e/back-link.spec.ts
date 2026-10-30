import { expect, test } from '@playwright/test'

for (const name of [
  'animated-gradient',
  'animated-texture',
  'planes',
  'reaction-diffusion',
]) {
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

test('home links to the reaction-diffusion experiment', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Reaction–diffusion' }).click()
  await expect(page).toHaveURL(/\/exp\/reaction-diffusion$/)
})
