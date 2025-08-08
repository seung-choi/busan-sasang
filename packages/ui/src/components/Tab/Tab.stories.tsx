import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from '../Tab';
import { useState } from "react";

const meta: Meta<typeof Tab> = {
    title: 'Components/Tab',
    component: Tab,
    tags: ['autodocs'],
    argTypes:{
        defaultValue: {
            control: 'text',
            defaultValue: 'tab1'
        },
        value: {
            control: 'text',
            defaultValue: 'tab1'
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary']
        },
        onValueChange: {
            action: 'onValueChange'
        }
    }
}

export default meta;
type Story = StoryObj<typeof Tab>;

export const Primary: Story = {
    render: () => (
        <Tab>
            <Tab.List color='primary'>
                <Tab.Trigger value="tab1">첫번째 탭</Tab.Trigger>
                <Tab.Trigger value="tab2">두번째 탭</Tab.Trigger>
            </Tab.List>
            <Tab.Content value="tab1">첫번째 콘텐츠 영역</Tab.Content>
            <Tab.Content value="tab2">두번째 콘텐츠 영역</Tab.Content>
        </Tab>
    ),
}

export const Secondary: Story = {
    render: () => (
        <Tab className="w-100" defaultValue="tab1">
            <Tab.List color='secondary'>
                <Tab.Trigger value="tab1">첫번째 탭</Tab.Trigger>
            </Tab.List>
            <Tab.Content value="tab1">첫번째 콘텐츠 영역</Tab.Content>
        </Tab>
    ),
}


export const DefaultValue: Story = {
    render: () => (
        <Tab className="w-100" defaultValue="tab2">
            <Tab.List color='primary'>
                <Tab.Trigger value="tab1">첫번째 탭</Tab.Trigger>
                <Tab.Trigger value="tab2">두번째 탭</Tab.Trigger>
            </Tab.List>
            <Tab.Content value="tab1">첫번째 콘텐츠 영역</Tab.Content>
            <Tab.Content value="tab2">두번째 콘텐츠 영역</Tab.Content>
        </Tab>
    ),
}

export const ControlledTab: Story = {
    render: () => {
        const ControlledTabDemo = () => {
            const [activeTab, setActiveTab] = useState<string>('tab2');
            const tabOnChange = (value: string) => {
                setActiveTab(value);
                alert("ACTIVE TAB : " + value);
            };
            
            return (
                <>
                    <span className='text-red-500 font-bold'>ACTIAVTED TAB : {activeTab}</span>
                    <Tab className="w-100" defaultValue='tab2' value={activeTab} onValueChange={tabOnChange}>
                        <Tab.List>
                            <Tab.Trigger value="tab1">첫번째 탭</Tab.Trigger>
                            <Tab.Trigger value="tab2">두번째 탭</Tab.Trigger>
                        </Tab.List>
                        <Tab.Content value="tab1">첫번째 콘텐츠 영역</Tab.Content>
                        <Tab.Content value="tab2">두번째 콘텐츠 영역</Tab.Content>
                    </Tab>
                </>
            );
        };
        
        return <ControlledTabDemo />;
    }
}