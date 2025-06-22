import { useState, useCallback } from 'react';

interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule[];
};

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e: React.FormEvent) => Promise<void>;
  validateForm: () => boolean;
  validateField: (fieldName: keyof T, fieldValue: any) => boolean;
  resetForm: () => void;
  setFormValues: (newValues: Partial<T>) => void;
  setFormErrors: (newErrors: Partial<Record<keyof T, string>>) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof T]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Handle field blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur if validation schema exists
    if (validationSchema && validationSchema[name as keyof T]) {
      validateField(name as keyof T, values[name as keyof T]);
    }
  }, [values, validationSchema]);

  // Validate single field
  const validateField = useCallback((fieldName: keyof T, fieldValue: any): boolean => {
    if (!validationSchema || !validationSchema[fieldName]) {
      return true;
    }

    const fieldValidators = validationSchema[fieldName]!;
    
    for (const { validator, message } of fieldValidators) {
      if (!validator(fieldValue)) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: message
        }));
        return false;
      }
    }

    // Clear error if validation passes
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    
    return true;
  }, [validationSchema]);

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    if (!validationSchema) {
      return true;
    }

    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const fieldValidators = validationSchema[fieldName as keyof T]!;
      const fieldValue = values[fieldName as keyof T];

      for (const { validator, message } of fieldValidators) {
        if (!validator(fieldValue)) {
          newErrors[fieldName as keyof T] = message;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateForm]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set form values
  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  // Set form errors
  const setFormErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    validateField,
    resetForm,
    setFormValues,
    setFormErrors,
    setIsSubmitting
  };
};