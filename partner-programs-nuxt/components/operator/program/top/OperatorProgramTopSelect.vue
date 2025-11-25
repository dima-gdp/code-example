<script setup lang="ts">
import { THEME_BLACK } from '@ui/components/input/container/themes'
import { useStatePageableSearchWithTyping } from '@ui/composables/state/pageable/search-with-typing'
import {
  postApiWebAuthOperatorAffiliateProgramFilter
} from '@ui/nuxt/api/generated/billing-auth-oper/oper-affiliate-program'
import type { AffiliateProgramBriefInfoOutDto } from '@ui/nuxt/types/generated/billing-auth-oper.dto'

const emit = defineEmits<{
  clickOption: [AffiliateProgramBriefInfoOutDto]
}>()

const { $safeExecute } = useNuxtApp()

const valueModel = defineModel<AffiliateProgramBriefInfoOutDto>()

const searchRequest = ref({ searchStr: '' })
// Не очень нравится компонент селекта, делал на основе дочернего компонента.
const {
  items: searchResultsItems,
  loading: isSearching,
  isTyping,
  search,
  isLastPage,
  loadNext,
  currentPage
} = useStatePageableSearchWithTyping<AffiliateProgramBriefInfoOutDto>(
  searchRequest,
  {
    debounceFnWrapper: $safeExecute,
    minSearchStrLength: 0,
    fetch: params => postApiWebAuthOperatorAffiliateProgramFilter({
      pageable: {
        pageSize: params.size,
        pageNumber: params.page
      },
      active: true,
      title: searchRequest.value.searchStr
    })
  }
)

const items = computed(() => searchResultsItems.value)
const loading = computed(() => currentPage.value === 0 && (isSearching.value || isTyping.value))

onMounted(() => {
  $safeExecute(loadNext)
})

watch(() => searchRequest.value.searchStr, () => {
  search()
})
</script>

<template>
  <ElementInputSearchSelectBase
    v-model="valueModel"
    v-model:search-str="searchRequest.searchStr"
    element-container-class="
      not-first:pt-3 first:before:hidden relative before:absolute before:top-1.5
      before:inset-x-2 before:h-0.5 before:bg-gray-20 before:rounded-full
    "
    :items="items"
    :loading="loading"
    :theme="THEME_BLACK"
    dropdown-list-class="max-h-79 pt-2 px-2"
    items-class="pb-2"
    size="md"
    hide-label
    placeholder="Выбрать программу"
    hide-remove-button
  >
    <template #item="{ item }">
      <div
        role="button"
        tabindex="0"
        class="flex flex-col gap-3 py-3 px-2.5 rounded-lg hover:bg-gray-20"
        data-cy="option"
        @click="emit('clickOption', item)"
      >
        <span class="text-sm font-medium">{{ item.title }}</span>
        <div class="text-xs">
          <span class="text-gray-300">Компания: </span>
          <span class="font-medium">{{ item.counterpartyCompany?.companyName }}</span>
        </div>
        <div class="text-xs">
          <span class="text-gray-300">Тип программы: </span>
          <span class="font-medium">{{ item.dictionaryProgramCategory.name }}</span>
        </div>
        <div class="text-xs">
          <span class="text-gray-300">Статус: </span>
          <span class="text-green-400 font-medium">
            Активная
          </span>
        </div>
      </div>
    </template>

    <template #after-list>
      <IntersectionWatcher
        v-if="!isLastPage && !loading"
        class="h-px"
        @intersect="$safeExecute(loadNext)"
      />
    </template>
  </ElementInputSearchSelectBase>
</template>

