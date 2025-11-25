<script setup lang="ts">
const { submitButtonText = 'Продолжить' } = defineProps<{
  submitButtonText?: string
  isSubmitButtonDisabled?: boolean
  submitButtonType?: 'submit' | 'button'
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()
</script>

<template>
  <div class="flex gap-3">
    <UiButton
      color="black"
      :type="submitButtonType"
      class="rounded-lg px-5.5 text-sm font-semibold hover:bg-gray-1100"
      :disabled="isSubmitButtonDisabled"
      @click="emit('submit')"
    >
      {{ submitButtonText }}
    </UiButton>

    <UiButton
      color="gray"
      class="text-sm rounded-lg h-10 text-gray-400 px-5.5 font-medium"
      theme="text"
      @click="emit('cancel')"
    >
      Отмена
    </UiButton>
  </div>
</template>

