import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '@plug/ui';
import { Button } from '@plug/ui';
import { Input } from '../Input/Input';
import { useState } from 'react';

const meta: Meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['single', 'multiple'],
        },
        variant: {
            control: 'select',
            options: ['default', 'error'],
        },
        disabled: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div className="flex items-center justify-center h-[400px]">
            <Dropdown {...args}>
                <Dropdown.Trigger>
                    <Button variant="outline" color="primary">
                        드롭다운 버튼
                    </Button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                    <Dropdown.Item value="1번">1번</Dropdown.Item>
                    <Dropdown.Item value="2번">2번</Dropdown.Item>
                    <Dropdown.Item value="3번">3번</Dropdown.Item>
                    <Dropdown.Item value="4번">4번</Dropdown.Item>
                    <Dropdown.Item value="5번">5번</Dropdown.Item>
                    <Dropdown.Item value="6번">6번</Dropdown.Item>
                </Dropdown.Content>
            </Dropdown>
        </div>
    ),
}

export const Type: Story = {
    render: () => (
        <>
            <div className="flex flex-col items-center justify-center h-[400px]">
            <div className="mt-4 mb-2">Type: Single</div>
                <Dropdown>
                    <Dropdown.Trigger>
                        <Button variant="outline" color="primary">
                            드롭다운 버튼
                        </Button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Item value="1번">1번</Dropdown.Item>
                        <Dropdown.Item value="2번">2번</Dropdown.Item>
                        <Dropdown.Item value="3번">3번</Dropdown.Item>
                        <Dropdown.Item value="4번">4번</Dropdown.Item>
                        <Dropdown.Item value="5번">5번</Dropdown.Item>
                        <Dropdown.Item value="6번">6번</Dropdown.Item>
                    </Dropdown.Content>
                </Dropdown>
            </div>
            <div className="flex flex-col items-center justify-center h-[400px]">
                <div className="mt-4 mb-2">Variant: Multiple</div>
                <Dropdown type="multiple">
                    <Dropdown.Trigger>
                        <Button variant="outline" color="primary">
                            드롭다운 버튼
                        </Button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Item value="1번">1번</Dropdown.Item>
                        <Dropdown.Item value="2번">2번</Dropdown.Item>
                        <Dropdown.Item value="3번">3번</Dropdown.Item>
                        <Dropdown.Item value="4번">4번</Dropdown.Item>
                        <Dropdown.Item value="5번">5번</Dropdown.Item>
                        <Dropdown.Item value="6번">6번</Dropdown.Item>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </>
    ),
}

export const Variant: Story = {
    render: () => (
        <>
            <div className="flex flex-col items-center justify-center h-[400px]">
            <div className="mt-4 mb-2">Variant: Default</div>
                <Dropdown>
                    <Dropdown.Trigger>
                        <Button variant="outline" color="primary">
                            드롭다운 버튼
                        </Button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Item value="1번">1번</Dropdown.Item>
                        <Dropdown.Item value="2번">2번</Dropdown.Item>
                        <Dropdown.Item value="3번">3번</Dropdown.Item>
                        <Dropdown.Item value="4번">4번</Dropdown.Item>
                        <Dropdown.Item value="5번">5번</Dropdown.Item>
                        <Dropdown.Item value="6번">6번</Dropdown.Item>
                    </Dropdown.Content>
                </Dropdown>
            </div>
            <div className="flex flex-col items-center justify-center h-[400px]">
                <div className="mt-4 mb-2">Variant: Error</div>
                <Dropdown variant='error'>
                    <Dropdown.Trigger>
                        <Button variant="outline" color="primary">
                            드롭다운 버튼
                        </Button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Item value="1번">1번</Dropdown.Item>
                        <Dropdown.Item value="2번">2번</Dropdown.Item>
                        <Dropdown.Item value="3번">3번</Dropdown.Item>
                        <Dropdown.Item value="4번">4번</Dropdown.Item>
                        <Dropdown.Item value="5번">5번</Dropdown.Item>
                        <Dropdown.Item value="6번">6번</Dropdown.Item>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </>
    ),
}

export const Disabled: Story = {
    render: () => (
        <div className="flex items-center justify-center h-[400px]">
            <Dropdown disabled>
                <Dropdown.Trigger>
                    <Button variant="outline" color="primary">
                        드롭다운 버튼
                    </Button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                    <Dropdown.Item value="1번">1번</Dropdown.Item>
                    <Dropdown.Item value="2번">2번</Dropdown.Item>
                    <Dropdown.Item value="3번">3번</Dropdown.Item>
                    <Dropdown.Item value="4번">4번</Dropdown.Item>
                    <Dropdown.Item value="5번">5번</Dropdown.Item>
                    <Dropdown.Item value="6번">6번</Dropdown.Item>
                </Dropdown.Content>
            </Dropdown>
        </div>
    ),
}

export const ControlledDropdown: Story = {
    render: () => {
        const ControlledDropdown = () => {

            const [selected, setSelected] = useState<string[]>([]);
            const handleChange = (newSelected: string[]) => {
                setSelected(newSelected);
            };

            return (
                <div className="flex items-center justify-center h-[400px]">
                    <Dropdown
                        type="multiple"
                        selected={selected}
                        onChange={handleChange}
                    >
                        <Dropdown.Trigger>
                            <Input 
                                readOnly
                                value={selected.join(', ')}
                                onChange={() => {}}
                                placeholder="선택하세요" 
                            />
                        </Dropdown.Trigger>
                        <Dropdown.Content >
                            <Dropdown.Item value="1번">1번</Dropdown.Item>
                            <Dropdown.Item value="2번">2번</Dropdown.Item>
                            <Dropdown.Item value="3번">3번</Dropdown.Item>
                            <Dropdown.Item value="4번">4번</Dropdown.Item>
                            <Dropdown.Item value="5번">5번</Dropdown.Item>
                            <Dropdown.Item value="6번">6번</Dropdown.Item>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            )
        };

        return <ControlledDropdown />;
    }
}
