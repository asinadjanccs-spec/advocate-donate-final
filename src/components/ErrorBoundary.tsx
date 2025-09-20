import React, { ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug,
  FileText,
  Mail
} from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // This would integrate with an error tracking service like Sentry
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      // For now, just log to console
      console.error('Production error logged:', errorData);
      
      // In a real application, you would send this to your error tracking service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // });
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private renderErrorDetails() {
    if (process.env.NODE_ENV !== 'development' || !this.state.error) {
      return null;
    }

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Bug className="h-4 w-4" />
            <span>Error Details (Development Only)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Error Message:</h4>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded border font-mono">
              {this.state.error.message}
            </p>
          </div>
          
          {this.state.error.stack && (
            <div>
              <h4 className="text-sm font-medium mb-2">Stack Trace:</h4>
              <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded border overflow-auto max-h-64">
                {this.state.error.stack}
              </pre>
            </div>
          )}
          
          {this.state.errorInfo?.componentStack && (
            <div>
              <h4 className="text-sm font-medium mb-2">Component Stack:</h4>
              <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded border overflow-auto max-h-64">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
                </AlertDescription>
              </Alert>

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You can try refreshing the page or returning to the homepage.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={this.handleRetry} className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={this.handleReload} 
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh Page</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={this.handleGoHome} 
                    className="flex items-center space-x-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Go Home</span>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    If this problem persists, please contact our support team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open('mailto:support@advocatedonation.org')}
                      className="flex items-center space-x-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Contact Support</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open('/support', '_blank')}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Help Center</span>
                    </Button>
                  </div>
                </div>
              </div>

              {this.renderErrorDetails()}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
