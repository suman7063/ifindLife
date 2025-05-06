
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UnauthorizedView = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-red-200">
      <CardHeader className="bg-red-50 border-b border-red-100">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-red-700">Access Denied</CardTitle>
        </div>
        <CardDescription className="text-red-600">
          You must be logged in as an expert to access this dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4 space-y-4">
        <p>
          You are seeing this message because you are either not logged in or do not have the required permissions to
          access the expert dashboard.
        </p>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">What you can do:</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <Button asChild variant="default" className="bg-ifind-aqua hover:bg-ifind-teal">
              <Link to="/expert-login">Log in as Expert</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            If you believe this is an error and you should have access, please contact support.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnauthorizedView;
