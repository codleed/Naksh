// Form validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password && password.length >= 6;
};

export const validateRequired = (value: any): boolean => {
  return value && value.toString().trim().length > 0;
};

export const validateName = (name: string): boolean => {
  return name && name.trim().length >= 2;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

// Validation rule interface
interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

// Form validation schemas
export const loginValidationSchema = {
  email: [
    { validator: validateRequired, message: 'Email is required' },
    { validator: validateEmail, message: 'Please enter a valid email' }
  ] as ValidationRule[],
  password: [
    { validator: validateRequired, message: 'Password is required' },
    { validator: validatePassword, message: 'Password must be at least 6 characters' }
  ] as ValidationRule[]
};

export const registerValidationSchema = {
  firstName: [
    { validator: validateRequired, message: 'First name is required' },
    { validator: validateName, message: 'First name must be at least 2 characters' }
  ] as ValidationRule[],
  lastName: [
    { validator: validateRequired, message: 'Last name is required' },
    { validator: validateName, message: 'Last name must be at least 2 characters' }
  ] as ValidationRule[],
  email: [
    { validator: validateRequired, message: 'Email is required' },
    { validator: validateEmail, message: 'Please enter a valid email' }
  ] as ValidationRule[],
  password: [
    { validator: validateRequired, message: 'Password is required' },
    { validator: validatePassword, message: 'Password must be at least 6 characters' }
  ] as ValidationRule[]
};

// Generic form validator
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = <T extends Record<string, any>>(
  data: T, 
  schema: Record<keyof T, ValidationRule[]>
): ValidationResult => {
  const errors: Record<string, string> = {};
  
  Object.keys(schema).forEach(field => {
    const fieldValidators = schema[field as keyof T];
    const fieldValue = data[field as keyof T];
    
    for (const { validator, message } of fieldValidators) {
      if (!validator(fieldValue)) {
        errors[field] = message;
        break; // Stop at first validation error for this field
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};