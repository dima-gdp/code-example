import type { AffiliateProgramBriefInfoOutDto } from '@ui/nuxt/types/generated/billing-auth-oper.dto'

export function getSelectId(index: number) {
  return `select-${index + 1}`
}

export function buildProgramsList(programs: AffiliateProgramBriefInfoOutDto[]) {
  // Создаем массив из 10 пустых элементов с id = 'select' + порядковый номер
  const emptyItems = Array.from({ length: 10 }, (_, i) => ({ id: getSelectId(i) }))

  // Обновим список существующими программами
  return emptyItems.map((item, i) => {
    const position = i + 1
    const program = programs.find(p => p.topPosition === position)

    return program || item
  })
}

