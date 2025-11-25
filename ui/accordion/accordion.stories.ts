import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Accordion from './Accordion.vue'

const meta: Meta<typeof Accordion> = {
  title: 'Widgets/Accordion',
  // @ts-expect-error не совпадают типы
  component: Accordion,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof Accordion>

const items = [
  {
    title: 'What is Vue.js?',
    description: 'Vue.js is a progressive JavaScript framework for building user interfaces.'
  },
  {
    title: 'What is Storybook?',
    description: 'Storybook is an open-source tool for developing UI components in isolation.'
  },
  {
    title: 'What is TypeScript?',
    description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
  }
]

export const Default: Story = {
  args: {
    items
  }
}
