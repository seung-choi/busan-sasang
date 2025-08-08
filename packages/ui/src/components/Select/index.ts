import {
    Select as SelectComponent,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from './Select';

import type {
    SelectProps,
    SelectItemProps
} from './Select.types';


const Select = Object.assign(SelectComponent, {
    Trigger: SelectTrigger,
    Content: SelectContent,
    Item: SelectItem,
});

export { Select };

export type {
    SelectProps,
    SelectItemProps
}

