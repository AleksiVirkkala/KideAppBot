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
    children: (
      <>
        <ContentContainer>
          <SampleContent />
        </ContentContainer>
        <Divider />
        <ContentContainer>
          <SampleContent />
        </ContentContainer>
      </>
    )
  }
}

export const WithHighlighting: Story = {
  args: {
    className: 'bg-green-200',
    children: (
      <>
        <ContentContainer className="bg-red-200">
          <SampleContent />
        </ContentContainer>
        <Divider className="z-10 bg-slate-500" />
        <ContentContainer className="bg-red-200">
          <SampleContent />
        </ContentContainer>
      </>
    )
  }
}
