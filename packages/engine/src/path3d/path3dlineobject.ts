import * as THREE from 'three';
import { Path3DPointObject } from './path3dpointobject';

/**
 * 경로 선 객체
 */
class Path3DLineObject extends THREE.Group {

    private curve: THREE.QuadraticBezierCurve3 = new THREE.QuadraticBezierCurve3();
    private lineShape: THREE.Shape;
    private lineWidth: number;
    private lineColor: THREE.Color;

    private extrudeLineMesh: THREE.Mesh | null = null;
    private solidLine: THREE.Line | null = null;
    private controlLine: THREE.Line | null = null;

    private startPoint!: Path3DPointObject;
    private controlPoint!: Path3DPointObject;
    private endPoint!: Path3DPointObject;

    /**
     * 생성자
     * @param _startPoint - 시작점
     * @param _controlPoint - 제어점
     * @param _endPoint - 종료점
     */
    constructor(_startPoint: THREE.Vector3, _controlPoint: THREE.Vector3, _endPoint: THREE.Vector3, _lineShape: THREE.Shape, _width: number, _color: THREE.Color) {
        super();

        this.curve.v0 = _startPoint;
        this.curve.v1 = _controlPoint;
        this.curve.v2 = _endPoint;
        this.lineShape = _lineShape;
        this.lineWidth = _width;
        this.lineColor = _color;
    }

    /**
     * 선객체의 각 위치점 객체 설정
     * @param _startPoint - 시작점
     * @param _controlPoint - 제어점
     * @param _endPoint - 종료점
     */
    setPointObjects(_startPoint: Path3DPointObject, _controlPoint: Path3DPointObject, _endPoint: Path3DPointObject) {

        this.startPoint = _startPoint;
        this.controlPoint = _controlPoint;
        this.endPoint = _endPoint;
    }

    /**
     * 곡선
     */
    get Curve(): THREE.QuadraticBezierCurve3 {
        return this.curve;
    }

    /**
     * 시작/종료점의 층id값이 파라미터인 층id값과 같은지 확인
     */
    checkFloorIdMatch(floorId: string): boolean {
        return ((this.startPoint.userData['floorId'] === floorId) && (this.endPoint.userData['floorId'] === floorId));
    }

    /**
     * 리소스 메모리 해제
     */
    dispose() {
        if (this.extrudeLineMesh) {
            this.remove(this.extrudeLineMesh);
            this.extrudeLineMesh.geometry.dispose();
            (this.extrudeLineMesh.material as THREE.Material).dispose();
            this.extrudeLineMesh = null;
        }

        if (this.solidLine) {
            this.remove(this.solidLine);
            this.solidLine.geometry.dispose();
            (this.solidLine.material as THREE.Material).dispose();
            this.solidLine = null;
        }

        if (this.controlLine) {
            this.remove(this.controlLine);
            this.controlLine.geometry.dispose();
            (this.controlLine.material as THREE.Material).dispose();
            this.controlLine = null;
        }
    }

    /**
     * 라인 Geometry 업데이트
     */
    updateGeometry() {
        // 이전 생성 리소스 제거
        this.dispose();

        // extrude geometry
        const extrudeGeometry = new THREE.ExtrudeGeometry(this.lineShape, {
            steps: 20,
            extrudePath: this.curve,
        });
        extrudeGeometry.computeBoundingSphere();
        const extrudeMaterial = new THREE.MeshBasicMaterial({ color: this.lineColor, });
        this.extrudeLineMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
        this.add(this.extrudeLineMesh);

        // solid line
        const linePoints = this.curve.getPoints(50);
        let lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        let lineMaterial = new THREE.LineBasicMaterial({ color: 'white', depthTest: false, depthWrite: false, });
        this.solidLine = new THREE.Line(lineGeometry, lineMaterial);
        this.add(this.solidLine);

        // control line
        lineGeometry = new THREE.BufferGeometry().setFromPoints([this.curve.v0, this.curve.v1, this.curve.v2]);
        lineMaterial = new THREE.LineBasicMaterial({ color: 'white', depthTest: false, depthWrite: false, transparent: true, opacity: 0.5 });
        this.controlLine = new THREE.Line(lineGeometry, lineMaterial);
        this.add(this.controlLine);
    }
}

export {
    Path3DLineObject,
}