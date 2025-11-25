<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{
  clickBack: []
}>()
</script>

<template>
  <div class="flex items-center">
    <ElementCardBackButton @click="emit('clickBack')" />
    <h1 class="text-2xl leading-8 font-semibold">
      {{ title }}
    </h1>
  </div>
</template>

