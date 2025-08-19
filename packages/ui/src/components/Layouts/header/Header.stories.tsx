import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Layouts/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    logoSrc: { control: 'text' },
    onLogoClick: { action: 'logo clicked' },
    children: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const DefaultHeader: Story = {
  args: {
    logoSrc: '/logo.svg',
    children: 'Additional Header Content',
    className: '',
  },
};