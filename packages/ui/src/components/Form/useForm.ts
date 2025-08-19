// useForm.ts
import { useState, useCallback } from 'react';

export type ValidationErrors = Record<string, string>;
export type FormValues = Record<string, string>;

interface UseFormProps {
  initialValues: FormValues;
  validate?: (values: FormValues) => ValidationErrors;
  onSubmit: (values: FormValues) => void;
}

export function useForm({ initialValues, validate, onSubmit }: UseFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 단일 필드 값 설정
  const setFieldValue = useCallback((name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // 필드가 수정되었음을 표시
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // 유효성 검증 실행 (validate 함수가 제공된 경우)
    if (validate) {
      const newValues = { ...values, [name]: value };
      const validationErrors = validate(newValues);
      
      // 현재 필드에 대한 오류만 업데이트
      if (validationErrors[name]) {
        setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  }, [values, validate]);

  // 폼 제출 처리
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // 모든 필드를 터치 상태로 표시
    const allTouched = Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    // 최종 유효성 검증
    let validationErrors = {};
    if (validate) {
      validationErrors = validate(values);
      setErrors(validationErrors);
    }
    
    // 오류가 없으면 제출 처리
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [initialValues, onSubmit, validate, values]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    handleSubmit,
    resetForm
  };
}
