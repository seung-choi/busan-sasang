import ThreeDViewer from "./ThreeDViewer";
import WebGLControlPanel from "../components/webglControlPanel";

function ThreeDTest() {

  return (
    <div className="container mx-auto py-8 px-4">
      <WebGLControlPanel />
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">3D 렌더링 영역</h2>
          <ThreeDViewer />
      </div>
    </div>
  );
}

export default ThreeDTest; 