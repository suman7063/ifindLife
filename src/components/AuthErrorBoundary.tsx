
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

class AuthErrorBoundary extends Component<Props, State> {
  private errorTimeoutRef: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔒 Auth Error Boundary caught error:', error, errorInfo);
    
    // Increment error count to track cascading errors
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
    
    // Check for specific React errors that indicate auth loops
    if (error.message.includes('Maximum update depth exceeded')) {
      console.error('🔒 CRITICAL: React Error #300 - Infinite render loop detected in auth system');
      toast.error('Authentication system error detected. Resetting...');
      
      // Clear ALL auth-related localStorage to break the loop
      ['sessionType', 'expertProfile', 'userProfile'].forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Delayed page refresh to allow error to be logged
      if (this.errorTimeoutRef) clearTimeout(this.errorTimeoutRef);
      this.errorTimeoutRef = setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    
    // Track cascading errors that might indicate auth state loops
    if (this.state.errorCount >= 3) {
      console.error('🔒 CRITICAL: Multiple auth errors detected - resetting auth system');
      toast.error('Multiple authentication errors detected. Please refresh the page.');
      
      // Clear auth state and force reload after multiple errors
      localStorage.clear();
      if (this.errorTimeoutRef) clearTimeout(this.errorTimeoutRef);
      this.errorTimeoutRef = setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    
    // Check for auth context errors
    if (error.message.includes('useEnhancedUnifiedAuth') || error.message.includes('AuthContext')) {
      console.error('🔒 Auth context error detected:', error.message);
      toast.error('Authentication context error. Refreshing...');
      
      if (this.errorTimeoutRef) clearTimeout(this.errorTimeoutRef);
      this.errorTimeoutRef = setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }

  componentWillUnmount() {
    if (this.errorTimeoutRef) {
      clearTimeout(this.errorTimeoutRef);
    }
  }

  handleRetry = () => {
    // Clear error state and try again
    this.setState({ hasError: false, error: null, errorInfo: null, errorCount: 0 });
    
    // Clear potentially corrupted auth state
    ['sessionType', 'expertProfile', 'userProfile'].forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Reload the page to reset everything
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-red-600">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Something went wrong with the authentication system. This is usually a temporary issue.
              </p>
              
              {this.state.errorCount >= 2 && (
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="text-yellow-800 text-sm font-semibold">
                    Multiple errors detected ({this.state.errorCount})
                  </p>
                  <p className="text-yellow-700 text-sm">
                    The page will auto-refresh to reset the authentication system.
                  </p>
                </div>
              )}
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 p-3 rounded text-sm">
                  <p className="font-semibold text-red-800">Error:</p>
                  <p className="text-red-700">{this.state.error.message}</p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-red-600">Stack trace</summary>
                      <pre className="text-xs mt-1 whitespace-pre-wrap text-red-600">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  Retry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                If this error persists, please refresh the page or clear your browser cache.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
