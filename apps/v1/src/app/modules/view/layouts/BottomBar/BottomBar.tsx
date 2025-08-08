import React from 'react';

interface BottomBarProps {
  currentStation?: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ currentStation = '역전동' }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-indigo-900 bg-opacity-90 flex items-center justify-between px-4 z-10">
      {/* 왼쪽 영역 - 대시보드 및 정보 */}
      <div className="flex items-center space-x-8">
        <button className="text-white flex flex-col items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4.5A2.5 2.5 0 014.5 2h11A2.5 2.5 0 0118 4.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 15.5v-11z" />
          </svg>
          <span className="text-xs mt-1">대시보드</span>
        </button>

        <button className="text-white flex flex-col items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="text-xs mt-1">정보열람</span>
        </button>

        <button className="text-white flex flex-col items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
          </svg>
          <span className="text-xs mt-1">조회필터</span>
        </button>

        <button className="text-white flex flex-col items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <span className="text-xs mt-1">노선도</span>
        </button>
      </div>      {/* 중앙 영역 - 현재 역사 및 알림 상태 */}
      <div className="flex items-center">
        <div className="bg-white bg-opacity-10 px-4 py-2 rounded-full text-white mr-6">
          현재 역사: {currentStation || '역전동'}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white bg-opacity-10 px-4 py-2 rounded-full">
            <svg className="w-5 h-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-white">Critical</span>
            <span className="bg-white text-indigo-900 rounded-full w-5 h-5 flex items-center justify-center text-xs ml-2">6</span>
          </div>
          
          <div className="flex items-center bg-white bg-opacity-10 px-4 py-2 rounded-full">
            <svg className="w-5 h-5 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-white">Major</span>
            <span className="bg-white text-indigo-900 rounded-full w-5 h-5 flex items-center justify-center text-xs ml-2">4</span>
          </div>
          
          <div className="flex items-center bg-white bg-opacity-10 px-4 py-2 rounded-full">
            <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-white">Minor</span>
            <span className="bg-white text-indigo-900 rounded-full w-5 h-5 flex items-center justify-center text-xs ml-2">2</span>
          </div>
        </div>
      </div>

      {/* 오른쪽 영역 - 2D/3D 전환 */}
      <div className="flex items-center space-x-6">
        <button className="text-white flex flex-col items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs mt-1">논오버레이</span>
        </button>
        
        <button className="bg-indigo-700 text-white px-4 py-1 rounded-md">
          2D
        </button>
        
        <button className="text-white flex flex-col items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs mt-1">3D 모드</span>
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
