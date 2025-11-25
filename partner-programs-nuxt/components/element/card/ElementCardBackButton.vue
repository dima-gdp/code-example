<script lang="ts" setup>
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import type { VueClassType } from '@ui/types/commons'

interface Props {
  sizeClasses?: VueClassType
  iconClasses?: VueClassType
}

withDefaults(defineProps<Props>(), {
  sizeClasses: 'size-8 max-mobile:size-6',
  iconClasses: 'text-lg text-blue-300'
})
</script>

<template>
  <button
    type="button"
    class="flex items-center justify-start"
    :class="sizeClasses"
    aria-label="Назад"
  >
    <fa
      :icon="faChevronRight"
      :class="iconClasses"
      class="rotate-180"
    />
  </button>
</template>

