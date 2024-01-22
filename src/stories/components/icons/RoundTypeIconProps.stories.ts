import type { Meta, StoryObj } from '@storybook/react';

import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';

const meta = {
  title: 'icons/RoundTypeIcon',
  component: RoundTypeIcon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    typeName: {
      options: [
        'Normal',
        'Fire',
        'Water',
        'Electric',
        'Grass',
        'Ice',
        'Fighting',
        'Poison',
        'Ground',
        'Flying',
        'Psychic',
        'Bug',
        'Rock',
        'Ghost',
        'Dragon',
        'Dark',
        'Steel',
        'Fairy',
        'Stellar',
        '???',
      ],
      control: { type: 'select' },
    },
    isTeraType: {
      control: { type: 'boolean' },
    },
    isRound: {
      control: { type: 'boolean' },
    },
    width: {
      control: { type: 'range', min: 0, max: 256, defaultValue: 32 },
    },
    height: {
      control: { type: 'range', min: 0, max: 256, defaultValue: 32 },
    },
  },
} satisfies Meta<typeof RoundTypeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Icon: Story = {
  args: {
    typeName: 'Normal',
    isTeraType: false,
    isRound: true,
    width: 32,
    height: 32,
  },
};
