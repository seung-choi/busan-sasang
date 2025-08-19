import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from "@plug/ui";

const meta: Meta<typeof Skeleton> = {
    title: 'Components/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
    argTypes:{
        variant:{
            control: "select",
            description: '스켈레톤 모양 구분',
            options: ["circle", "rectangle", "text"],
        }
    }
}

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    render: (args) => (
        <Skeleton {...args}
            className="w-[100px] h-[100px]"
        >
        </Skeleton>
    )
}

export const Circle: Story = {
    render: (args) => (
        <Skeleton {...args}
            variant="circle"
            className="w-[100px] h-[100px]"
        >
        </Skeleton>
    )
}

export const Text: Story = {
    render: (args) => (
        <Skeleton {...args}
            variant="text"
        >
        </Skeleton>
    )
}
