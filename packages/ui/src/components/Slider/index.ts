import {
    Slider as SliderComponent,
    SliderTrack,
    SliderRange,
    SliderThumb,
} from './Slider';

import type { 
    SliderProps,
    SliderTrackProps,
    SliderRangeProps,
    SliderThumbProps
 } from './Slider.types'; 

const Slider = Object.assign(SliderComponent, {
    Track: SliderTrack,
    Range: SliderRange,
    Thumb: SliderThumb,
});

export { Slider };

export type{
    SliderProps,
    SliderTrackProps,
    SliderRangeProps,
    SliderThumbProps
};