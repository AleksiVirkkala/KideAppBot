import type { Meta, StoryObj } from '@storybook/react';
import { SettingsForm } from './SettingsForm';

const meta: Meta<typeof SettingsForm> = {
  component: SettingsForm
};

export default meta;
type Story = StoryObj<typeof SettingsForm>;

export const Default: Story = {};
