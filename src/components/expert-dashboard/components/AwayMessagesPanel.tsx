import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Mail, 
  MailOpen, 
  Clock, 
  User,
  CheckCheck
} from 'lucide-react';
import { useAwayMessaging, AwayMessage } from '@/hooks/useAwayMessaging';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { formatDistanceToNow } from 'date-fns';

const AwayMessagesPanel: React.FC = () => {
  const { expert } = useSimpleAuth();
  const { 
    getAwayMessages, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useAwayMessaging();
  
  const [messages, setMessages] = useState<AwayMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (expert?.auth_id) {
      // Load messages and unread count, but handle errors gracefully
      loadMessages().catch(() => {
        // Error already handled in loadMessages
      });
      loadUnreadCount().catch(() => {
        // Error already handled in loadUnreadCount
      });
    }
  }, [expert?.auth_id]);

  const loadMessages = async () => {
    if (!expert?.auth_id) return;
    
    setLoading(true);
    try {
      const messageList = await getAwayMessages(expert.auth_id);
      setMessages(messageList);
    } catch (error) {
      console.error('Error loading away messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!expert?.auth_id) return;
    
    const count = await getUnreadCount(expert.auth_id);
    setUnreadCount(count);
  };

  const handleMarkAsRead = async (messageId: string) => {
    const success = await markAsRead(messageId);
    if (success) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, is_read: true, read_at: new Date().toISOString() }
          : msg
      ));
      loadUnreadCount();
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!expert?.auth_id) return;
    
    const success = await markAllAsRead(expert.auth_id);
    if (success) {
      setMessages(prev => prev.map(msg => ({
        ...msg,
        is_read: true,
        read_at: new Date().toISOString()
      })));
      setUnreadCount(0);
    }
  };

  if (!expert) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Away Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No away messages yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Messages sent while you're away will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    message.is_read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {message.is_read ? (
                          <MailOpen className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Mail className="h-4 w-4 text-blue-500" />
                        )}
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(message.sent_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    {!message.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(message.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {message.message}
                  </div>
                  
                  {message.read_at && (
                    <div className="text-xs text-gray-400 mt-2">
                      Read {formatDistanceToNow(new Date(message.read_at), { addSuffix: true })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AwayMessagesPanel;