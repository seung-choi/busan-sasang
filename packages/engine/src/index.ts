export * from './engine';
export * as EventDispatcher from './eventDispatcher';
export * as Loader from './loader';
export * as Camera from './camera';
export * as Model from './model';
export * as Poi from './poi';
export * as Path3D from './path3d';
export * as Interfaces from './interfaces';
export * as Subway from './subway';
export * as Label3D from './label3d';

// Util의 경우 내부사용 함수도 있으므로 지정한것들만 export하도록 처리
import * as UtilInternal from './util';
export const Util = {
    SetBackground: UtilInternal.SetBackground
};

import * as EventInternal from './eventDispatcher';
export const Event = {
    AddEventListener: (type: string, callback: Function) => {
        EventInternal.ExternalHandler.addEventListener(type as never, callback as never);

    },
    RemoveEventListener: (type: string, callback: Function) => {
        EventInternal.ExternalHandler.removeEventListener(type as never, callback as never);
    }
};

import './objectselector';