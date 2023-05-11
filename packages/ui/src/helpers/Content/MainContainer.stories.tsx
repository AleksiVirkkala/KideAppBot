import type { Meta, StoryObj } from '@storybook/react'
import { MainContainer } from './MainContainer'
import { ContentContainer } from './ContentContainer'
import { SampleContent } from './SampleContent'
import { Divider } from './Divider'

const meta: Meta<typeof MainContainer> = {
  component: MainContainer,
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta
type Story = StoryObj<typeof MainContainer>

export const Default: Story = {
  args: {
    className: 'h-[500px] flex flex-col',
    children: (
      <>
        <ContentContainer className="flex-1">
          <SampleContent className="h-full" />
        </ContentContainer>
        <Divider />
        <ContentContainer className="flex-1">
          <SampleContent className="h-full" />
        </ContentContainer>
      </>
    )
  }
}

export const WithHighlighting: Story = {
  args: {
    className: 'h-[500px] bg-green-200 flex flex-col',
    children: (
      <>
        <ContentContainer className="flex-1 bg-red-200">
          <SampleContent className="h-full" />
        </ContentContainer>
        <Divider className="z-10 bg-slate-500" />
        <ContentContainer className="flex-1 bg-red-200">
          <SampleContent className="h-full" />
        </ContentContainer>
      </>
    )
  }
}
