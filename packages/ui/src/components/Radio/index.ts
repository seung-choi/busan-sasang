import {
    RadioGroup as RadioGroupComponent,
    RadioGroupItem,
} from './Radio';

import type { 
    RadioGroupProps,
    RadioGroupItemProps,
 } from './Radio.types';

const RadioGroup = Object.assign(RadioGroupComponent, {
    Item: RadioGroupItem,
});

export { RadioGroup };

export type { RadioGroupProps, RadioGroupItemProps } 