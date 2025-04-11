
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export interface AgoraCallChatProps {
  userName?: string;
  expertName?: string;
}

const AgoraCallChat: React.FC<AgoraCallChatProps> = ({ userName, expertName }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'expert', text: 'Hello! How can I help you today?', time: new Date().toISOString() }
  ]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      sender: 'user',
      text: message,
      time: new Date().toISOString()
    }]);
    
    setMessage('');
    
    // Simulate expert response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'expert',
        text: 'Thank you for your message. I\'m reviewing your question.',
        time: new Date().toISOString()
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-muted/50 p-3 border-b">
        <h3 className="text-sm font-medium">Chat with {expertName || 'Expert'}</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={sendMessage} className="border-t p-3 flex">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button 
          type="submit" 
          className="rounded-l-none"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default AgoraCallChat;
