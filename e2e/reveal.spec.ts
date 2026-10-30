import { expect, test } from '@playwright/test'
import { expectCanvasRenders } from './helpers'

test('reveal renders a canvas and leva panel', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await expectCanvasRenders(page, '/exp/reveal')

  await expect(page.getByText('transmission', { exact: true })).toBeVisible()
  expect(errors.filter((text) => /hydrat/i.test(text))).toEqual([])
})
