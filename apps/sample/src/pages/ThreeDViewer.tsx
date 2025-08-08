import { useEffect, useRef } from 'react';
import { Engine3D, Loader } from '@plug/engine/src';

const ThreeDViewer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            new Engine3D(containerRef.current);
            Loader.LoadGltf('Seomyeun_250611.glb', () => console.log('모델 로드 완료.'));
        }
        console.log('WebGL 초기화 호출.');
    }, []);

    return <div ref={containerRef} className="three-d-viewer-container" style={{ width: '100%', height: '1000px' }} />;
};

export default ThreeDViewer;
