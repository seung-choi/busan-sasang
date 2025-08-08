import * as THREE from 'three';
import * as Interfaces from '../interfaces'

/**
 * 바이너리로된 *.sbm 파일을 읽는 클래스
 */
class SbmBinaryReader {

    private urlBase: string;
    private buffer: ArrayBuffer;
    private view: DataView;
    private bufferOffsetCursor: number;

    private header: Interfaces.SBMHeader;
    private materials: Record<number, Interfaces.SBMMaterial>;
    private meshes: Interfaces.SBMMesh[];

    private scaleRatio: number = 0.01;

    /**
     * 생성자
     * @param buffer - *.sbm 버퍼
     */
    constructor(urlBase: string, buffer: ArrayBuffer) {
        this.urlBase = urlBase;
        this.buffer = buffer;
        this.view = new DataView(buffer);
        this.bufferOffsetCursor = 0;

        this.header = this.readHeader();
        this.materials = this.readMaterials();
        this.meshes = this.readMeshes();
    }
    /**
     * 버퍼로부터 문자열 읽기
     * @param offset - 읽기 시작할 오프셋
     * @param length - 읽을 문자열 길이
     * @returns 읽은 문자열
     */
    getAsciiString(offset: number, length: number): string {
        let str = '';
        for (let i = 0; i < length; i++) {
            str += String.fromCharCode(this.view.getUint8(offset + i));
        }
        return str;
    }

    /**
     * SBM 헤더 정보 읽기
     */
    readHeader(): Interfaces.SBMHeader {
        const header: Interfaces.SBMHeader = {
            formatName: '',
            version: -1,
            materialCount: -1,
            meshCount: -1,
        };

        header.formatName = this.getAsciiString(this.bufferOffsetCursor, 8);
        this.bufferOffsetCursor += 8;
        header.version = this.view.getUint8(this.bufferOffsetCursor);
        this.bufferOffsetCursor += 1;
        header.materialCount = this.view.getUint16(this.bufferOffsetCursor, true);
        this.bufferOffsetCursor += 2;
        header.meshCount = this.view.getUint16(this.bufferOffsetCursor, true);
        this.bufferOffsetCursor += 2;

        return header;
    }

