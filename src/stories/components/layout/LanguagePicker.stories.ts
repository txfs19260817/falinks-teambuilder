import type { Meta, StoryObj } from '@storybook/react';

import { LanguagePicker } from '@/components/layout/LanguagePicker';

const meta = {
  title: 'layout/LanguagePicker',
  component: LanguagePicker,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LanguagePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
