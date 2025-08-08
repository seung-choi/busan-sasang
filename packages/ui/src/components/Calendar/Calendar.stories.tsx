import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@plug/ui';
import { ko } from 'date-fns/locale'

const meta: Meta<typeof Calendar> = {
    title: 'Components/Calendar',
    component: Calendar,
    tags: ['autodocs'],  
    argTypes: {
        mode: {
            control: 'select',
            options: ['single' , 'multiple', 'range']
        },
        className: { 
            control: 'text' 
        },
        showOutsideDays: { 
            cdescription: '외부요일 노출'
        },
        locale: { 
            description: 'ko 한글 호환 locale={ko}'
        },
        captionLayout: { 
            description: '월이나 연도 사이를 탐색할 수 있는 드롭다운'
        },
        disabled: { 
            action: 'disabled',
        },
    }
};

export default meta;

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
    render: () => (
        <Calendar className="w-80" mode="single" />
    )
}

export const Mode: Story = {
    render: () => (
        <>
            <div className="my-4">Mode: Single</div>
            <Calendar className="w-80" mode="single" />
            <div className="my-4">Mode: range</div>
            <Calendar className="w-80" mode="range" />
            <div className="my-4">Mode: multiple</div>
            <Calendar className="w-80" mode="multiple" />
        </>
    )
}

export const showOutsideDays: Story = {
    render: () => (
        <Calendar mode="single" className="w-80" showOutsideDays={true}/>
    )
}

export const locale: Story = {
    render: () => (
        <Calendar mode="single" className="w-80" locale={ko}/>
    )
}

export const captionLayout: Story = {
    render: () => (
        <Calendar mode="single" className="w-80" captionLayout="dropdown" />
    )
}

export const Disabled: Story = {
    render: () => (
        <Calendar mode="single" className="w-80" disabled={{ dayOfWeek: [0, 6] }} />
    )
}
