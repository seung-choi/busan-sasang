import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@plug/ui';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
    title: 'Components/Select',
    component: Select,
    tags: ['autodocs'],
      argTypes:{
          
      }
  };
  
  export default meta;
  type Story = StoryObj<typeof Select>;

  export const Default: Story = {
      render(args)  {
          return (
            <div className="flex flex-col items-center justify-center h-[400px]">
                <Select className="w-60" {...args}>
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="1">1번</Select.Item>
                        <Select.Item value="2">2번</Select.Item>
                        <Select.Item value="3">3번</Select.Item>
                        <Select.Item value="4">4번</Select.Item>
                        <Select.Item value="5">5번</Select.Item>
                        <Select.Item value="6">6번</Select.Item>
                        <Select.Item value="7">7번</Select.Item>
                        <Select.Item value="1">1번</Select.Item>
                        <Select.Item value="2">2번</Select.Item>
                        <Select.Item value="3">3번</Select.Item>
                        <Select.Item value="4">4번</Select.Item>
                        <Select.Item value="5">5번</Select.Item>
                        <Select.Item value="6">6번</Select.Item>
                        <Select.Item value="7">7번</Select.Item>
                    </Select.Content>
                </Select>
                <Select className="w-60" {...args}>
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="1">1번</Select.Item>
                        <Select.Item value="2">2번</Select.Item>
                        <Select.Item value="3">3번</Select.Item>
                        <Select.Item value="4">4번</Select.Item>
                        <Select.Item value="5">5번</Select.Item>
                        <Select.Item value="6">6번</Select.Item>
                        <Select.Item value="7">7번</Select.Item>
                        <Select.Item value="1">1번</Select.Item>
                        <Select.Item value="2">2번</Select.Item>
                        <Select.Item value="3">3번</Select.Item>
                        <Select.Item value="4">4번</Select.Item>
                        <Select.Item value="5">5번</Select.Item>
                        <Select.Item value="6">6번</Select.Item>
                        <Select.Item value="7">7번</Select.Item>
                    </Select.Content>
                </Select>
            </div>
        )
    }
}

export const Type: Story = {
    render()  {
        return (
        <>
          <div className="flex flex-col items-center justify-center h-[400px]">
            <div className="mt-4 mb-2">Type: Single</div>
              <Select className="w-60">
                  <Select.Trigger/>
                  <Select.Content>
                      <Select.Item value="1">1번</Select.Item>
                      <Select.Item value="2">2번</Select.Item>
                      <Select.Item value="3">3번</Select.Item>
                      <Select.Item value="4">4번</Select.Item>
                      <Select.Item value="5">5번</Select.Item>
                      <Select.Item value="6">6번</Select.Item>
                      <Select.Item value="7">7번</Select.Item>
                      <Select.Item value="1">1번</Select.Item>
                      <Select.Item value="2">2번</Select.Item>
                      <Select.Item value="3">3번</Select.Item>
                      <Select.Item value="4">4번</Select.Item>
                      <Select.Item value="5">5번</Select.Item>
                      <Select.Item value="6">6번</Select.Item>
                      <Select.Item value="7">7번</Select.Item>
                  </Select.Content>
              </Select>
            </div>
          <div className="flex flex-col items-center justify-center h-[400px]">
              <div className="mt-4 mb-2">Type: Multiple</div>
              <Select className="w-60" type="multiple">
                  <Select.Trigger placeholder="입력하세요" inputClassName="placeholder:text-sm"/>
                  <Select.Content>
                      <Select.Item value="1">1번</Select.Item>
                      <Select.Item value="2">2번</Select.Item>
                      <Select.Item value="3">3번</Select.Item>
                      <Select.Item value="4">4번</Select.Item>
                      <Select.Item value="5">5번</Select.Item>
                      <Select.Item value="6">6번</Select.Item>
                      <Select.Item value="7">7번</Select.Item>
                      <Select.Item value="1">1번</Select.Item>
                      <Select.Item value="2">2번</Select.Item>
                      <Select.Item value="3">3번</Select.Item>
                      <Select.Item value="4">4번</Select.Item>
                      <Select.Item value="5">5번</Select.Item>
                      <Select.Item value="6">6번</Select.Item>
                      <Select.Item value="7">7번</Select.Item>
                  </Select.Content>
              </Select>
          </div>
        </>
      )
    }
}