    /**
     * SBM 재질 정보 읽기
     */
    readMaterials(): Record<number, Interfaces.SBMMaterial> {
        const materials: Interfaces.SBMMaterial[] = [];

        for (let i = 0; i < this.header.materialCount; i++) {
            // id값
            const materialId = this.view.getUint16(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 2;

            // ambien t색상
            const ambientR = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;
            const ambientG = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;
            const ambientB = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;
            const ambientA = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;

            // diffuse 색상
            const diffuseR = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;
            const diffuseG = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;
            const diffuseB = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;
            const diffuseA = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;

            // specular 색상
            const specularR = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;
            const specularG = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;
            const specularB = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;
            const specularA = this.view.getFloat32(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 4;

            // 면 렌더링 방향
            const facing = this.view.getUint8(this.bufferOffsetCursor);
            this.bufferOffsetCursor += 1;

            // 텍스쳐 맵 파일경로
            const texturePathLength = this.view.getUint16(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 2;

            let textureMapPath: string = '';
            if (texturePathLength > 0) {
                const chunk = this.buffer.slice(this.bufferOffsetCursor, this.bufferOffsetCursor + texturePathLength);
                const chunkArray = new Uint8Array(chunk, 0, texturePathLength)
                for (let chunkIndex = 0; chunkIndex < texturePathLength; chunkIndex++) {
                    textureMapPath += String.fromCharCode(chunkArray[chunkIndex]);
                }
                textureMapPath = this.urlBase + '/' + textureMapPath;
                textureMapPath = textureMapPath.replace('\\', '/').replace('//', '/');
                this.bufferOffsetCursor += texturePathLength;
            }

            materials[materialId] = {
                id: materialId,
                ambient: new THREE.Color(ambientR, ambientG, ambientB),
                diffuse: new THREE.Color(diffuseR, diffuseG, diffuseB),
                opacity: diffuseA,
                specular: new THREE.Color(specularR, specularG, specularB),
                facing: facing,
                textureMapPath: textureMapPath,
            };
        }

        return materials;
    }

    /**
     * SBM 메시 정보 읽기
     */
    readMeshes(): Interfaces.SBMMesh[] {
        const meshes: Interfaces.SBMMesh[] = [];

        for (let i = 0; i < this.header.meshCount; i++) {
            // id값
            const meshId = this.view.getUint16(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 2;

            // 재질 id값
            const usedMaterialId = this.view.getUint16(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 2;

            // 위치버텍스
            const posVertices = [];
            const posVertexCount = this.view.getUint16(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 2;
            for (let v = 0; v < posVertexCount; v++) {
                const posX = this.view.getFloat32(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 4;
                const posY = this.view.getFloat32(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 4;
                const posZ = this.view.getFloat32(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 4;

                posVertices.push(posX * this.scaleRatio, posY * this.scaleRatio, posZ * this.scaleRatio);
            }

            // 법선
            const normVertices = [];
            const normVertexCount = this.view.getUint16(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 2;
            for (let v = 0; v < normVertexCount; v++) {
                const normX = this.view.getFloat32(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 4;
                const normY = this.view.getFloat32(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 4;
                const normZ = this.view.getFloat32(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 4;

                normVertices.push(normX, normY, normZ);
            }

            // uv
            const uvVertices = [];
            const uvVertexCount = this.view.getUint16(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 2;
            for (let v = 0; v < uvVertexCount; v++) {
                const u = this.view.getFloat32(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 4;
                const v = this.view.getFloat32(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 4;

                uvVertices.push(u, v);
            }

            // 인덱스
            const indices = [];
            const faceCount = this.view.getUint16(this.bufferOffsetCursor, true);
            this.bufferOffsetCursor += 2;
            for (let v = 0; v < faceCount; v++) {
                const face0 = this.view.getUint16(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 2;
                const face1 = this.view.getUint16(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 2;
                const face2 = this.view.getUint16(this.bufferOffsetCursor, true);
                this.bufferOffsetCursor += 2;

                indices.push(face0, face1, face2);
            }

            meshes.push({
                id: meshId,
                usedMaterialId: usedMaterialId,
                vertexCount: posVertexCount,
                posVertices: posVertices,
                normVertices: normVertices,
                uvVertices: uvVertices,
                indices: indices,
            });
        }

        return meshes;
    }

    /**
     * 읽은 *.sbm 데이터로부터 three.js 메시 생성
     */
    generateMesh(): THREE.Group {

        const group = new THREE.Group();

        // 수집된 메시 정보 별로 생성
        for (let i = 0; i < this.meshes.length; i++) {
            const meshInfo = this.meshes[i];
            const usedMaterialInfo = this.materials[meshInfo.usedMaterialId];

            // geometry 생성
            const geometry = new THREE.BufferGeometry();
            geometry.setIndex(meshInfo.indices);
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(meshInfo.posVertices, 3));
            geometry.setAttribute('normal', new THREE.Float32BufferAttribute(meshInfo.normVertices, 3));
            if (meshInfo.uvVertices.length > 0)
                geometry.setAttribute('uv', new THREE.Float32BufferAttribute(meshInfo.uvVertices, 2));

            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();

            // geometry 중점 처리
            const center = (geometry.boundingSphere as THREE.Sphere).center.clone();
            geometry.translate(-center.x, -center.y, -center.z);
            geometry.computeVertexNormals();

            // 재질 생성
            const material = new THREE.MeshStandardMaterial({
                color: usedMaterialInfo.diffuse,
                opacity: usedMaterialInfo.opacity,
                transparent: (usedMaterialInfo.opacity < 1.0),
                side: (usedMaterialInfo.facing === 0) ? THREE.FrontSide : THREE.DoubleSide,
                map: (usedMaterialInfo.textureMapPath.length > 0) ? new THREE.TextureLoader().load(usedMaterialInfo.textureMapPath) : null,
            });
            if (material.map !== undefined && material.map !== null) {
                material.map.wrapS = THREE.RepeatWrapping;
                material.map.wrapT = THREE.RepeatWrapping;
                material.map.flipY = false;

                if (usedMaterialInfo.textureMapPath.indexOf('.png') > -1) {
                    material.transparent = true;
                }
            }

            // 메시 생성
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = meshInfo.id.toString();
            mesh.position.copy(center);
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            mesh.layers.enable(Interfaces.CustomLayer.Pickable); // 클릭가능한 객체로

            group.attach(mesh);
        }

        return group;
    }
}

export { SbmBinaryReader }