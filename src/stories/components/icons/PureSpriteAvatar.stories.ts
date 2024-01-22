import type { Meta, StoryObj } from '@storybook/react';

import { PureSpriteAvatar } from '@/components/icons/PureSpriteAvatar';

const meta = {
  title: 'icons/PureSpriteAvatar',
  component: PureSpriteAvatar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    speciesId: {
      options: ['Pikachu', 'Charizard', 'Mewtwo', 'Rotom-Wash', 'Tapu Koko', 'Zacian-Crowned', 'Ogerpon'],
      control: { type: 'select' },
    },
    shiny: {
      control: { type: 'boolean' },
    },
    gender: {
      options: ['M', 'F', 'N'],
      control: { type: 'radio' },
    },
    gen: {
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      control: { type: 'select' },
    },
    showName: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'range', min: 16, max: 256, step: 16 },
    },
  },
} satisfies Meta<typeof PureSpriteAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Icon: Story = {
  args: {
    speciesId: 'Pikachu',
    shiny: false,
    gender: 'M',
    gen: 8,
    showName: true,
  },
};
