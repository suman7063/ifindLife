
import React, { useState } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertCircle, User, Shield } from 'lucide-react';

const AuthTestSuite: React.FC = () => {
  const { 
    user, 
    session, 
    userType, 
    isLoading, 
    isAuthenticated, 
    expert, 
    userProfile, 
    login, 
    logout 
  } = useSimpleAuth();

  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runTest = (testName: string, condition: boolean) => {
    setTestResults(prev => ({ ...prev, [testName]: condition }));
    return condition;
  };

  const runAuthTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    // Test 1: Hook availability
    runTest('useSimpleAuth_available', typeof useSimpleAuth === 'function');

    // Test 2: Initial state consistency
    runTest('initial_state_consistent', !isLoading || (isLoading && !isAuthenticated));

    // Test 3: User type consistency
    runTest('user_type_consistent', 
      userType === 'none' ? !isAuthenticated : 
      userType === 'user' ? (isAuthenticated && !!userProfile) :
      userType === 'expert' ? (isAuthenticated && !!expert) : false
    );

    // Test 4: Authentication state consistency
    runTest('auth_state_consistent', isAuthenticated === !!user);

    // Test 5: Session consistency
    runTest('session_consistency', !!session === !!user);

    // Test 6: Profile data consistency
    if (isAuthenticated) {
      runTest('profile_data_available', 
        (userType === 'user' && !!userProfile) || 
        (userType === 'expert' && !!expert) ||
        userType === 'none'
      );
    }

    // Test 7: Login function availability
    runTest('login_function_available', typeof login === 'function');

    // Test 8: Logout function availability
    runTest('logout_function_available', typeof logout === 'function');

    setIsRunningTests(false);
  };

  const getTestIcon = (result: boolean | undefined) => {
    if (result === undefined) return <AlertCircle className="h-4 w-4 text-gray-400" />;
    return result ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  const testsPassed = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication System Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
              <Badge variant="outline">
                {userType.toUpperCase()}
              </Badge>
              {isLoading && <Badge variant="secondary">Loading</Badge>}
            </div>
            <Button 
              onClick={runAuthTests} 
              disabled={isRunningTests}
              size="sm"
            >
              {isRunningTests ? 'Running Tests...' : 'Run Tests'}
            </Button>
          </div>

          {totalTests > 0 && (
            <div className="text-sm text-gray-600">
              Tests Passed: {testsPassed}/{totalTests}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Authentication State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>User ID:</strong> {user?.id || 'None'}
            </div>
            <div>
              <strong>Email:</strong> {user?.email || 'None'}
            </div>
            <div>
              <strong>User Type:</strong> {userType}
            </div>
            <div>
              <strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Has Session:</strong> {session ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
            </div>
          </div>

          <Separator />

          {userProfile && (
            <div>
              <strong>User Profile:</strong>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                {JSON.stringify({
                  id: userProfile.id,
                  name: userProfile.name,
                  email: userProfile.email
                }, null, 2)}
              </pre>
            </div>
          )}

          {expert && (
            <div>
              <strong>Expert Profile:</strong>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                {JSON.stringify({
                  id: expert.id,
                  name: expert.name,
                  email: expert.email,
                  status: expert.status
                }, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {totalTests > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(testResults).map(([testName, result]) => (
                <div key={testName} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm font-mono">{testName.replace(/_/g, ' ')}</span>
                  {getTestIcon(result)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuthTestSuite;
