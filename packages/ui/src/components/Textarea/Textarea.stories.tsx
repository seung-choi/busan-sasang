import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@plug/ui';

const meta: Meta<typeof Textarea> = {
    title: 'Components/Textarea',
    tags: ['autodocs'],
    argTypes:{
        placeholder: {
            control: 'text',
        },
        resize: {
            control: 'select',
            options: ['both', 'horizontal', 'resize-y', 'none']
        },
        className: {
            control: 'text',
        },
    }
}

export default meta;

export const Default: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        placeholder: '텍스트를 입력하세요.',
    }
}

export const TextareaInvalid: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        invalid: true,
        placeholder: '텍스트를 입력하세요.',
    }
}

export const TextareaDisabled: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        placeholder: '텍스트를 입력하세요.',
        disabled: true
    }
}

export const TextareaResize: StoryObj<typeof Textarea> = {
    render: () => (
        <>
            <div className="mt-4">Resize: none</div>
            <Textarea placeholder="사이즈를 조절할 수 있습니다." />
            <div className="mt-4">Resize: horizontal</div>
            <Textarea resize="horizontal" placeholder="사이즈를 조절할 수 있습니다."/>
            <div className="mt-4">Resize: vertical</div>
            <Textarea resize="vertical" placeholder="사이즈를 조절할 수 있습니다."/>
            <div className="mt-4">Resize: both</div>
            <Textarea resize="both" placeholder="사이즈를 조절할 수 있습니다."/>
        </>
    ),
}

