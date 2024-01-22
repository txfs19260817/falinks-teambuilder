import type { Meta, StoryObj } from '@storybook/react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';

const meta = {
  title: 'icons/PokemonIcon',
  component: PokemonIcon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    speciesId: {
      options: ['Pikachu', 'Charizard', 'Mewtwo', 'Rotom-Wash', 'Tapu Koko', 'Zacian-Crowned', 'Ogerpon'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof PokemonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Icon: Story = {
  args: {
    speciesId: 'Pikachu',
  },
};
