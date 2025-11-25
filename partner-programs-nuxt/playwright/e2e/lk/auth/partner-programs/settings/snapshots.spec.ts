import { expect, test } from '@@/playwright/fixtures/base'
import { assertNoLoaders } from '@@/playwright/utils/assertions'
import { signIn } from '@@/playwright/utils/auth'

test.describe('Partner programs settings', () => {
  test.beforeEach(async ({ context }) => {
    await signIn(context, 'alexandr_afanasiev')
  })

  test('Snapshots', {
    tag: [
      '@site-header',
      '@site-nav-main',
      '@site-nav-footer',
      '@desktop'
    ]
  }, async ({ page }) => {
    await page.goto('/lk/partner-programs/settings')
    await assertNoLoaders(page)

    await expect(page).toHaveScreenshot('partner-programs-settings.png', { fullPage: true })
  })
})

