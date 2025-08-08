import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as Util from '../util';
import * as Interfaces from '../interfaces';
import { Path3DObject } from '../path3d/path3dobject';

/**
 * 지하철 열차 클래스
 */
class SubwayTrain extends THREE.Group {

    private curves: THREE.QuadraticBezierCurve3[] = [];
    private targetPath: Path3DObject;
    private trains: THREE.Object3D[] = [];
    private trainBodyLengthRatios: number[] = [];
    private bodyCount: number;
    private curvePath: THREE.CurvePath<THREE.Vector3>;

    private currentUValue: number;
    private entranceUValue: number | undefined;
    private stopUValue: number | undefined;
    private exitUValue: number | undefined;

    private moveTween: TWEEN.Tween | undefined;

    /**
     * 생성자
     * @param headModelSrc - 머리 모델 원본
     * @param bodyModelSrc - 몸체 모델 원본
     * @param tailModelSrc - 꼬리 모델 원본
     * @param _targetPath - 이동 대상 경로
     * @param _bodyCount - 몸체 개수(머리/꼬리 포함)
     */
    constructor(headModelSrc: THREE.Group, bodyModelSrc: THREE.Group, tailModelSrc: THREE.Group, _targetPath: Path3DObject, _bodyCount: number) {
        super();

        this.targetPath = _targetPath;
        this.bodyCount = _bodyCount;
        this.curvePath = new THREE.CurvePath();
        this.currentUValue = 0;

        // 커브 수집
        this.curves = this.getCurveFromPath3DLineObjects();
        // 지하철 모델 생성
        this.createTrainObjects(headModelSrc, bodyModelSrc, tailModelSrc);
    }

    /**
     * 메모리 해제
     */
    dispose() {
        // 복제 객체 이므로 다른곳에서 사용가능성이 있어서 씬에서 제거만 하고 따로 geometry 해제는 호출 하지 않음
    }

    /**
     * Path3DLineObject로부터 curve 수집
     */
    getCurveFromPath3DLineObjects(): THREE.QuadraticBezierCurve3[] {

        const result: THREE.QuadraticBezierCurve3[] = [];

        // 대상 경로로부터 curve수집
        this.targetPath.LineObjects.forEach(line => result.push(line.Curve));

        // 지금까지의 길이
        let extendLength = 25.0;

        // 시작지점 연장선 추가
        const curveFirst = result[0];
        const backPoint = new THREE.Vector3().lerpVectors(curveFirst.v0, curveFirst.v1, -extendLength);
        const backCenter = new THREE.Vector3().lerpVectors(curveFirst.v0, curveFirst.v1, -(extendLength * 0.5));
        result.unshift(new THREE.QuadraticBezierCurve3(backPoint, backCenter, curveFirst.v0));

        // 종료지점 연장선 추가
        const curveLast = result[result.length - 1];
        const frontPoint = new THREE.Vector3().lerpVectors(curveLast.v1, curveLast.v2, (extendLength * 2.0));
        const frontCenter = new THREE.Vector3().lerpVectors(curveLast.v1, curveLast.v2, (extendLength * 1.5));
        result.push(new THREE.QuadraticBezierCurve3(curveLast.v2, frontCenter, frontPoint));

        result.forEach(curve => {
            curve.updateArcLengths();
            this.curvePath.add(curve);
        });
        this.curvePath.updateArcLengths();

        return result;
    }

