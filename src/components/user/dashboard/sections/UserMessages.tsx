
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface UserMessagesProps {
  user: UserProfile | null;
}

const UserMessages: React.FC<UserMessagesProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Messages</h2>
        <p className="text-muted-foreground">
          Your conversations with experts and support
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Inbox</CardTitle>
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>You don't have any messages yet</p>
            <p className="mt-2">Messages from experts and support will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserMessages;
