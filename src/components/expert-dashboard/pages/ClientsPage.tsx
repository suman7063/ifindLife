
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientRelationshipManager from './clients/ClientRelationshipManager';

const ClientsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-muted-foreground">
          Manage your client relationships and track their progress
        </p>
      </div>
      
      <Tabs defaultValue="relationships" className="w-full">
        <TabsList>
          <TabsTrigger value="relationships">Client Relationships</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="relationships">
          <ClientRelationshipManager />
        </TabsContent>

        <TabsContent value="progress">
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
            <p>Track client progress and goal achievements</p>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-lg font-medium mb-2">Client Reports</h3>
            <p>Generate comprehensive client progress reports</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientsPage;
