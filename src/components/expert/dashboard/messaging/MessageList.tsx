
import React from 'react';
import { Message } from '@/types/database/unified';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import useMessaging from '@/hooks/messaging';
import { adaptMessage } from '@/utils/userProfileAdapter';

interface MessageListProps {
  userId: string;
  onSelectConversation?: (userId: string, userName: string) => void;
  selectedUserId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ userId, onSelectConversation, selectedUserId }) => {
  const [message, setMessage] = React.useState('');
  const { messages: messagesList, sendMessage, loading } = useMessaging();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await sendMessage(userId, message);
    setMessage('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : messagesList.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet
          </div>
        ) : (
          messagesList.map((msg: Message) => {
            const adaptedMsg = adaptMessage(msg, userId);
            return (
              <div
                key={adaptedMsg.id}
                className={`max-w-[80%] p-3 rounded-lg ${
                  adaptedMsg.isMine
                    ? 'ml-auto bg-primary text-white rounded-br-none'
                    : 'bg-gray-100 rounded-bl-none'
                }`}
              >
                <p>{adaptedMsg.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    adaptedMsg.isMine ? 'text-primary-foreground/70' : 'text-gray-500'
                  }`}
                >
                  {adaptedMsg.timestamp?.toLocaleTimeString() || new Date(adaptedMsg.created_at).toLocaleTimeString()}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t p-4 flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[60px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || loading}
          className="self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageList;
