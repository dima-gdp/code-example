import { expect, test } from '@@/playwright/fixtures/base'
import { confirmAction } from '@@/playwright/utils/actions'
import { assertAppNotificationShown, assertNuxtReady } from '@@/playwright/utils/assertions'
import { signIn } from '@@/playwright/utils/auth'

const SETTINGS_URL = '/lk/partner-programs/settings'

test.describe('Partner programs settings', () => {
  test.beforeEach(async ({ context }) => {
    await signIn(context, 'alexandr_afanasiev')
  })

  // Падает при прогоне всех тестов
  test.fixme('Should edit top list', { tag: ['@desktop'] }, async ({ page }) => {
    await page.goto(SETTINGS_URL)
    await assertNuxtReady(page)

    const saveBtn = page.getByTestId('site-main').getByRole('button', { name: 'Сохранить' })
    await expect(saveBtn).toBeDisabled()

    // Удалим первую программу
    const programItem = page.getByTestId('program-item')
    await programItem.first().getByTestId('delete-btn').click()
    await confirmAction(page)
    await expect(programItem).toHaveCount(10)
    await expect(programItem.first().getByTestId('program-select')).toBeVisible()

    await expect(saveBtn).toBeEnabled()

    // Добавим программу на позицию 3
    const thirdProgramItem = programItem.nth(2)
    await thirdProgramItem.getByTestId('program-select').click()
    await thirdProgramItem.getByTestId('option').nth(1).click()
    await assertAppNotificationShown(page, { title: 'Повторный выбор программы невозможен' })
    await thirdProgramItem.getByTestId('option').nth(4).click()
    await expect(thirdProgramItem.getByTestId('program-card').getByTestId('name'))
      .toHaveText('Бронь гостинец, апартаменты')

    // Перетащим dnd девятую программу на 7 позицию
    // Перед dnd
    await expect(programItem.nth(8).getByTestId('program-card').getByTestId('name')).toHaveText('Микрокредитование')
    await expect(programItem.nth(6).getByTestId('program-select')).toBeVisible()

    await programItem.nth(8).dragTo(programItem.nth(6))
    // После dnd
    await expect(programItem.nth(6).getByTestId('program-card').getByTestId('name')).toHaveText('Микрокредитование')
    await expect(programItem.nth(8).getByTestId('program-select')).toBeVisible()

    // Проверим запросы на редактирование
    const deleteRequests: string[] = []
    const postRequests: string[] = []
    await page.route('**/tenchat-billing/api/web/auth/operator/affiliate-program/**/top**', async (route, request) => {
      const url = new URL(route.request().url())
      const pathWithQuery = url.pathname + url.search

      if (request.method() === 'DELETE') {
        deleteRequests.push(pathWithQuery)
      }

      if (request.method() === 'POST') {
        postRequests.push(pathWithQuery)
      }

      return await route.continue()
    })

    // Сохраним
    await saveBtn.click()
    await page.waitForLoadState('networkidle')

    expect(deleteRequests).toEqual([
      '/tenchat-billing/api/web/auth/operator/affiliate-program/3/top',
      '/tenchat-billing/api/web/auth/operator/affiliate-program/1/top'
    ])
    expect(postRequests).toEqual([
      '/tenchat-billing/api/web/auth/operator/affiliate-program/3/top?position=3',
      '/tenchat-billing/api/web/auth/operator/affiliate-program/1/top?position=7'
    ])
  })

  test('Should show exit modal when has changes', { tag: ['@desktop'] }, async ({ page }) => {
    await page.goto(SETTINGS_URL)
    await assertNuxtReady(page)

    const cancelBtn = page.getByTestId('site-main').getByRole('button', { name: 'Отмена' })

    // Удалим первую программу
    const programItem = page.getByTestId('program-item')
    await programItem.first().getByTestId('delete-btn').click()
    await confirmAction(page)
    await expect(programItem).toHaveCount(10)
    await expect(programItem.first().getByTestId('program-select')).toBeVisible()

    await cancelBtn.click()
    await expect(page).toHaveURL(SETTINGS_URL)

    await confirmAction(page)
    await expect(page).toHaveURL('/lk/partner-programs')
  })
})

