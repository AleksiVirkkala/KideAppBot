import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'
import { MainContainer } from '../helpers/Content/MainContainer'
import { Default } from '../helpers/Content/MainContainer.stories'

import { Page } from './Page'

const meta: Meta<typeof Page> = {
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  },
  args: {
    children: <MainContainer {...Default.args} />
  }
}

export default meta
type Story = StoryObj<typeof Page>

export const LoggedOut: Story = {}

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
export const LoggedIn: Story = {
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const loginButton = canvas.getByRole('button', {
      name: /Log in/i
    })
    userEvent.click(loginButton)
  }
}
