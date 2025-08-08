import { ReactNode, ReactElement } from 'react'
import {ValidatorFn} from "./validationUtils";

export interface FormValues {
  [key: string]: string | number | boolean
}

export interface FormProps<T extends FormValues> {
  children: ReactNode
  onSubmit: (values: T) => void
  initialValues?: T
  className?: string
  validate?: (values: T) => Partial<Record<keyof T, string>>
}

export interface FormFieldProps<T> {
  value: T
  onChange: (value: T) => void;
  required?: boolean
}

export interface FormContextType<T> {
  values: T;
  setFieldValue: <K extends keyof T>(name: K, value: T[K]) => void;
  validateField?: <K extends keyof T>(name: K, value: T[K]) => void;
  setFormErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof T, string>>>>;
  errors?: Partial<Record<keyof T, string>>;
  isValid: boolean;
}

export interface FormItemProps<T extends FormValues, K extends keyof T = keyof T> {
  name: K;
  label?: string;
  required?: boolean;
  validate?: ValidatorFn[];
  children: ReactElement<FormFieldProps<T[K]>>
}