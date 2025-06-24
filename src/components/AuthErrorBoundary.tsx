
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
}

class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔒 Auth Error Boundary caught error:', error, errorInfo);
    
    // Check for specific React errors
    if (error.message.includes('Maximum update depth exceeded')) {
      console.error('🔒 CRITICAL: React Error #300 - Infinite render loop detected');
      toast.error('Authentication system error detected. Refreshing page...');
      
      // Clear auth state and refresh
      localStorage.removeItem('sessionType');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    // Clear error state and try again
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Clear potentially corrupted auth state
    localStorage.removeItem('sessionType');
    
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
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 p-3 rounded text-sm">
                  <p className="font-semibold text-red-800">Error:</p>
                  <p className="text-red-700">{this.state.error.message}</p>
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
