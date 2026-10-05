import { test, expect } from '@playwright/test'
import { setupSite } from '../fixtures'

// Test rendered CSS rather than class names: shared component styles and
// responsive overrides both affect the font size Safari uses when focusing.
for (const width of [390, 844, 1280]) {
  test.describe(`text inputs at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } })

    for (const route of ['/login', '/register']) {
      test(`${route} text fields stay at 16px`, async ({ page }) => {
        await page.goto(route)

        const fields = page.locator(
          'input[type="text"]:visible, input[type="email"]:visible, input[type="password"]:visible'
        )
        await expect(fields.first()).toBeVisible()

        for (const field of await fields.all()) {
          await expect(field).toHaveCSS('font-size', '16px')
          await field.focus()
          await expect(field).toBeFocused()
          await expect(field).toHaveCSS('font-size', '16px')
        }

        const hasHorizontalOverflow = await page.evaluate(
          'document.documentElement.scrollWidth > window.innerWidth'
        )
        expect(hasHorizontalOverflow).toBe(false)
      })
    }

    test('sites search stays at 16px', async ({ page, request }) => {
      await setupSite({ page, request })
      await page.goto('/sites')

      const search = page.locator('#filter-text')
      await expect(search).toBeVisible()
      await expect(search).toHaveCSS('font-size', '16px')
      await search.fill('example')
      await expect(search).toBeFocused()
      await expect(search).toHaveValue('example')
      await expect(search).toHaveCSS('font-size', '16px')
    })
  })
}
