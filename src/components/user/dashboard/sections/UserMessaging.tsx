import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMessaging } from '@/hooks/useMessaging';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, isToday } from 'date-fns';

const UserMessaging: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useSimpleAuth();
  const { conversations, loading } = useMessaging(userProfile?.id);

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
  const activeConversations = conversations.filter(conv => conv.last_message);

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return isToday(date) ? format(date, 'HH:mm') : format(date, 'MMM dd');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Messages</h2>
          <p className="text-muted-foreground">
            Communicate with experts anytime
          </p>
        </div>
        
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your conversations...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Messages</h2>
          <p className="text-muted-foreground">
            Communicate with experts anytime
          </p>
        </div>
        <Button onClick={() => navigate('/messaging')}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Open Chat
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
            <p className="text-xs text-muted-foreground">
              Active chat threads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnread}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeConversations.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
              <p className="text-muted-foreground mb-4">
                Start chatting with experts to get personalized guidance
              </p>
              <Button onClick={() => navigate('/experts')}>
                <Send className="h-4 w-4 mr-2" />
                Find Experts
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.slice(0, 5).map((conversation) => (
                <div
                  key={conversation.expert_id}
                  onClick={() => navigate(`/messaging?expert=${conversation.expert_id}`)}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.expert_image} />
                    <AvatarFallback>
                      {conversation.expert_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">
                        {conversation.expert_name}
                      </h4>
                      {conversation.last_message && (
                        <span className="text-sm text-muted-foreground">
                          {formatLastMessageTime(conversation.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    
                    {conversation.last_message ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message.content}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No messages yet
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {conversation.unread_count > 0 && (
                      <Badge variant="destructive">
                        {conversation.unread_count}
                      </Badge>
                    )}
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
              
              {conversations.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => navigate('/messaging')}>
                    View All Conversations
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserMessaging;