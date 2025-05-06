
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface UserReportsProps {
  users: any[];
}

const UserReports: React.FC<UserReportsProps> = ({ users = [] }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">User Reports</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Reported Users</CardTitle>
          <CardDescription>Users you have reported for inappropriate behavior</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="border rounded-lg p-4">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-muted p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No reported users</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You haven't reported any users yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserReports;
