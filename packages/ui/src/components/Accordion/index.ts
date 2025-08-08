import { 
    Accordion as AccordionComponent, 
    AccordionItem, 
    AccordionTrigger, 
    AccordionContent, 
} from './Accordion';

import type { 
  AccordionProps, 
  AccordionItemProps, 
  AccordionTriggerProps, 
  AccordionContentProps 
} from './Accordion.types'; 

const Accordion = Object.assign(AccordionComponent, {
    Item: AccordionItem,
    Trigger: AccordionTrigger,
    Content: AccordionContent
});

export { Accordion };

export type{
    AccordionProps, 
    AccordionItemProps,
    AccordionTriggerProps,
    AccordionContentProps,
};