import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ToggleGroup } from './index';

const meta: Meta<typeof ToggleGroup> = {
    title: 'Components/ToggleGroup',
    component: ToggleGroup,
    tags: ['autodocs'],
    argTypes:{
        size:{
            control: 'select',
            options: ['small', 'medium', 'large']
        },
        type:{
            control: 'select',
            options: ['single', 'multiple']
        },
        disabled:{
            control: 'boolean'
        },
        pressed:{
            control: 'object'
        },
        defaultPressed:{
            control: 'object'
        }
    }
}

export default meta;

type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
    render:() => (
        <ToggleGroup>
            <ToggleGroup.Item value="1">1</ToggleGroup.Item>
            <ToggleGroup.Item value="2">2</ToggleGroup.Item>
            <ToggleGroup.Item value="3">3</ToggleGroup.Item>
        </ToggleGroup>
    )
}

export const Size: Story = {
    render:() => (
        <>
            <div className="mt-4 mb-2">Size: small</div>
            <ToggleGroup size="small">
                <ToggleGroup.Item value="1">1</ToggleGroup.Item>
                <ToggleGroup.Item value="2">2</ToggleGroup.Item>
                <ToggleGroup.Item value="3">3</ToggleGroup.Item>
            </ToggleGroup>
            <div className="mt-4 mb-2">Size: medium</div>
            <ToggleGroup size="medium">
                <ToggleGroup.Item value="1">1</ToggleGroup.Item>
                <ToggleGroup.Item value="2">2</ToggleGroup.Item>
                <ToggleGroup.Item value="3">3</ToggleGroup.Item>
            </ToggleGroup>
            <div className="mt-4 mb-2">Size: large</div>
            <ToggleGroup size="large">
                <ToggleGroup.Item value="1">1</ToggleGroup.Item>
                <ToggleGroup.Item value="2">2</ToggleGroup.Item>
                <ToggleGroup.Item value="3">3</ToggleGroup.Item>
            </ToggleGroup>
        </>
    )
}

export const Disabled: Story = {
    render:() => (
        <ToggleGroup disabled>
            <ToggleGroup.Item value="1">1</ToggleGroup.Item>
            <ToggleGroup.Item value="2">2</ToggleGroup.Item>
            <ToggleGroup.Item value="3">3</ToggleGroup.Item>
        </ToggleGroup>
    )
}

export const ClickType: Story = {
    render:() => (
        <>
            <div className="mt-4 mb-2">Type: single</div>
            <ToggleGroup type="single">
                <ToggleGroup.Item value="1">1</ToggleGroup.Item>
                <ToggleGroup.Item value="2">2</ToggleGroup.Item>
                <ToggleGroup.Item value="3">3</ToggleGroup.Item>
            </ToggleGroup>
            <div className="mt-4 mb-2">Type: multiple</div>
            <ToggleGroup type="multiple">
                <ToggleGroup.Item value="1">1</ToggleGroup.Item>
                <ToggleGroup.Item value="2">2</ToggleGroup.Item>
                <ToggleGroup.Item value="3">3</ToggleGroup.Item>
            </ToggleGroup>
        </>
    )
}

export const UnControlled: Story = {
    render:() => (
        <>
            <div className="mt-4 mb-2">SingleType</div>
            <ToggleGroup type="single" defaultPressed={["2"]}>
                <ToggleGroup.Item value="1">1</ToggleGroup.Item>
                <ToggleGroup.Item value="2">2</ToggleGroup.Item>
                <ToggleGroup.Item value="3">3</ToggleGroup.Item>
            </ToggleGroup>
            
            <div className="mt-4 mb-2">MultipleType</div>
            <ToggleGroup type="multiple" defaultPressed={["1", "3"]}>
                <ToggleGroup.Item value="1">1</ToggleGroup.Item>
                <ToggleGroup.Item value="2">2</ToggleGroup.Item>
                <ToggleGroup.Item value="3">3</ToggleGroup.Item>
            </ToggleGroup>
        </>
    )
}

export const Controlled: Story = {
    render: () => {
        const ControlledToggleGroup = () => {
            const [singleValue, setSingleValue] = useState<string[]>(["2"]);
            const [multipleValues, setMultipleValues] = useState<string[]>(["1", "3"]);

            return (
                <>
                    <div className="mt-4 mb-2">MultipleType</div>
                    <ToggleGroup 
                        type="single" 
                        pressed={singleValue}
                        onChange={setSingleValue}
                    >
                        <ToggleGroup.Item value="1">1</ToggleGroup.Item>
                        <ToggleGroup.Item value="2">2</ToggleGroup.Item>
                        <ToggleGroup.Item value="3">3</ToggleGroup.Item>
                    </ToggleGroup>
                    
                    <div className="mt-4 mb-2">MultipleType</div>
                    <ToggleGroup 
                        type="multiple" 
                        pressed={multipleValues}
                        onChange={setMultipleValues}
                    >
                        <ToggleGroup.Item value="1">1</ToggleGroup.Item>
                        <ToggleGroup.Item value="2">2</ToggleGroup.Item>
                        <ToggleGroup.Item value="3">3</ToggleGroup.Item>
                    </ToggleGroup>
                </>
            );
        };
            
        return <ControlledToggleGroup />
    }
}