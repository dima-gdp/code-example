<script setup lang="ts">
import { faTrash } from '@fortawesome/pro-regular-svg-icons'
</script>

<template>
  <button
    type="button"
    class="size-8 text-sm flex items-center justify-center text-red-100 rounded-2lg hover:bg-red-30"
  >
    <fa :icon="faTrash" />
  </button>
</template>