    /**
     * 지하철 모델 생성
     */
    createTrainObjects(headModelSrc: THREE.Group, bodyModelSrc: THREE.Group, tailModelSrc: THREE.Group) {

        const totalLength = this.curvePath.getLength();

        // 머리 모델 복제
        const head = headModelSrc.clone();
        this.add(head);
        this.trains.push(head);
        // 몸체 길이 저장
        let size = new THREE.Vector3();
        new THREE.Box3().setFromObject(head).getSize(size);
        this.trainBodyLengthRatios.push((size.z) / totalLength);

        // 몸체 모델 복제
        for (let i = 0; i < this.bodyCount - 2; i++) {
            const body = bodyModelSrc.clone();
            this.add(body);
            this.trains.push(body);
            // 몸체 길이 저장
            size = new THREE.Vector3();
            new THREE.Box3().setFromObject(body).getSize(size);
            this.trainBodyLengthRatios.push((size.z) / totalLength);
        }

        // 꼬리 모델(머리모델 회전)
        const tail = tailModelSrc.clone();
        this.add(tail);
        this.trains.push(tail);
        // 몸체 길이 저장
        size = new THREE.Vector3();
        new THREE.Box3().setFromObject(tail).getSize(size);
        this.trainBodyLengthRatios.push((size.z) / totalLength);

        // 초기 위치 설정
        for (let i = 1; i < this.trains.length; i++) {
            const train = this.trains[i];
            const parent = train.parent;
            // 부모 객체의 사이즈만큼 뒤로 이동
            const size = new THREE.Vector3();
            new THREE.Box3().setFromObject(parent!).getSize(size);

            train.position.z = size.z;
        }
    }

    /**
     * 위치점으로 열차 위치 업데이트
     * @param worldPoint - 위치점
     */
    setTrainLocations(worldPoint: THREE.Vector3) {
        const closestData = Util.getClosestPointOnCurvePath(this.curvePath, worldPoint);
        this.updateTrainLocation(closestData.u!);
    }

    /**
     * u값으로 열차 위치를 업데이트 한다.
     * @param uValueBase - 거리기반 u값
     */
    updateTrainLocation(uValueBase: number) {
        this.currentUValue = uValueBase;

        const curvePath: THREE.CurvePath<THREE.Vector3> = new THREE.CurvePath();
        this.curves.forEach(curve => curvePath.add(curve));
        curvePath.updateArcLengths();

        const totalLength = curvePath.getLength();

        let u = this.currentUValue;
        this.trains.forEach((train, index) => {
            const v0 = this.getPointFromCurvePath(curvePath, u, this.trainBodyLengthRatios[index]);
            train.position.copy(v0);

            const uBack = u - this.trainBodyLengthRatios[index];
            const backPoint = this.getPointFromCurvePath(curvePath, uBack, this.trainBodyLengthRatios[index]);
            const direction = new THREE.Vector3().subVectors(backPoint, v0).normalize();
            train.lookAt(train.position.clone().add(direction));

            u -= this.trainBodyLengthRatios[index];
        });
    }

    /**
     * 곡선에 대한 u값의 위치점을 계산
     * @param curvePath - 커브패스
     * @param u - u값
     * @param bodyLengthRatio - 곡선에 대한 몸체 길이 비율
     * @returns - 위치점
     */
    getPointFromCurvePath(curvePath: THREE.CurvePath<THREE.Vector3>, u: number, bodyLengthRatio: number): THREE.Vector3 {

        const totalLength = curvePath.getLength();
        let result = curvePath.getPointAt(0);

        if (0.0 <= u && u <= 1.0) {
            result = curvePath.getPointAt(u);
        } else if (u < 0.0) {

            const firstCurve = curvePath.curves[0];
            const v0 = firstCurve.getPoint(0);
            const v1 = firstCurve.getPoint(0.01);
            const dir = new THREE.Vector3().subVectors(v0, v1).normalize();
            result = v0.clone().addScaledVector(dir, totalLength * Math.abs(u));

        } else if (1.0 < u) {
            const lastCurve = curvePath.curves[curvePath.curves.length - 1];
            const v0 = lastCurve.getPoint(1.0);
            const v1 = lastCurve.getPoint(0.99);
            const dir = new THREE.Vector3().subVectors(v0, v1).normalize();
            result = v0.clone().addScaledVector(dir, totalLength * Math.abs(u));
        }

        return result;
    }

