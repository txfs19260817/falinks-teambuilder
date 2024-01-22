import type { Meta, StoryObj } from '@storybook/react';

import { CategoryIcon } from '@/components/icons/CategoryIcon';

const meta = {
  title: 'icons/CategoryIcon',
  component: CategoryIcon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    category: {
      options: ['Physical', 'Special', 'Status'],
      control: { type: 'radio' },
    },
    width: {
      control: { type: 'range', min: 16, max: 64, defaultValue: 32 },
    },
    height: {
      control: { type: 'range', min: 7, max: 28, defaultValue: 14 },
    },
  },
} satisfies Meta<typeof CategoryIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Physical: Story = {
  args: {
    category: 'Physical',
  },
};

export const Special: Story = {
  args: {
    category: 'Special',
  },
};

export const Status: Story = {
  args: {
    category: 'Status',
  },
};
