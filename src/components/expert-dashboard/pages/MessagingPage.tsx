
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MessagingPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No active conversations
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>Select a conversation to start messaging</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-96">
              <div className="flex-1 p-4 bg-gray-50 rounded-md mb-4">
                <div className="text-center py-8 text-muted-foreground">
                  Select a conversation to view messages
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagingPage;
