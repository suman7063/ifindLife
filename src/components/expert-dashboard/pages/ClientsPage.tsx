
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ClientsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Client Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Your Clients
          </CardTitle>
          <CardDescription>Manage your client relationships and session history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search clients..." className="max-w-sm" />
          </div>
          <div className="text-center py-8 text-muted-foreground">
            No clients found. Your client list will appear here once you start consultations.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsPage;
