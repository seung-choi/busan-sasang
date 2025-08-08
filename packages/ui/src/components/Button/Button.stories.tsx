import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import MenuIcon from '../../assets/icons/menu.svg';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'icon'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    }
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    color: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    color: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <MenuIcon />,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...'
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const Custom: Story = {
  args: {
    className: "bg-green-500 text-white hover:bg-green-700",
    children: 'Custom'
  },
};
