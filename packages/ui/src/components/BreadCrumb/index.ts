import {
    BreadCrumb as BreadCrumbComponent,
    BreadCrumbItem,
    BreadCrumbLink,
} from './BreadCrumb';

import type {
    BreadCrumbProps,
    BreadCrumbItemProps,
} from './BreadCrumb.types';


const BreadCrumb = Object.assign(BreadCrumbComponent, {
    Item: BreadCrumbItem,
    Link: BreadCrumbLink,
});

export { BreadCrumb };

export type{
    BreadCrumbProps,
    BreadCrumbItemProps,
};