    /**
     * 열차 진입 지점 시작 u값 저장
     */
    saveEntranceLocation() {
        this.entranceUValue = this.currentUValue;
    }

    /**
     * 열차 정차 지점 u값 저장
     */
    saveStopLocation() {
        this.stopUValue = this.currentUValue;
    }

    /**
     * 열차 출차 지점 u값 저장
     */
    saveExitLocation() {
        this.exitUValue = this.currentUValue;
    }

    /**
     * 진입 애니메이션 시작
     * @param tweenGroup - 트윈 그룹
     */
    doEnter(tweenGroup: TWEEN.Group, transitionTime: number = 5.0, onComplete: Function | undefined) {
        if (this.entranceUValue === undefined || this.stopUValue === undefined) {
            console.warn('열차 시작/정차 위치가 설정되지 않음:', this.name);
            return;
        }

        if (this.moveTween !== undefined) {
            this.moveTween?.stop();
            tweenGroup.remove(this.moveTween as TWEEN.Tween);
        }

        // 시작 위치로 이동
        this.updateTrainLocation(this.entranceUValue);

        this.moveTween = new TWEEN.Tween(this)
            .to({
                currentUValue: this.stopUValue
            }, transitionTime * 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.updateTrainLocation(this.currentUValue);
            })
            .onComplete(() => {
                this.moveTween?.stop();
                tweenGroup.remove(this.moveTween as TWEEN.Tween);
                this.moveTween = undefined;

                // 애니메이션 완료 콜백 호출
                onComplete?.();
            })
            .start();

        tweenGroup.add(this.moveTween);
    }

    /**
     * 진출 애니메이션 시작
     * @param tweenGroup - 트윈 그룹
     */
    doExit(tweenGroup: TWEEN.Group, transitionTime: number = 5.0, onComplete: Function | undefined) {
        if (this.exitUValue === undefined || this.stopUValue === undefined) {
            console.warn('열차 정차/종료 위치가 설정되지 않음:', this.name);
            return;
        }

        if (this.moveTween !== undefined) {
            this.moveTween?.stop();
            tweenGroup.remove(this.moveTween as TWEEN.Tween);
        }

        // 시작 위치로 이동
        this.updateTrainLocation(this.stopUValue);

        this.moveTween = new TWEEN.Tween(this)
            .to({
                currentUValue: this.exitUValue
            }, transitionTime * 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() => {
                this.updateTrainLocation(this.currentUValue);
            })
            .onComplete(() => {
                this.moveTween?.stop();
                tweenGroup.remove(this.moveTween as TWEEN.Tween);
                this.moveTween = undefined;

                // 애니메이션 완료 콜백 호출
                onComplete?.();
            })
            .start();

        tweenGroup.add(this.moveTween);
    }

    /**
     * 곡선
     */
    get CurvePath(): THREE.CurvePath<THREE.Vector3> {
        return this.curvePath;
    }

    /**
     * 진입 지점
     */
    get EntranceUValue(): number | undefined {
        return this.entranceUValue;
    }
    /**
     * 진입 지점
     */
    set EntranceUValue(value: number) {
        this.entranceUValue = value;
    }

    /**
     * 정차 지점
     */
    get StopUValue(): number | undefined {
        return this.stopUValue;
    }
    /**
     * 정차 지점
     */
    set StopUValue(value: number) {
        this.stopUValue = value;
    }

    /**
     * 진출 지점
     */
    get ExitUValue(): number | undefined {
        return this.exitUValue;
    }
    /**
     * 진출 지점
     */
    set ExitUValue(value: number) {
        this.exitUValue = value;
    }

    /**
     * 데이터 익스포트
     */
    get ExportData(): Interfaces.SubwayImportOption {
        return {
            id: this.name,
            pathId: this.targetPath.name,
            bodyCount: this.bodyCount,
            entranceUValue: this.entranceUValue!,
            stopUValue: this.stopUValue!,
            exitUValue: this.exitUValue!,
        };
    }
}

export {
    SubwayTrain
}