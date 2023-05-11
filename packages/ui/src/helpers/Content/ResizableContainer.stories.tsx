import type { Meta, StoryObj } from '@storybook/react'
import { ResizableContainer } from './ResizableContainer'
import { SampleContent } from './SampleContent'

const Child = ({ children }: { children: React.ReactNode }) => (
  <SampleContent className="h-32 rounded-none bg-red-300"></SampleContent>
  // <div className="h-full w-full">{children}</div>
)

const meta: Meta<typeof ResizableContainer> = {
  component: ResizableContainer,
  args: {
    containerClassName: 'bg-red-200',
    children: <Child>Hello!</Child>
  }
}

export default meta
type Story = StoryObj<typeof ResizableContainer>

export const Default: Story = {}
export const WithInitialWidth: Story = {
  args: {
    initialWidth: 300,
    children: <Child>Initially 300px wide</Child>
  }
}

export const WithMinWidth: Story = {
  args: {
    minWidth: 400,
    children: <Child>Min width 400px</Child>
  }
}

export const FullSize: Story = {
  args: {
    fullSize: true,
    children: <Child>Full size</Child>
  }
}
