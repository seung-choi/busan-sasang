import { 
    Tooltip as TooltipComponent,
    TooltipTrigger,
    TooltipContent
 } from './Tooltip';

import type { TooltipProps } from './Tooltip.types';

const Tooltip = Object.assign(TooltipComponent, {
    Trigger: TooltipTrigger,
    Content: TooltipContent,
});
  
  export { Tooltip } 

  export type { TooltipProps };