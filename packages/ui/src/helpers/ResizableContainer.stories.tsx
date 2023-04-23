import type { Meta, StoryObj } from '@storybook/react'
import { ResizableContainer } from './ResizableContainer'

const meta: Meta<typeof ResizableContainer> = {
  component: ResizableContainer
}

export default meta
type Story = StoryObj<typeof ResizableContainer>

export const Default: Story = {}
