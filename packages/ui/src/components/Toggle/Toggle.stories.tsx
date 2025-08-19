import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
    title: 'Components/Toggle',
    component: Toggle,
    tags: ['autodocs'],
    argTypes:{
        size:{
            control: 'select',
            options: ['small', 'medium', 'large']
        }
    }

}

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
    render:(args) => (
        <Toggle {...args}>B</Toggle>
    )
}

export const Size: Story = {
    render:() => (
        <>
            <div className="mt-4 mb-2">Size: small</div>
            <Toggle size="small">A</Toggle>

            <div className="mt-4 mb-2">Size: medium</div>
            <Toggle size="medium">A</Toggle>

            <div className="mt-4 mb-2">Size: large</div>
            <Toggle size="large">A</Toggle> 
        </>
    )
}

export const Disabled: Story = {
    render:(args) => (
        <Toggle {...args} disabled>B</Toggle>
    )
}


export const Controlled: Story = {
    render:() => {
        const ControlledToggle = () => {
            const [isToggled, setIsToggled] = useState(false);
            
            const handleToggle = () => {
                setIsToggled(!isToggled);
            };
            
            return (
                <Toggle 
                    pressed={isToggled} 
                    onChange={handleToggle}
                >
                    {isToggled ? 'ON' : 'OFF'}
                </Toggle>
            );
        };

        return <ControlledToggle />;
    }
}