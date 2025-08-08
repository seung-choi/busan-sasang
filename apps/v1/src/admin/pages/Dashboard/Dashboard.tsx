import { Sidebar } from '@plug/ui';
import { Outlet } from 'react-router-dom';
import { DashboardTitle } from './utils/useDashboardTitle'; 

const Dashboard = () => {
    const title = DashboardTitle();

    return (
        <div className='h-full w-full flex flex-col overflow-hidden'>
            <div className='flex flex-1 overflow-hidden'>
                <Sidebar className='h-full bg-primary-100 shadow-md border-t border-gray-200'>
                    <Sidebar.Menu
                        items={[
                            {
                                title: '역사 관리',
                                link: 'facility',
                                toggleable: false,
                            },
                            {
                                title: '호선 관리',
                                link: 'line/management',
                                toggleable: false,
                            },
                            {
                                title: '에셋 관리',
                                link: 'asset/management',
                                toggleable: false,
                            },
                            {
                                title: '장비 관리',
                                submenu: [
                                    {
                                        title: '장비 관리',
                                        link: 'device/management'
                                    },
                                    {
                                        title: '장비 분류 관리',
                                        link: 'device/category'
                                    }
                                ]
                            },
                            {
                                title: '사용자 관리',
                                link: 'user/management',
                                toggleable: false,
                            }
                        ]}
                    />
                </Sidebar>
                <div className='flex-1 flex flex-col'>
                    <main className='flex-1 overflow-auto p-6'>
                        {title ? (
                            <>
                                <h2 className='font-bold text-2xl mb-4 pl-3 text-gray-800 tracking-tight relative before:absolute before:left-[0px] before:top-1 before:w-1 before:bg-primary-500 before:rounded-full before:h-8 border-b border-gray-200 pb-3'>{title}</h2>
                                <Outlet />
                            </>
                        ) : (
                            <>
                                관리자 페이지
                            </>
                        )}
                    </main>
                    <footer className='py-3 px-4 border-t border-gray-200 text-xs text-center bg-gray-50'>
                        <p className='text-gray-600 font-medium'>Copyright © 2025 <span
                            className='text-primary-600'>PLUXITY</span>.co.,Ltd. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;