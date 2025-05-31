
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedMessagingSystem from './messaging/EnhancedMessagingSystem';
import { MessageSquare, Users, Bell, Settings } from 'lucide-react';

const EnhancedMessagingPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with your clients in real-time</p>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <EnhancedMessagingSystem />
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Client Contacts</CardTitle>
              <CardDescription>Manage your client contact list</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Contact management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Message Notifications</CardTitle>
              <CardDescription>Configure your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Messaging Settings</CardTitle>
              <CardDescription>Customize your messaging experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Messaging settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedMessagingPage;
