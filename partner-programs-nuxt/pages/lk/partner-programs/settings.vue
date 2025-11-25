<script setup lang="ts">
import { useSharedAsyncData } from '@ui/nuxt/composables/async-data'
import { useSharedAsyncDataErrorHandler } from '@ui/nuxt/composables/async-data/error-handler'
import { useSharedAsyncDataLoadingHandler } from '@ui/nuxt/composables/async-data/loading-handler'
import type { AffiliateProgramBriefInfoOutDto } from '@ui/nuxt/types/generated/billing-auth-oper.dto'
import Draggable from 'vuedraggable'

import { useNotification } from '~/composables/app/notification'
import { useLkOperatorLeave } from '~/composables/lk/operator/leave'
import { useDeleteProgramConfirmation } from '~/composables/lk/operator/top/delete-program-confirmation'
import { useLkOperatorTopPrograms } from '~/composables/lk/operator/top/programs'
import { useSharedHistory } from '~/composables/shared/history'
import { BASE_ERROR_TITLE_MESSAGE } from '~/constants/notification'
import { OPERATOR_CABINET_PARTNER_PROGRAMS } from '~/constants/routes'

definePageMeta({
  layout: 'main',
  middleware: ['check-authorization', 'redirect-when-not-operator-affiliate-program']
})

const { loadProgramsList,
  programsList,
  addProgram,
  deleteProgram,
  hasChanges,
  savePrograms,
  isProgramExist
} = useLkOperatorTopPrograms()

const asyncData = await useSharedAsyncData(
  'PartnerProgramsSettings',
  async () => {
    await loadProgramsList()

    return true
  },
  { server: false }
)

useSharedAsyncDataErrorHandler(asyncData)
const { loading } = useSharedAsyncDataLoadingHandler(asyncData)

const { $logError } = useNuxtApp()
const { error, success } = useNotification()
const { confirmDeleteProgram } = useDeleteProgramConfirmation()

async function onClickDeleteProgram(index: number) {
  const confirmation = await confirmDeleteProgram()

  if (confirmation) {
    deleteProgram(index)
  }
}

function onAddProgram(program: AffiliateProgramBriefInfoOutDto, index: number) {
  if (isProgramExist(program.id)) {
    error({
      title: 'Повторный выбор программы невозможен',
      message: 'Данная партнерская программа уже присутствует в ТОПе'
    })
  } else {
    addProgram(program, index)
  }
}

async function onClickSave() {
  try {
    await savePrograms()
    success({ title: 'Настройки успешно сохранены' })
  } catch (e) {
    $logError(e)
    error(BASE_ERROR_TITLE_MESSAGE)
  }

  await asyncData.refresh()
}

const { goBack } = useSharedHistory()
useLkOperatorLeave(hasChanges)
</script>

<template>
  <ElementCard class="p-5 h-full mb-2">
    <div class="flex mb-8">
      <OperatorProgramHeader
        title="Настройки топа"
        @click-back="goBack(OPERATOR_CABINET_PARTNER_PROGRAMS)"
      />
    </div>

    <div v-if="loading" class="flex items-center justify-center h-full">
      <UiLoaderCircle />
    </div>

    <div v-else class="max-w-170 w-full">
      <Draggable
        v-model="programsList"
        item-key="id"
        animation="300"
        handle=".tc-drag-item"
        filter="[data-dnd-ignore]"
        class="flex flex-col gap-6"
      >
        <template #item="{ element, index }">
          <div class="flex items-center gap-5" data-cy="program-item">
            <span
              class="text-sm text-center font-medium text-gray-900 min-w-4 shrink-0"
              data-cy="count"
            >
              {{ index + 1 }}
            </span>

            <OperatorProgramTopItem
              v-if="element.title"
              class="tc-drag-item grow cursor-pointer"
              :title="element.title"
              :category-name="element.dictionaryProgramCategory.name"
              :active="element.active"
              data-cy="program-card"
              @delete="onClickDeleteProgram(index)"
            />
            <OperatorProgramTopSelect
              v-else
              class="grow"
              data-cy="program-select"
              @click-option="onAddProgram($event, index)"
            />
          </div>
        </template>
      </Draggable>

      <OperatorFormActions
        class="mt-13"
        :is-submit-button-disabled="!hasChanges"
        submit-button-text="Сохранить"
        @submit="onClickSave"
        @cancel="goBack(OPERATOR_CABINET_PARTNER_PROGRAMS)"
      />
    </div>
  </ElementCard>
</template>

<style lang="postcss" scoped>
.sortable-chosen {
  .tc-drag-item {
    outline: 1px solid var(--color-gray-900);
    outline-offset: -1px;
  }
}

.sortable-ghost {
  .tc-drag-item {
    opacity: 0.3;
  }
}
</style>

