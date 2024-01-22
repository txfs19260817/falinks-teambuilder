import type { Meta, StoryObj } from '@storybook/react';

import { Navbar } from '@/components/layout/Navbar';

const meta = {
  title: 'layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
