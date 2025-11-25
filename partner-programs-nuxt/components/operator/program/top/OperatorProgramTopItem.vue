<script setup lang="ts">
import { faTrash } from '@fortawesome/pro-regular-svg-icons'

defineProps<{
  title: string
  categoryName: string
  active?: boolean
}>()

const emit = defineEmits<{
  delete: []
}>()
</script>

<template>
  <div class="p-4 rounded-xl bg-gray-20 flex justify-between gap-3">
    <div class="flex flex-col gap-2">
      <div class="text-sm">
        <span class="text-gray-300">Партнерская программа: </span>
        <span class="font-medium" data-cy="name">{{ title }}</span>
      </div>
      <div class="text-sm">
        <span class="text-gray-300">Тип программы: </span>
        <span>{{ categoryName }}</span>
      </div>
      <div class="text-sm">
        <span class="text-gray-300">Статус: </span>
        <span :class="active ? 'text-green-400' : 'text-red-300'">
          {{ active ? 'Активная' : 'Неактивная' }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-3 justify-center">
      <OperatorDraggableButtonDrag />

      <OperatorDraggableButtonDelete
        data-dnd-ignore
        data-cy="delete-btn"
        @click="emit('delete')"
      >
        <fa :icon="faTrash" />
      </OperatorDraggableButtonDelete>
    </div>
  </div>
</template>

