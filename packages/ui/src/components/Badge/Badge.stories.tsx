import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes : {
        color: {
            control : 'select',
            options : ['primary', 'secondary' ,'destructive'],
        },
        size: {
            control : 'select',
            options : ['xsmall', 'small', 'medium', 'large'],
        },
        className: {
          control : 'text'
        },
    }   
};

export default meta;

type Story = StoryObj<typeof Badge>

export const Primary: Story = {
    args: {
      color: 'primary',
      size:'xsmall',
      children: 'message',
      label: 'badge'
    },
  };

export const Destructive: Story = {
    args: {
      color: 'destructive',
      size: 'xsmall',
      children: 'notice',
      label: 'badge'
    },
  };

export const Colors: Story = {
  render: () => (
      <>
        <div className="mt-4">Primary:</div>
        <Badge color="primary" size="medium">Primary Badge</Badge>
        <div className="mt-4">Secondary:</div>
        <Badge color="secondary" size="medium">Secondary Badge</Badge>
        <div className="mt-4">Destructive:</div>
        <Badge color="destructive" size="medium">Destructive Badge</Badge>
      </>
    )
};

export const Sizes: Story = {
    render: () => (
      <>
        <div className="mt-4">XSmall:</div>
        <Badge color="primary" size="xsmall">XSmall Badge</Badge>
        <div className="mt-4">Small:</div>
        <Badge color="primary" size="small">Small Badge</Badge>
        <div className="mt-4">Medium:</div>
        <Badge color="primary" size="medium">Medium Badge</Badge>
        <div className="mt-4">Large:</div>
        <Badge color="primary" size="large">Large Badge</Badge>
      </>
    )
};
