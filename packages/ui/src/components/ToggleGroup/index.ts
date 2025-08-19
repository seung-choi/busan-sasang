import { 
    ToggleGroup as ToggleGroupComponent,
    ToggleGroupItem
 } from './ToggleGroup';

import { 
    ToggleGroupProps,
    ToggleGroupItemProps
} from './ToggleGroup.types';

const ToggleGroup = Object.assign(ToggleGroupComponent, {
    Item: ToggleGroupItem
});

export { ToggleGroup };

export type{
    ToggleGroupProps,
    ToggleGroupItemProps
};