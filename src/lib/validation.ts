// Form validation utilities for donation forms

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: string | number | boolean | null | undefined) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

class ValidationService {
  /**
   * Validate a single field
   */
  validateField(value: string | number | boolean | null | undefined, rule: ValidationRule, fieldName: string): string | null {
    // Required validation
    if (rule.required && (value === null || value === undefined || value === '')) {
      return `${fieldName} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!rule.required && (value === null || value === undefined || value === '')) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return `${fieldName} must be at least ${rule.minLength} characters long`;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return `${fieldName} must be no more than ${rule.maxLength} characters long`;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return `${fieldName} format is invalid`;
      }
    }

    // Number validations
    if (typeof value === 'number') {
      // Min value validation
      if (rule.min !== undefined && value < rule.min) {
        return `${fieldName} must be at least ${rule.min}`;
      }

      // Max value validation
      if (rule.max !== undefined && value > rule.max) {
        return `${fieldName} must be no more than ${rule.max}`;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  /**
   * Validate an object against a schema
   */
  validate(data: Record<string, string | number | boolean | null | undefined>, schema: ValidationSchema): ValidationResult {
    const errors: Record<string, string> = {};

    for (const [fieldName, rule] of Object.entries(schema)) {
      const value = data[fieldName];
      const error = this.validateField(value, rule, fieldName);
      
      if (error) {
        errors[fieldName] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Sanitize input to prevent XSS and other attacks
   */
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>"'&]/g, (match) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;',
        };
        return entities[match] || match;
      });
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (US format)
   */
  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate credit card number using Luhn algorithm
   */
  isValidCreditCard(cardNumber: string): boolean {
    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    
    // Check if it's all digits
    if (!/^\d+$/.test(cleanNumber)) {
      return false;
    }

    // Check length (13-19 digits for most cards)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate CVV code
   */
  isValidCVV(cvv: string, cardType?: string): boolean {
    const cleanCVV = cvv.replace(/\s/g, '');
    
    // American Express uses 4 digits, others use 3
    if (cardType === 'amex') {
      return /^\d{4}$/.test(cleanCVV);
    }
    
    return /^\d{3}$/.test(cleanCVV);
  }

  /**
   * Validate expiration date
   */
  isValidExpirationDate(month: number, year: number): boolean {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = now.getFullYear();

    // Check if month is valid
    if (month < 1 || month > 12) {
      return false;
    }

    // Check if year is valid (not in the past)
    if (year < currentYear) {
      return false;
    }

    // If it's the current year, check if month is not in the past
    if (year === currentYear && month < currentMonth) {
      return false;
    }

    return true;
  }

  /**
   * Get card type from card number
   */
  getCardType(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    
    if (/^4/.test(cleanNumber)) {
      return 'visa';
    }
    if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
      return 'mastercard';
    }
    if (/^3[47]/.test(cleanNumber)) {
      return 'amex';
    }
    if (/^6/.test(cleanNumber)) {
      return 'discover';
    }
    
    return 'unknown';
  }
}

// Predefined validation schemas for common forms
export const donationValidationSchema: ValidationSchema = {
  amount: {
    required: true,
    min: 1,
    max: 10000,
    custom: (value) => {
      const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
      if (isNaN(numValue) || numValue <= 0) {
        return 'Please enter a valid donation amount';
      }
      return null;
    },
  },
  donorName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  donorEmail: {
    required: true,
    maxLength: 255,
    custom: (value) => {
      const stringValue = String(value || '');
      if (!validationService.isValidEmail(stringValue)) {
        return 'Please enter a valid email address';
      }
      return null;
    },
  },
  message: {
    required: false,
    maxLength: 500,
  },
};

export const contactValidationSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    maxLength: 255,
    custom: (value) => {
      const stringValue = String(value || '');
      if (!validationService.isValidEmail(stringValue)) {
        return 'Please enter a valid email address';
      }
      return null;
    },
  },
  phone: {
    required: false,
    custom: (value) => {
      const stringValue = String(value || '');
      if (stringValue && !validationService.isValidPhoneNumber(stringValue)) {
        return 'Please enter a valid phone number';
      }
      return null;
    },
  },
  subject: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
};

// Export singleton instance
export const validationService = new ValidationService();