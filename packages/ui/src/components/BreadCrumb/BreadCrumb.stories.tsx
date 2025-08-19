import type { Meta, StoryObj } from '@storybook/react';
import { BreadCrumb } from '@plug/ui';
import HomeIcon from "../../assets/icons/home.svg";

const meta: Meta<typeof BreadCrumb> = {
    title: 'Components/BreadCrumb',
    component: BreadCrumb,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'medium', 'large']
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary']
        }
    }
};

export default meta;
type Story = StoryObj<typeof BreadCrumb>;

export const Default: Story = {
    render: (args) => {
        return (
            <BreadCrumb {...args} >
                <BreadCrumb.Item >
                    <BreadCrumb.Link href="ViewerPage">ViewerPage</BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href="BreadCrumb">BreadCrumb</BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href="Component">Component</BreadCrumb.Link>
                </BreadCrumb.Item>
            </BreadCrumb>
        );
    },
    args: {
        size: 'small',
        color: 'primary',
        separator: 'line',
    }
};

export const Size: Story = {
    render: (args) => {
        return (
            <>
                <div className="mt-4">small : </div>
                <BreadCrumb {...args} size='small'>
                    <BreadCrumb.Item >
                        <BreadCrumb.Link href="ViewerPage">ViewerPage</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="BreadCrumb">BreadCrumb</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="Component">Component</BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
                <div className="mt-4">medium : </div>
                <BreadCrumb {...args} size='medium'>
                    <BreadCrumb.Item >
                        <BreadCrumb.Link href="ViewerPage">ViewerPage</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="BreadCrumb">BreadCrumb</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="Component">Component</BreadCrumb.Link>
                    </BreadCrumb.Item>  
                </BreadCrumb>
                <div className="mt-4">large : </div>
                <BreadCrumb {...args} size='large'>
                    <BreadCrumb.Item >
                        <BreadCrumb.Link href="ViewerPage">ViewerPage</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="BreadCrumb">BreadCrumb</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="Component">Component</BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
            </> 
        );
    },
};

export const color: Story = {
    render: (args) => {
        return (
            <>
                <div className="mt-4">primary : </div>
                <BreadCrumb {...args} color='primary'>
                    <BreadCrumb.Item >
                        <BreadCrumb.Link href="ViewerPage">ViewerPage</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="BreadCrumb">BreadCrumb</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="Component">Component</BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
                <div className="mt-4">secondary : </div>
                <BreadCrumb {...args} color='secondary'>
                    <BreadCrumb.Item >
                        <BreadCrumb.Link href="ViewerPage">ViewerPage</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="BreadCrumb">BreadCrumb</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="Component">Component</BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
            </>
        );
    }
};

export const separator: Story = {
    render: (args) => {
        return (
            <>
                <div className="mt-4">line : </div>
                <BreadCrumb {...args} separator='line'>
                    <BreadCrumb.Item >
                        <BreadCrumb.Link href="ViewerPage">ViewerPage</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="BreadCrumb">BreadCrumb</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="Component">Component</BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
                <div className="mt-4">arrow : </div>
                <BreadCrumb {...args} separator='arrow'>
                    <BreadCrumb.Item >
                        <BreadCrumb.Link href="ViewerPage">ViewerPage</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="BreadCrumb">BreadCrumb</BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href="Component">Component</BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
            </>
        );
    }
};

export const WithIcon: Story = {
    render: (args) => {
        return (
            <BreadCrumb {...args}>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href='ViewerPage'>
                        <HomeIcon /> ViewerPage
                    </BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href='/?path=/docs/components-breadcrumb--docs'>
                        <HomeIcon /> BreadCrumb
                    </BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href='Component'>
                        Component
                    </BreadCrumb.Link>
                </BreadCrumb.Item>
            </BreadCrumb>
        );
    }
};