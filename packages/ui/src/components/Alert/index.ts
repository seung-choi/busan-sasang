import {
    Alert as AlertComponent,
    AlertTitle,
    AlertDescription,
} from './Alert';

import type { AlertProps } from './Alert.types';

const Alert = Object.assign(AlertComponent, {
    Title: AlertTitle,
    Description: AlertDescription,
});

export { Alert };

export type {AlertProps};