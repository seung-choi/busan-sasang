import { 
    Dropdown as DropdownComponent,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
} from './Dropdown';

import type{
    DropdownProps,
} from './Dropdown.types';

const Dropdown = Object.assign(DropdownComponent, {
    Trigger: DropdownTrigger,
    Content: DropdownContent,
    Item: DropdownItem,
});

export { Dropdown };
export type {
    DropdownProps,
};