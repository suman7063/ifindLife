import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Link } from 'react-router-dom';

const DebugStatus: React.FC = () => {
  const auth = useSimpleAuth();

  const clearAllStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Debug Status Dashboard
            <Badge variant="outline">Development</Badge>
          </CardTitle>
          <CardDescription>
            Current authentication status and test credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Auth Status */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Current Auth Status:</h3>
            <div className="space-y-1 text-sm">
              <p>Authenticated: <Badge variant={auth.isAuthenticated ? "default" : "secondary"}>{auth.isAuthenticated ? "Yes" : "No"}</Badge></p>
              <p>User Type: <Badge variant="outline">{auth.userType || "none"}</Badge></p>
              <p>Has User: <Badge variant={auth.user ? "default" : "secondary"}>{auth.user ? "Yes" : "No"}</Badge></p>
              <p>Has Expert: <Badge variant={auth.expert ? "default" : "secondary"}>{auth.expert ? "Yes" : "No"}</Badge></p>
              <p>Expert Status: <Badge variant="outline">{auth.expert?.status || "N/A"}</Badge></p>
              <p>Loading: <Badge variant={auth.isLoading ? "default" : "secondary"}>{auth.isLoading ? "Yes" : "No"}</Badge></p>
            </div>
          </div>

          {/* Test Credentials */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔐 Admin Test Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Username:</strong> testadmin</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
                <div className="mt-4 space-y-2">
                  <Link to="/admin-test-login">
                    <Button variant="outline" className="w-full">
                      🧪 Test Admin Login
                    </Button>
                  </Link>
                  <Link to="/admin-login">
                    <Button variant="default" className="w-full">
                      🔐 Secure Admin Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">👨‍⚕️ Expert Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>Sign up as expert and get approved to test the expert dashboard</p>
                </div>
                <div className="mt-4 space-y-2">
                  <Link to="/expert-signup">
                    <Button variant="outline" className="w-full">
                      📝 Expert Signup
                    </Button>
                  </Link>
                  <Link to="/expert-login">
                    <Button variant="default" className="w-full">
                      🔑 Expert Login
                    </Button>
                  </Link>
                  <Link to="/expert-dashboard">
                    <Button variant="secondary" className="w-full">
                      📊 Expert Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Debug Actions:</h3>
            <div className="flex gap-2">
              <Button onClick={clearAllStorage} variant="destructive" size="sm">
                🗑️ Clear All Storage
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                🔄 Reload Page
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Quick Navigation:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Link to="/"><Button variant="ghost" size="sm">🏠 Home</Button></Link>
              <Link to="/experts"><Button variant="ghost" size="sm">👨‍⚕️ Experts</Button></Link>
              <Link to="/services"><Button variant="ghost" size="sm">🛎️ Services</Button></Link>
              <Link to="/programs"><Button variant="ghost" size="sm">📚 Programs</Button></Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugStatus;