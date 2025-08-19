import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './Radio';
import { useState } from 'react';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
    argTypes:{
        color:{
            control: 'select',
            options: ['primary', 'secondary']
        },
        size:{
            control: 'select',
            options: ['small', 'medium', 'large']
        },
        disabled:{
          control: 'boolean'
        }
    }
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;
export const Default: Story = {
    render(args) {
      return (
          <RadioGroup {...args} name="default">
              <RadioGroupItem value="default1" label="Radio label"/>
              <RadioGroupItem value="default2" label="Radio label"/>
              <RadioGroupItem value="default3" label="Radio label"/>
          </RadioGroup>
      );
    }
  }

export const Color: Story = {
  render() {
    return (
      <>
        <div className="mt-4 mb-2">Color: primary</div>
        <RadioGroup name="primary">
            <RadioGroupItem value="primary1" label="primary color"/>
            <RadioGroupItem value="primary2" label="primary color"/>
            <RadioGroupItem value="primary3" label="primary color"/>
        </RadioGroup>
        <div className="mt-4 mb-2">Color: secondary</div>
        <RadioGroup name="secondary" color="secondary">
            <RadioGroupItem value="secondary1" label="secondary color"/>
            <RadioGroupItem value="secondary2" label="secondary color"/>
            <RadioGroupItem value="secondary3" label="secondary color"/>
        </RadioGroup>
      </>
    );
  }
}

export const Disabled: Story = {
  render(args) {
      return (
        <RadioGroup {...args} name="disabled" disabled>
            <RadioGroupItem value="disabled1" label="disabled"/>
            <RadioGroupItem value="disabled2" label="disabled"/>
            <RadioGroupItem value="disabled3" label="disabled"/>
        </RadioGroup>
      )
  }
}

export const Custom: Story = {
  render(args) {
      return (
        <RadioGroup {...args} name="custom">
            <RadioGroupItem 
              value="custom1" 
              label="custom" 
              className="text-orange-500" 
              inputClassName="border-orange-500 after:bg-orange-500" 
            />
            <RadioGroupItem 
              value="custom2" 
              label="custom" 
              className="text-orange-500 " 
              inputClassName="border-orange-500 after:bg-orange-500" 
            />
            <RadioGroupItem 
              value="custom3" 
              label="custom" 
              className="text-orange-500 " 
              inputClassName="border-orange-500 after:bg-orange-500" 
            />
        </RadioGroup>
      )
  }
}

export const Uncontrolled: Story = {
  render: () => (
    <div className="space-y-4">
      <RadioGroup name="uncontrolled" defaultValue="option2">
        <RadioGroupItem value="option1" label="옵션 1" />
        <RadioGroupItem value="option2" label="옵션 2" />
        <RadioGroupItem value="option3" label="옵션 3" />
      </RadioGroup>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const ControlledRadio = () => {
      const [selectedValue, setSelectedValue] = useState('option1');
      
      return (
        <>
          <div className="mt-4 mb-2">현재 선택된 값: {selectedValue}</div>
          <RadioGroup 
            name="controlled" 
            selected={selectedValue} 
            onChange={(value) => setSelectedValue(value)}
          >
              <RadioGroupItem value="option1" label="옵션 1" />
              <RadioGroupItem value="option2" label="옵션 2" />
              <RadioGroupItem value="option3" label="옵션 3" />
          </RadioGroup>    
        </>
      );
    };

    return <ControlledRadio />
  },
};