import React from 'react';
import {Button} from '@plug/ui';
import {Outlet, Link} from 'react-router-dom';
import {ToastContainer} from "@plug/v1/admin/components/toast/ToastContainer";
import { useProfileStore } from '@plug/v1/common/auth/controller/useProfileStore';
import { logOut } from '@plug/v1/common/auth/api/auth';

const AdminLayout = () => {
    const user = useProfileStore((state) => state.user);

    return (
        <>
            <div className='h-screen flex flex-col overflow-hidden'>
                <header
                    className="h-16 relative z-10 flex items-center justify-between px-6 py-2.5 bg-primary-600 backdrop-blur-sm shadow-md text-white">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:opacity-75 transition-opacity"
                        title="대시보드로 이동">
                        <div
                            className="flex items-center justify-center rounded-full h-10 w-10 bg-white shadow-lg transition-transform hover:scale-105">
                            <div
                                className="flex items-center justify-center rounded-full h-8 w-8 ring-2 ring-primary-500 bg-white">
                                <img src="/3d-map/assets/logo.png" height={22} width={22} alt="Logo"/>
                            </div>
                        </div>
                        <h1 className="text-white font-bold text-lg whitespace-nowrap">
                            부산교통공사 사상하단선 관리자 페이지
                        </h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div
                            className="flex items-center justify-between h-9 text-end leading-tight gap-2 bg-primary-500 px-4 py-1.5 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="w-4 h-4">
                                        <path fillRule="evenodd"
                                              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <p className="text-white font-medium">{user?.name ? `${user.name}님` : '관리자님'}</p>
                            </div>
                            <p className="text-xs text-primary-200 bg-primary-600/50 px-2 py-0.5 rounded-full animate-pulse">접속 중</p>
                        </div>
                        <Button
                            className="h-9 w-24 px-4 text-sm bg-primary-100 text-primary-700 hover:bg-primary-300 font-semibold transition-colors"
                            onClick={logOut}>
                            로그아웃
                        </Button>
                    </div>
                </header>
                <main className="h-full flex-1 flex flex-row">
                    <Outlet/>
                </main>
            </div>
            <ToastContainer/>
        </>
    );
};

export default AdminLayout;