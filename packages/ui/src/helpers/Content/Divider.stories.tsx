import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'
import { SampleContent } from './SampleContent'
import { ContentContainer } from './ContentContainer'

const meta: Meta<typeof Divider> = {
  component: Divider
}

export default meta
type Story = StoryObj<typeof Divider>

export const Horizontal: Story = {
  decorators: [
    Story => (
      <div className="flex flex-col space-y-4">
        <SampleContent className="h-20" />
        <Story />
        <SampleContent className="h-20" />
      </div>
    )
  ]
}
export const Vertical: Story = {
  args: {
    vertical: true
  },
  decorators: [
    Story => (
      <div className="flex space-x-4">
        <SampleContent className="h-20 flex-1" />
        <Story />
        <SampleContent className="h-20 flex-1" />
      </div>
    )
  ]
}
