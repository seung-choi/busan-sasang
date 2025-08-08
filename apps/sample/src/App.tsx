import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DesignSystem from './pages/DesignSystem';
import ThreeDTest from './pages/ThreeDTest';
import DialogExamples from './pages/DialogExamples';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Plug Platform</h1>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:text-gray-300">홈</Link>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-gray-300">디자인 시스템</Link>
              </li>
              <li>
                <Link to="/3d-test" className="hover:text-gray-300">3D 테스트</Link>
              </li>
              <li>
                <Link to="/dialog-examples" className="hover:text-gray-300">다이얼로그 예제</Link>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="container h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/3d-test" element={<ThreeDTest />} />
            <Route path="/dialog-examples" element={<DialogExamples />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// 홈 페이지 컴포넌트
function Home() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Plug Platform 샘플 앱</h1>
      <p className="mb-4">이 앱은 Plug UI 컴포넌트를 테스트하기 위한 샘플 앱입니다.</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">사용 방법</h2>
        <p className="text-blue-700">
          상단 네비게이션 바에서 원하는 페이지를 선택하여 이동할 수 있습니다.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">디자인 시스템</h3>
          <p className="text-gray-600 mb-4">다양한 UI 컴포넌트의 사용 예제를 확인할 수 있습니다.</p>
          <Link to="/design-system" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            디자인 시스템 보기
          </Link>
        </div>
        <div className="border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">3D 테스트</h3>
          <p className="text-gray-600 mb-4">3D 렌더링 및 관련 기능을 테스트할 수 있습니다.</p>
          <Link to="/3d-test" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            3D 테스트 보기
          </Link>
        </div>
        <div className="border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">다이얼로그 예제</h3>
          <p className="text-gray-600 mb-4">Modal, Popup, Dialog 컴포넌트 사용 예제를 확인할 수 있습니다.</p>
          <Link to="/dialog-examples" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            다이얼로그 예제 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;

