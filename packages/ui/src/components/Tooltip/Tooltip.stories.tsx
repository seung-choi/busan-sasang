import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './index';
import { Button } from '@plug/ui';

const meta: Meta<typeof Tooltip> = {
    title: 'Components/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    argTypes:{
        position: {
            control: "select",
            options: ["top", "bottom", "left", "right"]
        },
        trigger: {
            control: "select",
            options: ["hover", "focus", "touch"]
        },
    }
}

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    render:(args) => (
        <div className="flex items-center justify-center h-[300px]">
            <Tooltip {...args}>
                <Tooltip.Trigger>
                    <Button variant="outline" color="primary">
                        마우스를 올려보세요
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    기본 툴팁입니다
                </Tooltip.Content>
            </Tooltip>
        </div>
    )
}

export const Positions: Story = {
    render: () => (
        <div className="flex flex-col gap-8 items-center justify-center h-[400px]">
            <div className="flex gap-8">
                <Tooltip position="top">
                    <Tooltip.Trigger>
                        <Button variant="outline" color="primary">
                            상단(top)
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content >
                        상단에 표시되는 툴팁
                    </Tooltip.Content>
                </Tooltip>
                
                <Tooltip position="right">
                    <Tooltip.Trigger>
                        <Button variant="outline" color="primary">
                            우측(right)
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        우측에 표시되는 툴팁
                    </Tooltip.Content>
                </Tooltip>
            </div>
            
            <div className="flex gap-8">
                <Tooltip position="bottom">
                    <Tooltip.Trigger>
                        <Button variant="outline" color="primary">
                            하단(bottom)
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        하단에 표시되는 툴팁
                    </Tooltip.Content>
                </Tooltip>
                
                <Tooltip position="left">
                    <Tooltip.Trigger>
                        <Button variant="outline" color="primary">
                            좌측(left)
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        좌측에 표시되는 툴팁
                    </Tooltip.Content>
                </Tooltip>
            </div>
        </div>
    )
}

export const InteractionTypes: Story = {
    render: () => (
        <div className="flex flex-col gap-8 items-center justify-center h-[400px]">
            <div className="flex gap-8">
                <Tooltip trigger="hover">
                    <Tooltip.Trigger>
                        <Button variant="outline" color="primary">
                            마우스 오버
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        마우스 오버시 표시
                    </Tooltip.Content>
                </Tooltip>
                
                <Tooltip trigger="focus">
                    <Tooltip.Trigger>
                        <input type="text" placeholder="포커스시 표시"/>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        포커스시 표시 (탭으로 이동하세요)
                    </Tooltip.Content>
                </Tooltip>
            </div>
            
            <div className="flex gap-8">
                <Tooltip trigger="touch">
                    <Tooltip.Trigger>
                        <Button variant="outline" color="primary">
                            터치
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        터치시 표시 (모바일)
                    </Tooltip.Content>
                </Tooltip>
            </div>
        </div>
    )
}

export const CustomStyling: Story = {
    render: () => (
        <div className="flex items-center justify-center h-[300px]">
            <Tooltip>
                <Tooltip.Trigger>
                    <Button variant="outline" color="secondary">
                        커스텀 스타일
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-pink-600 text-white after:bg-pink-600">
                    <div className="font-bold">커스텀 스타일 툴팁</div>
                    <div className="text-xs">더 많은 콘텐츠를 담을 수 있습니다</div>
                </Tooltip.Content>
            </Tooltip>
        </div>
    )
}