import {
    Tab as TabComponent,
    TabList,
    TabTrigger,
    TabContent,
} from './Tab';

import type {
    TabProps,
    TabListProps,
    TabTriggerProps,
    TabContentProps,
} from './Tab.types';


const Tab = Object.assign(TabComponent, {
    List: TabList,
    Trigger: TabTrigger,
    Content: TabContent
});

export { Tab };

export type{
    TabProps,
    TabListProps,
    TabTriggerProps,
    TabContentProps
};