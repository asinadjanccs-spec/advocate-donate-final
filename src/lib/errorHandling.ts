import { toast } from '../hooks/use-toast';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  context?: Record<string, any>;
}

export class DonationError extends Error {
  public readonly code: string;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(
    code: string,
    message: string,
    details?: any,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'DonationError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    this.context = context;
  }

  toAppError(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      context: this.context
    };
  }
}

export class ValidationError extends DonationError {
  constructor(message: string, field?: string, value?: any) {
    super(
      'VALIDATION_ERROR',
      message,
      { field, value },
      { type: 'validation' }
    );
    this.name = 'ValidationError';
  }
}

export class NetworkError extends DonationError {
  constructor(message: string, statusCode?: number, endpoint?: string) {
    super(
      'NETWORK_ERROR',
      message,
      { statusCode, endpoint },
      { type: 'network' }
    );
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends DonationError {
  constructor(message: string = 'Authentication required') {
    super(
      'AUTHENTICATION_ERROR',
      message,
      undefined,
      { type: 'authentication' }
    );
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends DonationError {
  constructor(message: string = 'Permission denied') {
    super(
      'AUTHORIZATION_ERROR',
      message,
      undefined,
      { type: 'authorization' }
    );
    this.name = 'AuthorizationError';
  }
}

export class PaymentError extends DonationError {
  constructor(message: string, paymentCode?: string) {
    super(
      'PAYMENT_ERROR',
      message,
      { paymentCode },
      { type: 'payment' }
    );
    this.name = 'PaymentError';
  }
}

export class DatabaseError extends DonationError {
  constructor(message: string, operation?: string, table?: string) {
    super(
      'DATABASE_ERROR',
      message,
      { operation, table },
      { type: 'database' }
    );
    this.name = 'DatabaseError';
  }
}

// Error handling utilities
export class ErrorHandler {
  private static errorLog: AppError[] = [];

  /**
   * Handle errors with appropriate user feedback and logging
   */
  static handle(error: unknown, context?: Record<string, any>): AppError {
    const appError = this.processError(error, context);
    
    // Log error
    this.logError(appError);
    
    // Show user-friendly message
    this.showUserMessage(appError);
    
    return appError;
  }

  /**
   * Handle errors silently (log only, no user message)
   */
  static handleSilent(error: unknown, context?: Record<string, any>): AppError {
    const appError = this.processError(error, context);
    this.logError(appError);
    return appError;
  }

  /**
   * Convert various error types to AppError
   */
  private static processError(error: unknown, context?: Record<string, any>): AppError {
    if (error instanceof DonationError) {
      return {
        ...error.toAppError(),
        context: { ...error.context, ...context }
      };
    }

    if (error instanceof Error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        timestamp: new Date(),
        context: { ...context, originalName: error.name, stack: error.stack }
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        code: 'STRING_ERROR',
        message: error,
        timestamp: new Date(),
        context
      };
    }

    // Handle unknown error types
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      details: error,
      timestamp: new Date(),
      context
    };
  }

  /**
   * Log error to console and store in memory
   */
  private static logError(error: AppError): void {
    // Add to in-memory log
    this.errorLog.push(error);
    
    // Keep only last 100 errors in memory
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }

    // Console logging
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.code}: ${error.message}`);
      console.error('Error details:', error.details);
      console.error('Context:', error.context);
      console.error('Timestamp:', error.timestamp);
      console.groupEnd();
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.reportToService(error);
    }
  }

  /**
   * Show appropriate user message based on error type
   */
  private static showUserMessage(error: AppError): void {
    const message = this.getUserFriendlyMessage(error);
    const variant = this.getToastVariant(error);

    toast({
      title: 'Error',
      description: message,
      variant: variant as any,
      duration: 5000
    });
  }

  /**
   * Get user-friendly error message
   */
  private static getUserFriendlyMessage(error: AppError): string {
    const messages: Record<string, string> = {
      'VALIDATION_ERROR': error.message || 'Please check your input and try again.',
      'NETWORK_ERROR': 'Connection problem. Please check your internet and try again.',
      'AUTHENTICATION_ERROR': 'Please sign in to continue.',
      'AUTHORIZATION_ERROR': 'You don\'t have permission to perform this action.',
      'PAYMENT_ERROR': error.message || 'Payment processing failed. Please try again.',
      'DATABASE_ERROR': 'We\'re experiencing technical difficulties. Please try again.',
      'DONATION_CREATION_FAILED': 'Failed to create donation. Please try again.',
      'DONATION_UPDATE_FAILED': 'Failed to update donation. Please try again.',
      'PHYSICAL_DONATION_ERROR': 'Physical donation processing failed. Please try again.',
      'DONATION_TYPE_ERROR': 'Donation type configuration error. Please contact support.',
      'ORGANIZATION_ERROR': 'Organization processing error. Please try again.',
      'CAMPAIGN_ERROR': 'Campaign processing error. Please try again.'
    };

    return messages[error.code] || error.message || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Get appropriate toast variant for error type
   */
  private static getToastVariant(error: AppError): 'destructive' | 'default' {
    const criticalErrors = [
      'PAYMENT_ERROR',
      'DATABASE_ERROR',
      'AUTHENTICATION_ERROR',
      'AUTHORIZATION_ERROR'
    ];

    return criticalErrors.includes(error.code) ? 'destructive' : 'default';
  }

  /**
   * Report error to external service (production)
   */
  private static reportToService(error: AppError): void {
    try {
      // This would integrate with services like Sentry, LogRocket, etc.
      const errorReport = {
        ...error,
        url: window.location.href,
        userAgent: navigator.userAgent,
        userId: localStorage.getItem('userId') || 'anonymous'
      };

      // For now, just log to console
      console.log('Error reported to service:', errorReport);

      // In real implementation:
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });
    } catch (reportingError) {
      console.error('Failed to report error to service:', reportingError);
    }
  }

  /**
   * Get recent errors for debugging
   */
  static getRecentErrors(limit: number = 10): AppError[] {
    return this.errorLog.slice(-limit);
  }

  /**
   * Clear error log
   */
  static clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Retry wrapper for async operations
   */
  static async retry<T>(
    operation: () => Promise<T>,
    options: {
      maxAttempts?: number;
      delay?: number;
      backoff?: boolean;
      context?: Record<string, any>;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      delay = 1000,
      backoff = true,
      context = {}
    } = options;

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts) {
          throw this.handle(error, {
            ...context,
            attempt,
            maxAttempts,
            retriesExhausted: true
          });
        }

        // Log retry attempt
        this.handleSilent(error, {
          ...context,
          attempt,
          maxAttempts,
          retrying: true
        });

        // Wait before retry with optional backoff
        const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }

  /**
   * Safe async wrapper that doesn't throw
   */
  static async safe<T>(
    operation: () => Promise<T>,
    fallback?: T,
    context?: Record<string, any>
  ): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
    try {
      const result = await operation();
      return { success: true, data: result };
    } catch (error) {
      const appError = this.handleSilent(error, context);
      return { success: false, error: appError };
    }
  }
}

// Specialized error handlers for different domains
export class DonationErrorHandler extends ErrorHandler {
  static handleDonationCreation(error: unknown): AppError {
    return this.handle(error, { domain: 'donation', operation: 'create' });
  }

  static handleDonationUpdate(error: unknown): AppError {
    return this.handle(error, { domain: 'donation', operation: 'update' });
  }

  static handlePhysicalDonation(error: unknown): AppError {
    return this.handle(error, { domain: 'donation', type: 'physical' });
  }

  static handlePayment(error: unknown): AppError {
    return this.handle(error, { domain: 'payment' });
  }
}

export class OrganizationErrorHandler extends ErrorHandler {
  static handleOrganizationSetup(error: unknown): AppError {
    return this.handle(error, { domain: 'organization', operation: 'setup' });
  }

  static handleCampaignCreation(error: unknown): AppError {
    return this.handle(error, { domain: 'organization', operation: 'campaign_create' });
  }
}

// Global error handler setup
export const setupGlobalErrorHandling = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handle(event.reason, {
      type: 'unhandledRejection',
      url: window.location.href
    });
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    ErrorHandler.handle(event.error, {
      type: 'uncaughtError',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      url: window.location.href
    });
  });
};

// Note: Error types are already exported with their class declarations above
