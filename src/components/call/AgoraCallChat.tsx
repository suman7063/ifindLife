
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

interface AgoraCallChatProps {
  visible: boolean;
  userName: string;
  expertName: string;
}

const AgoraCallChat: React.FC<AgoraCallChatProps> = ({
  visible,
  userName,
  expertName
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: expertName,
      text: 'Hello, how can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: userName,
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    
    // Simulate a reply after a short delay
    setTimeout(() => {
      const reply: Message = {
        id: Date.now().toString(),
        sender: expertName,
        text: 'I understand. Let me think about that for a moment.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, reply]);
    }, 3000);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!visible) return null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-primary/5 to-accent/5 rounded-xl shadow-lg border border-primary/20">
      <div className="border-b border-primary/20 p-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <h3 className="font-semibold text-foreground">Chat with {expertName}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex flex-col ${message.sender === userName ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`px-4 py-3 rounded-2xl max-w-[80%] shadow-sm ${
                message.sender === userName 
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[var(--glow-primary)]' 
                  : 'bg-gradient-to-br from-secondary/20 to-accent/20 text-foreground border border-secondary/30'
              }`}
            >
              {message.text}
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">
              {message.sender} • {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-primary/20 p-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex gap-3">
          <Input 
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-background/70 border-primary/30 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
          />
          <Button 
            onClick={handleSendMessage}
            size="icon"
            className="shrink-0 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--glow-primary)] transition-all duration-200 rounded-xl"
            disabled={messageText.trim() === ''}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgoraCallChat;