export const Variant: Story = {
    render()  {
        return (
        <>
          <div className="flex flex-col items-center justify-center h-[400px]">
            <div className="mt-4 mb-2">Variant: Default</div>
              <Select className="w-60">
                  <Select.Trigger/>
                  <Select.Content>
                      <Select.Item value="1">1번</Select.Item>
                      <Select.Item value="2">2번</Select.Item>
                      <Select.Item value="3">3번</Select.Item>
                      <Select.Item value="4">4번</Select.Item>
                      <Select.Item value="5">5번</Select.Item>
                      <Select.Item value="6">6번</Select.Item>
                      <Select.Item value="7">7번</Select.Item>
                      <Select.Item value="1">1번</Select.Item>
                      <Select.Item value="2">2번</Select.Item>
                      <Select.Item value="3">3번</Select.Item>
                      <Select.Item value="4">4번</Select.Item>
                      <Select.Item value="5">5번</Select.Item>
                      <Select.Item value="6">6번</Select.Item>
                      <Select.Item value="7">7번</Select.Item>
                  </Select.Content>
              </Select>
            </div>
          <div className="flex flex-col items-center justify-center h-[400px]">
              <div className="mt-4 mb-2">Variant: Error</div>
              <Select className="w-60" variant="error">
                  <Select.Trigger/>
                  <Select.Content>
                      <Select.Item value="1">1번</Select.Item>
                      <Select.Item value="2">2번</Select.Item>
                      <Select.Item value="3">3번</Select.Item>
                      <Select.Item value="4">4번</Select.Item>
                      <Select.Item value="5">5번</Select.Item>
                      <Select.Item value="6">6번</Select.Item>
                      <Select.Item value="7">7번</Select.Item>
                      <Select.Item value="1">1번</Select.Item>
                      <Select.Item value="2">2번</Select.Item>
                      <Select.Item value="3">3번</Select.Item>
                      <Select.Item value="4">4번</Select.Item>
                      <Select.Item value="5">5번</Select.Item>
                      <Select.Item value="6">6번</Select.Item>
                      <Select.Item value="7">7번</Select.Item>
                  </Select.Content>
              </Select>
          </div>
        </>
      )
    }
}

export const Controlled: Story = {
    render() {
        const SelectedController = () => {
            const [selected, setSelected] = useState<string[]>(['1', '2']);
            
            const handleChange = (newValues: string[]) => {
                setSelected(newValues);
            };
            
            return (
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <div className="text-sm text-gray-600">
                        선택된 값: {selected.join(', ')}
                    </div>
                    <Select 
                        className="w-60" 
                        type="multiple"
                        selected={selected}
                        onChange={handleChange}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Item value="1">1번</Select.Item>
                            <Select.Item value="2">2번</Select.Item>
                            <Select.Item value="3">3번</Select.Item>
                            <Select.Item value="4">4번</Select.Item>
                            <Select.Item value="5">5번</Select.Item>
                            <Select.Item value="6">6번</Select.Item>
                            <Select.Item value="7">7번</Select.Item>
                            <Select.Item value="1">1번</Select.Item>
                            <Select.Item value="2">2번</Select.Item>
                            <Select.Item value="3">3번</Select.Item>
                            <Select.Item value="4">4번</Select.Item>
                            <Select.Item value="5">5번</Select.Item>
                            <Select.Item value="6">6번</Select.Item>
                            <Select.Item value="7">7번</Select.Item>
                        </Select.Content>
                    </Select>
                </div>
            );
        }

        return <SelectedController />
        
    }
};