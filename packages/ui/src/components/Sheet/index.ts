import {
    Sheet as SheetComponent,
    SheetHeader,
    SheetContent,
    SheetFooter
} from "./Sheet";

import type {
    SheetPortalProps,
    SheetProps,
    SheetHeaderProps,
    SheetContentProps,
    SheetFooterProps
} from "./Sheet.types";

const Sheet = Object.assign(SheetComponent, {
    Header: SheetHeader,
    Content: SheetContent,
    Footer: SheetFooter
});

export { Sheet };

export type {
    SheetPortalProps,
    SheetProps,
    SheetHeaderProps,
    SheetContentProps,
    SheetFooterProps
}

