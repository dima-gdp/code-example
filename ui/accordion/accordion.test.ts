import { mount } from '@vue/test-utils'
import { test, expect, describe } from 'vitest'
import { nextTick } from 'vue'

import Accordion from '@ui/components/accordion/Accordion.vue'
import ExpansionPanel from '@ui/components/expansion-panel/ExpansionPanel.vue'

const items = [
  { title: 'Question 1', description: 'Answer 1' },
  { title: 'Question 2', description: 'Answer 2' }
]

const customKeysItems = [
  { question: 'Question 1', answer: 'Answer 1' }
]

describe('Accordion', () => {
  test('Should render the correct number of items', () => {
    const wrapper = mount(Accordion, {
      props: { items }
    })

    const listItems = wrapper.findAllComponents(ExpansionPanel)
    expect(listItems.length).toBe(items.length)
  })

  test('Should display title and description correctly', () => {
    const wrapper = mount(Accordion, {
      props: { items }
    })

    const firstItem = wrapper.findAllComponents(ExpansionPanel)[0]
    const lastItem = wrapper.findAllComponents(ExpansionPanel)[1]

    expect(firstItem.props().title).toBe(items[0].title)
    expect(firstItem.find('[data-cy="expand-content"]').text()).toBe(items[0].description)

    expect(lastItem.props().title).toBe(items[1].title)
    expect(lastItem.find('[data-cy="expand-content"]').text()).toBe(items[1].description)
  })

  test('Should toggle active item correctly', async () => {
    const wrapper = mount(Accordion, {
      attachTo: document.body,
      props: {
        items,
        modelValue: -1
      }
    })

    const firstItem = wrapper.findAllComponents(ExpansionPanel)[0]
    const secondItem = wrapper.findAllComponents(ExpansionPanel)[1]

    // Проверяем, что нет активного элемента
    expect(firstItem.props().modelValue).toBeFalsy()
    expect(secondItem.props().modelValue).toBeFalsy()

    // Кликаем по первому элементу
    firstItem.vm.$emit('update:modelValue', true)
    await nextTick()
    expect(firstItem.props().modelValue).toBeTruthy()
    expect(secondItem.props().modelValue).toBeFalsy()

    // Кликаем по первому элементу снова, чтобы закрыть его
    firstItem.vm.$emit('update:modelValue', false)
    await nextTick()
    expect(firstItem.props().modelValue).toBeFalsy()
    expect(secondItem.props().modelValue).toBeFalsy()
  })

  test('Should have header slot', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items
      },
      slots: {
        header: '<button id="header" @click="toggleActiveItem">{{item.title}}{{isExpanded}}</button>'
      }
    })
    const firstItem = wrapper.find('li')

    // Проверим slot data
    expect(firstItem.find('#header').text()).toBe(items[0].title + 'false')
    await firstItem.find('#header').trigger('click')
    expect(firstItem.find('#header').text()).toBe(items[0].title + 'true')
  })

  test('Should have icon slot', () => {
    const wrapper = mount(Accordion, {
      props: {
        items,
        modelValue: 0
      },
      slots: {
        icon: '<span id="icon">{{isExpanded}}</span>'
      }
    })
    const firstItem = wrapper.find('li')

    expect(firstItem.find('#icon').text()).toBe('true')
  })

  test('Should have description slot', () => {
    const wrapper = mount(Accordion, {
      props: {
        items,
        modelValue: 0
      },
      slots: {
        description: '<span id="custom">{{item.description}}</span>'
      }
    })
    const firstItem = wrapper.find('li')

    expect(firstItem.find('#custom').text()).toBe(items[0].description)
  })

  test('Should correctly applies titleFontClass', async () => {
    const wrapper = mount(Accordion, {
      props: { items }
    })

    const firstItem = wrapper.findComponent(ExpansionPanel)
    // Проверим дефолтный класс
    expect(firstItem.props().titleClass).toBe('text-sm font-medium text-gray-1100')

    const newClass = 'custom-class'
    await wrapper.setProps({ titleClass: newClass })
    expect(firstItem.props().titleClass).toBe(newClass)
  })

  test('Should applies listElementClass', async () => {
    const wrapper = mount(Accordion, {
      props: { items }
    })

    const firstItem = wrapper.find('li')
    // Проверим дефолтный класс
    expect(firstItem.classes().join(' ')).include('border-b border-dashed border-gray-40 last:border-b-0')

    const newClass = 'custom-class'
    await wrapper.setProps({ listElementClass: newClass })
    expect(firstItem.classes().join(' ')).include('custom-class')
  })

  test('Should correctly applies item keys props', () => {
    const wrapper = mount(Accordion, {
      props: {
        items: customKeysItems,
        titleKey: 'question',
        descriptionKey: 'answer'
      }
    })

    const firstItem = wrapper.findComponent(ExpansionPanel)

    expect(firstItem.props().title).toBe(customKeysItems[0].question)
    expect(firstItem.find('[data-cy="expand-content"]').text()).toBe(customKeysItems[0].answer)
  })
})
