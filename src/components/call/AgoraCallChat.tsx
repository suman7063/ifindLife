
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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="border-b p-3">
        <h3 className="font-medium">Chat with {expertName}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex flex-col ${message.sender === userName ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`px-3 py-2 rounded-lg max-w-[80%] ${
                message.sender === userName 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.sender} • {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-3 flex gap-2">
        <Input 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button 
          onClick={handleSendMessage}
          size="icon"
          className="shrink-0"
          disabled={messageText.trim() === ''}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AgoraCallChat;
