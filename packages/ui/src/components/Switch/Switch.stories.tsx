import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
    title: 'Components/Switch',
    component: Switch,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        disabled: { control: 'boolean' },
        defaultChecked: { control: 'boolean' },
        onChange: { action: 'changed' },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary'],
        },
    }
}

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    args: {
        label: "레이블 문구가 들어갑니다.",
        disabled: false,
        defaultChecked: false,
        size: 'medium',
        color: 'primary',
    },
};

export const States: Story = {
    render: () => (
        <>
            <div>기본 상태:</div>
            <Switch label="기본 스위치" />
            
            <div className="mt-4">체크된 상태:</div>
            <Switch label="체크된 스위치" defaultChecked />
            
            <div className="mt-4">비활성화 상태:</div>
            <Switch label="비활성화된 스위치" disabled />
            
            <div className="mt-4">체크되고 비활성화된 상태:</div>
            <Switch label="체크되고 비활성화된 스위치" disabled defaultChecked />
        </>
    )
};

export const LabelOptions: Story = {
    render: () => (
        <>
            <div>레이블 있음:</div>
            <Switch label="레이블이 있는 스위치" />
            
            <div className="mt-4">레이블 없음:</div>
            <Switch />
        </>
    )
};

export const Sizes: Story = {
    render: () => (
        <>
            <div>Small:</div>
            <Switch 
                label="작은 크기 스위치" 
                size="small" 
                color="primary"
            />
            
            <div className="mt-4">Medium:</div>
            <Switch 
                label="중간 크기 스위치" 
                size="medium" 
                color="primary"
            />
            
            <div className="mt-4">Large:</div>
            <Switch 
                label="큰 크기 스위치" 
                size="large" 
                color="primary"
            />
        </>
    )
};

export const Colors: Story = {
    render: () => (
        <>
            <div>Primary:</div>
            <Switch 
                label="기본 색상 스위치" 
                color="primary" 
                size="medium"
            />
            
            <div className="mt-4">Secondary:</div>
            <Switch 
                label="보조 색상 스위치" 
                color="secondary" 
                size="medium"
            />
        </>
    )
};