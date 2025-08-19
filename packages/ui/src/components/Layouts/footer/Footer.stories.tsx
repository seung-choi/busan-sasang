import type { Meta, StoryObj } from '@storybook/react';
import Footer from './Footer';

const metaFooter: Meta<typeof Footer> = {
  title: 'Components/Layouts/Footer',
  component: Footer,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
};

export default metaFooter;

export const DefaultFooter: StoryObj<typeof Footer> = {
  args: { children: '' },
};
