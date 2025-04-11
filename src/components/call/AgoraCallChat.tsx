
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export interface AgoraCallChatProps {
  expertId?: string;
  userId?: string;
  userName?: string;
  messages?: any[];
}

const AgoraCallChat: React.FC<AgoraCallChatProps> = ({
  expertId,
  userId,
  userName
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ id: number; text: string; sender: string; timestamp: Date }[]>([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'expert',
      timestamp: new Date()
    }
  ]);
  
  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, newUserMessage]);
    setMessage('');
    
    // Simulate expert response after a short delay
    setTimeout(() => {
      const expertResponse = {
        id: messages.length + 2,
        text: 'I received your message. Let me assist you with that.',
        sender: 'expert',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, expertResponse]);
    }, 2000);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="font-medium">Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <Button 
            size="icon" 
            onClick={handleSend} 
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgoraCallChat;
