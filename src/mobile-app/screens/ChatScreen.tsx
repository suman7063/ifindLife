import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export const ChatScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="bg-white border-b p-4">
        <h1 className="text-lg font-poppins font-semibold text-ifind-charcoal">Dr. Sarah Johnson</h1>
        <p className="text-sm text-green-600">Online</p>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div className="flex justify-start">
          <div className="bg-white rounded-xl p-3 border border-border/50 max-w-xs">
            <p className="text-muted-foreground">Hello! How can I help you today?</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-ifind-aqua rounded-xl p-3 text-white max-w-xs">
            <p>Hi, I've been feeling anxious lately and would like some guidance.</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input placeholder="Type a message..." className="flex-1" />
          <Button size="sm" className="bg-ifind-aqua hover:bg-ifind-aqua/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};