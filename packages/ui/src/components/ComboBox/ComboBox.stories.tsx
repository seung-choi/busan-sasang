import type { Meta, StoryObj } from '@storybook/react';
import { ComboBox } from '@plug/ui';
import { ComboBoxContent } from './ComboBox';
import { useState } from 'react';

const meta: Meta<typeof ComboBox> = {
  title: 'Components/ComboBox',
  component: ComboBox,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    
  }
}

export default meta;
type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {
    render: (args) => (
        <div className="flex items-center justify-center h-[400px]">
            <ComboBox {...args}>
                <ComboBox.Trigger />
                <ComboBoxContent>
                    <ComboBox.Item value="1번">1번</ComboBox.Item>
                    <ComboBox.Item value="2번">2번</ComboBox.Item>
                    <ComboBox.Item value="3번">3번</ComboBox.Item>
                    <ComboBox.Item value="111번">111번</ComboBox.Item>
                </ComboBoxContent>
            </ComboBox>
        </div>
    )
}

export const Disabled: Story = {
    render: (args) => (
        <div className="flex items-center justify-center h-[400px]">
            <ComboBox {...args} disabled>
                <ComboBox.Trigger />
                <ComboBoxContent>
                    <ComboBox.Item value="1번">1번</ComboBox.Item>
                    <ComboBox.Item value="2번">2번</ComboBox.Item>
                    <ComboBox.Item value="3번">3번</ComboBox.Item>
                    <ComboBox.Item value="111번">111번</ComboBox.Item>
                </ComboBoxContent>
            </ComboBox>
        </div>
    )
}

export const Custom: Story = {
    render: (args) => (
        <div className="flex items-center justify-center h-[400px]">
            <ComboBox {...args}>
                <ComboBox.Trigger placeholder="문구를 입력하세요" inputClassName="text-xs"/>
                <ComboBoxContent inputClassName="text-xs" className="[&>*]:text-xs">
                    <ComboBox.Item value="사과">사과</ComboBox.Item>
                    <ComboBox.Item value="오렌지">오렌지</ComboBox.Item>
                    <ComboBox.Item value="바나나">바나나</ComboBox.Item>
                    <ComboBox.Item value="레몬">레몬</ComboBox.Item>
                </ComboBoxContent>
            </ComboBox>
        </div>
    )
}

export const Controlled: Story = {
    render: () => {
        const ControlledComboBox = () => {
            const [selected, setSelected] = useState<string>("");
            
            return (
                <div className="flex flex-col items-center justify-center h-[400px]">
                    <div className="my-2">선택된 값: {selected}</div>
                    <ComboBox 
                        selected={selected}
                        onChange={(value) => setSelected(value)}
                    >
                        <ComboBox.Trigger />
                        <ComboBoxContent>
                            <ComboBox.Item value="1번">1번</ComboBox.Item>
                            <ComboBox.Item value="2번">2번</ComboBox.Item>
                            <ComboBox.Item value="3번">3번</ComboBox.Item>
                        </ComboBoxContent>
                    </ComboBox>
                    
                </div>
            );
        }
        return <ControlledComboBox />;
    }
}
