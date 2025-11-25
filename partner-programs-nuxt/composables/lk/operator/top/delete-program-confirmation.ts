import { useConfirmationModal } from '~/composables/modal/confirmation'

export function useDeleteProgramConfirmation() {
  const { getConfirmation } = useConfirmationModal()

  async function confirmDeleteProgram(): Promise<boolean> {
    return await getConfirmation({
      title: 'Удалить из топа',
      content: 'Вы уверены, что хотите удалить программу из&nbsp;топа?',
      btnConfirm: 'Удалить',
      btnConfirmColor: 'light-red'
    })
  }

  return {
    confirmDeleteProgram
  }
}

