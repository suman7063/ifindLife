
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface AgoraCallChatProps {
  userName?: string;
  expertName?: string;
}

const AgoraCallChat: React.FC<AgoraCallChatProps> = ({
  userName = "You",
  expertName = "Expert"
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{
    id: string;
    text: string;
    sender: 'user' | 'expert';
    timestamp: Date;
  }[]>([
    {
      id: "1",
      text: "Hello, how can I help you today?",
      sender: 'expert',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate expert response after a delay
    setTimeout(() => {
      const expertResponse = {
        id: (Date.now() + 1).toString(),
        text: "I'm reviewing your question. One moment please.",
        sender: 'expert' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, expertResponse]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="font-medium">Chat with {expertName}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-3 ${
                msg.sender === 'user' 
                  ? 'bg-ifind-aqua text-white' 
                  : 'bg-gray-100'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-ifind-aqua hover:bg-ifind-teal">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AgoraCallChat;
