import { Meta, StoryObj } from '@storybook/react';
import { HomeIcon } from '../../index.icons';
import { Sidebar } from '@plug/ui';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof Sidebar> = {
    title: 'Components/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']}>
                <Story />
            </MemoryRouter>
        ),
    ],
    argTypes: {
        isOpen: {
            control: 'boolean',
            description: '사이드바 열림/닫힘 상태'
        }
    }
}

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    render: () => (
        <Sidebar>
            <Sidebar.Header className="rounded-sm bg-gray-100">사이드바 헤더</Sidebar.Header>
            <Sidebar.Menu
                items={[
                    {
                        title: "홈",
                        beforeNavigate: () => {
                            console.log('beforeNavigate 실행')
                        },
                        link: '/',
                        icon: <HomeIcon />,
                        className: 'text-red-600',
                        submenu: [
                            {
                                title: "프로필",
                                link: '/',
                                className: 'text-red-600'
                            },
                            {
                                title: "알림",
                                link: '/',
                            },
                        ],
                    },
                    {
                        title: "설정",
                        submenu: [
                            {
                                title: "프로필",
                                link: '/',
                            },
                            {
                                title: "알림",
                                link: '/',
                            },
                        ],
                    },
                ]}
            />
            <Sidebar.Footer className="rounded-sm bg-gray-100">사이드바 푸터</Sidebar.Footer>
        </Sidebar>
    )
}

export const Toggleable: Story = {
    render: () => (
        <Sidebar>
            <Sidebar.Header className="rounded-sm bg-gray-100">사이드바 헤더</Sidebar.Header>
            <Sidebar.Menu
                items={[
                    {
                        title: "Toggleable: false",
                        link: '/',
                        toggleable: false,
                    },
                    {
                        title: "Toggleable: true(default)",
                        submenu: [
                            {
                                title: "프로필",
                                link: '/',
                            },
                            {
                                title: "알림",
                                link: '/',
                            },
                        ],
                    },
                ]}
            />
            <Sidebar.Footer className="rounded-sm bg-gray-100">사이드바 푸터</Sidebar.Footer>
        </Sidebar>
    )
}

export const OnlyMenu: Story = {
    render: () => (
        <Sidebar>
            <Sidebar.Menu
                items={[
                    {
                        title: "홈",
                        link: '/',
                        toggleable: false,
                    },
                    {
                        title: "설정",
                        submenu: [
                            {
                                title: "프로필",
                                link: '/',
                            },
                            {
                                title: "알림",
                                link: '/',
                            },
                        ],
                    },
                ]}
            />
        </Sidebar>
    )
}

export const WithTrigger: Story = {
    render: () => {
        const SidebarTrigger = () => {
            const [isVisible, setIsVisible] = useState(true);
            
            return (
                <div className="flex">
                    <Sidebar isOpen={isVisible}>
                        <Sidebar.Header className="rounded-sm bg-gray-100">사이드바 헤더</Sidebar.Header>
                        <Sidebar.Menu
                            items={[
                                {
                                    title: "홈",
                                    link: '/',
                                    icon: <HomeIcon />,
                                    submenu: [
                                        {
                                            title: "프로필",
                                            link: '/',
                                        },
                                        {
                                            title: "알림",
                                            link: '/',
                                        },
                                    ],
                                },
                                {
                                    title: "설정",
                                    submenu: [
                                        {
                                            title: "프로필",
                                            link: '/',
                                        },
                                        {
                                            title: "알림",
                                            link: '/',
                                        },
                                    ],
                                },
                            ]}
                        />
                        <Sidebar.Footer className="rounded-sm bg-gray-100">사이드바 푸터</Sidebar.Footer>
                    </Sidebar>
                    <div className="p-4">
                        <button 
                            onClick={() => setIsVisible(!isVisible)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            {isVisible ? '사이드바 접기' : '사이드바 펼치기'}
                        </button>
                        <div className="mt-4">
                            <p>여기는 메인 콘텐츠 영역입니다.</p>
                        </div>
                    </div>
                </div>
            )
        }
        return <SidebarTrigger />
    }
}

export const Closed: Story = {
    render: () => (
        <Sidebar isOpen={false}>
            <Sidebar.Header className="rounded-sm bg-gray-100">사이드바 헤더</Sidebar.Header>
            <Sidebar.Menu
                items={[
                    {
                        title: "홈",
                        link: '/',
                        icon: <HomeIcon />,
                        submenu: [
                            {
                                title: "프로필",
                                link: '/',
                            },
                            {
                                title: "알림",
                                link: '/',
                            },
                        ],
                    },
                    {
                        title: "설정",
                        submenu: [
                            {
                                title: "프로필",
                                link: '/',
                            },
                            {
                                title: "알림",
                                link: '/',
                            },
                        ],
                    },
                ]}
            />
            <Sidebar.Footer className="rounded-sm bg-gray-100">사이드바 푸터</Sidebar.Footer>
        </Sidebar>
    )
}