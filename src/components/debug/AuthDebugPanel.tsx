
import React, { useState } from 'react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Bug } from 'lucide-react';

const AuthDebugPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const auth = useSimpleAuth();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-orange-200">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-orange-600" />
              Auth Debug
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={auth.isAuthenticated ? "default" : "secondary"}
                className="text-xs"
              >
                {auth.userType}
              </Badge>
              {isExpanded ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </div>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0 space-y-2">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Authenticated:</span>
                <Badge variant={auth.isAuthenticated ? "default" : "secondary"} className="text-xs">
                  {auth.isAuthenticated ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Loading:</span>
                <Badge variant={auth.isLoading ? "secondary" : "outline"} className="text-xs">
                  {auth.isLoading ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>User Type:</span>
                <Badge variant="outline" className="text-xs">
                  {auth.userType}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Has Session:</span>
                <Badge variant={auth.session ? "default" : "secondary"} className="text-xs">
                  {auth.session ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>User Profile:</span>
                <Badge variant={auth.userProfile ? "default" : "secondary"} className="text-xs">
                  {auth.userProfile ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Expert Profile:</span>
                <Badge variant={auth.expert ? "default" : "secondary"} className="text-xs">
                  {auth.expert ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs"
                onClick={() => window.open('/auth-test', '_blank')}
              >
                Open Test Suite
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AuthDebugPanel;
