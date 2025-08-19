import type { Meta, StoryObj } from '@storybook/react';
import { Time } from './Time';

const meta: Meta<typeof Time> = {
  title: 'Components/Time',
  component: Time,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    format:{
      control: 'select',
      options:['HH:mm:ss', 'HH:mm', 'YYYY-MM-DD', 'locale']
    },
  },
};

export default meta;

type Story = StoryObj<typeof Time>;

export const Primary: Story = {
  args: {
    color: 'primary',
    size:'small',
    format : 'YYYY-MM-DD HH:mm:ss',
  },
};

export const Colors: Story = {
  render: () => (
    <>
      <div>Primary:</div>
      <Time 
        color="primary" 
        size="small" 
        format="YYYY-MM-DD HH:mm:ss"
      />
      <div className="mt-4">Secondary:</div>
      <Time 
        color="secondary" 
        size="small" 
        format="YYYY-MM-DD HH:mm:ss"
      />
    </>
  )
};

export const Sizes: Story = {
  render: () => (
    <>
      <div>Small:</div>
      <Time 
        color="primary" 
        size="small" 
        format="YYYY-MM-DD HH:mm:ss"
      />
      <div className="mt-4">Medium:</div>
      <Time 
        color="primary" 
        size="medium" 
        format="YYYY-MM-DD HH:mm:ss"
      />
      <div className="mt-4">Large:</div>
      <Time 
        color="primary" 
        size="large" 
        format="YYYY-MM-DD HH:mm:ss"
      />
    </>
  )
};



