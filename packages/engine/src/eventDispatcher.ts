import * as THREE from 'three';

class CustomEventDispatcher extends THREE.EventDispatcher {

    private _listeners: any;

    /**
     * 생성자
     */
    constructor() {
        super();
    }

    /**
     * 이벤트 콜백 호출시 three.js 내부요소를 제거하고 필요한 정보만 전달하기 위해 오버라이드 처리
     * @param event - 이벤트 정보
     */
    dispatchEvent(event: any): void {

        if (this._listeners === undefined)
            return;

        const listeners = this._listeners;
        const listenersArray = listeners[event.type];

        if (listenersArray !== undefined) {
            const targets = listenersArray.slice(0);
            targets.forEach((item: any) => item.call(this, event));
        }

    }
}

const internalHandler = new CustomEventDispatcher(); // 내부 이벤트 핸들러
const externalHandler = new CustomEventDispatcher(); // 외부 노출용 이벤트 핸들러

export {
    CustomEventDispatcher,
    internalHandler as InternalHandler,
    externalHandler as ExternalHandler,
}