import type { Meta, StoryObj } from '@storybook/react';

import { ItemIcon } from '@/components/icons/ItemIcon';

const meta = {
  title: 'icons/ItemIcon',
  component: ItemIcon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    itemName: {
      options: ['Choice Specs', 'Choice Band', 'Choice Scarf', 'Life Orb', 'Leftovers', 'Assault Vest', 'Covert Cloak'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof ItemIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Icon: Story = {
  args: {
    itemName: 'Choice Specs',
  },
};
