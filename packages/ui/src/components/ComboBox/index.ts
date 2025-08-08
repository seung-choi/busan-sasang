import { 
    ComboBox as ComboBoxComponent, 
    ComboBoxTrigger, 
    ComboBoxContent, 
    ComboBoxItem 
} from './ComboBox';

import type { 
    ComboBoxProps, 
    ComboBoxTriggerProps,
    ComboBoxContentProps,
    ComboBoxItemProps,
} from './ComboBox.types';

const ComboBox = Object.assign(ComboBoxComponent, {
    Trigger: ComboBoxTrigger,
    Content: ComboBoxContent,
    Item: ComboBoxItem,
});

export { ComboBox };

export type {
    ComboBoxProps,
    ComboBoxTriggerProps,
    ComboBoxContentProps,
    ComboBoxItemProps,
}