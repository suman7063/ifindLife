
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { testCredentials } from '@/contexts/admin-auth/constants';

const CredentialsHelper: React.FC = () => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const copyToClipboard = async (text: string, type: 'username' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'username') {
        setCopiedUsername(true);
        setTimeout(() => setCopiedUsername(false), 2000);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-blue-800 flex items-center justify-between">
          Test Credentials
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowCredentials(!showCredentials)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      {showCredentials && (
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="font-medium">Username:</span>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {testCredentials.iflsuperadmin.username}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(testCredentials.iflsuperadmin.username, 'username')}
                  className="h-6 w-6 p-0"
                >
                  {copiedUsername ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="font-medium">Password:</span>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {testCredentials.iflsuperadmin.password}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(testCredentials.iflsuperadmin.password, 'password')}
                  className="h-6 w-6 p-0"
                >
                  {copiedPassword ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Click the copy buttons to copy credentials to clipboard
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default CredentialsHelper;
