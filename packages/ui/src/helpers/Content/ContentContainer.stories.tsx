import type { Meta, StoryObj } from '@storybook/react'
import { ContentContainer } from './ContentContainer'
import { SampleContent } from './SampleContent'

const meta: Meta<typeof ContentContainer> = {
  component: ContentContainer,
  args: {
    className: 'bg-green-200',
    children: <SampleContent />
  }
}

export default meta
type Story = StoryObj<typeof ContentContainer>

export const Default: Story = {}
