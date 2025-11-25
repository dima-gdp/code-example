import {
  postApiWebAuthOperatorAffiliateProgramFilter,
  deleteApiWebAuthOperatorAffiliateProgramParamTop,
  postApiWebAuthOperatorAffiliateProgramParamTop
} from '@ui/nuxt/api/generated/billing-auth-oper/oper-affiliate-program'
import type { AffiliateProgramBriefInfoOutDto } from '@ui/nuxt/types/generated/billing-auth-oper.dto'

import { buildProgramsList, getSelectId } from '~/utils/lk/operator/top'

export function useLkOperatorTopPrograms() {
  const programsList = ref<(AffiliateProgramBriefInfoOutDto | { id: string })[]>([])

  const initialProgramsListIds = ref<(string | number)[]>([])

  const hasChanges = computed(() => {
    return initialProgramsListIds.value.some((id, index) => id !== programsList.value[index].id)
  })

  async function loadProgramsList() {
    const data = await postApiWebAuthOperatorAffiliateProgramFilter(
      {
        onlyTop: true,
        pageable: { pageNumber: 0, pageSize: 10 }
      })

    if (data.content?.length) {
      const formattedProgramsList = buildProgramsList(data.content)
      initialProgramsListIds.value = formattedProgramsList.map(program => program.id)
      programsList.value = formattedProgramsList
    }
  }

  function addProgram(program: AffiliateProgramBriefInfoOutDto, index: number) {
    const item = programsList.value[index]
    if (item) {
      Object.assign(item, program)
    }
  }

  function deleteProgram(index: number) {
    if (programsList.value[index]) {
      programsList.value[index] = { id: getSelectId(index) }
    }
  }

  function getDeletedProgramsIds(): number[] {
    return initialProgramsListIds.value
      .filter((id, index): id is number => (typeof id === 'number') && id !== programsList.value[index].id)
  }

  function getAddedProgramsData() {
    return programsList.value.reduce<{ id: number, position: number }[]>((addedPrograms, program, index) => {
      if ((typeof program.id === 'number') && (program.id !== initialProgramsListIds.value[index])) {
        return [...addedPrograms, { id: program.id, position: index + 1 }]
      }

      return addedPrograms
    }, [])
  }

  async function savePrograms() {
    const deletedProgramsIds = getDeletedProgramsIds()
    const addedProgramsListData = getAddedProgramsData()

    if (deletedProgramsIds.length) {
      await Promise.all(deletedProgramsIds.map(id => deleteApiWebAuthOperatorAffiliateProgramParamTop(id)))
    }

    if (addedProgramsListData.length) {
      await Promise.all(addedProgramsListData
        .map(({ id, position }) => postApiWebAuthOperatorAffiliateProgramParamTop(id, { position }))
      )
    }
  }

  function isProgramExist(id: number) {
    return programsList.value.some(existingProgram => existingProgram.id === id)
  }

  return {
    programsList,
    hasChanges,
    loadProgramsList,
    addProgram,
    deleteProgram,
    savePrograms,
    isProgramExist
  }
}

