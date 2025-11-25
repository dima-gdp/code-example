<script setup lang="ts" generic="ItemType">
import ExpansionPanel from '@ui/components/expansion-panel/ExpansionPanel.vue'
import type { VueClassType } from '@ui/types/commons'

withDefaults(defineProps<{
  items: ItemType[]
  titleClass?: VueClassType
  titleKey?: string
  descriptionKey?: string
  listElementClass?: string
}>(), {
  titleClass: 'text-sm font-medium text-gray-1100',
  titleKey: 'title',
  descriptionKey: 'description',
  listElementClass: 'border-b border-dashed border-gray-40 last:border-b-0'
})

const activeIndex = defineModel<number>({ default: -1 })

function toggleActiveItem(isExpand: boolean, index: number) {
  activeIndex.value = isExpand ? index : -1
}

interface Slots {
  header?(props: {
    item: ItemType
    isExpanded: boolean
    toggleActiveItem: () => void
  }): void
  icon?(props: { isExpanded: boolean }): void
  description?(props: { item: ItemType }): void
}

defineSlots<Slots>()
</script>

<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="index"
      :class="listElementClass"
      class="flex flex-col overflow-hidden"
    >
      <ExpansionPanel
        :model-value="activeIndex === index"
        :title="item[titleKey as keyof ItemType] as string"
        :title-class="titleClass"
        button-padding-class="py-3"
        icon-wrapper-size-class="size-5"
        icon-size-class="text-lg"
        @update:model-value="toggleActiveItem($event, index)"
      >
        <template #header>
          <slot
            name="header"
            v-bind="{
              isExpanded: activeIndex === index,
              item,
              toggleActiveItem: () => toggleActiveItem(activeIndex !== index, index)
            }"
          />
        </template>

        <template #icon>
          <slot name="icon" :is-expanded="activeIndex === index" />
        </template>

        <slot name="description" :item="item">
          <p class="pb-3 text-sm text-gray-300" v-html="item[descriptionKey as keyof ItemType] as string" />
        </slot>
      </ExpansionPanel>
    </li>
  </ul>
</template>
