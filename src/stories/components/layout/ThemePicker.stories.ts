import type { Meta, StoryObj } from '@storybook/react';

import { ThemePicker } from '@/components/layout/ThemePicker';

const meta = {
  title: 'layout/ThemePicker',
  component: ThemePicker,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ThemePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
