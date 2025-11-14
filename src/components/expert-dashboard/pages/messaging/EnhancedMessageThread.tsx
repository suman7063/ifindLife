
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Send, 
  Paperclip, 
  Video, 
  Phone, 
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
  File,
  Image,
  Download,
  X
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import useMessaging from '@/hooks/messaging';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'system';
  status: 'sent' | 'delivered' | 'read';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface EnhancedMessageThreadProps {
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  onStartVideoCall?: () => void;
  onStartVoiceCall?: () => void;
}

const EnhancedMessageThread: React.FC<EnhancedMessageThreadProps> = ({
  clientId,
  clientName,
  clientAvatar,
  isOnline = false,
  lastSeen,
  onStartVideoCall,
  onStartVoiceCall
}) => {
  const { expert } = useSimpleAuth();
  const expertId = expert?.auth_id || '';
  const { getMessages } = useMessaging();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [clientTyping, setClientTyping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load messages from database
  useEffect(() => {
    if (!expertId || !clientId) return;
    
    const loadMessages = async () => {
      try {
        setLoading(true);
        const fetchedMessages = await getMessages(expertId, clientId);
        
        // Transform to Message format
        const transformedMessages: Message[] = (fetchedMessages || []).map((msg: any) => ({
          id: msg.id,
          senderId: msg.sender_id === expertId ? 'expert' : msg.sender_id,
          senderName: msg.sender_id === expertId ? 'You' : clientName,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          type: 'text' as const,
          status: msg.read ? 'read' : 'delivered' as const
        }));
        
        setMessages(transformedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`expert-chat:${expertId}:${clientId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${expertId},receiver_id.eq.${clientId}),and(sender_id.eq.${clientId},receiver_id.eq.${expertId}))`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          const transformedMsg: Message = {
            id: newMsg.id,
            senderId: newMsg.sender_id === expertId ? 'expert' : newMsg.sender_id,
            senderName: newMsg.sender_id === expertId ? 'You' : clientName,
            content: newMsg.content,
            timestamp: new Date(newMsg.created_at),
            type: 'text',
            status: newMsg.read ? 'read' : 'delivered'
          };
          
          setMessages(prev => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, transformedMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [expertId, clientId, clientName, getMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate client typing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setClientTyping(true);
        setTimeout(() => setClientTyping(false), 2000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !expertId || !clientId) return;

    // Optimistically add message
    const tempMessageId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempMessageId,
      senderId: 'expert',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, tempMessage]);
    const messageContent = newMessage;
    setNewMessage('');

    try {

      // Send message directly to database using expert's auth_id
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: expertId, // Use expert's auth_id as sender
          receiver_id: clientId,
          content: messageContent.trim(),
          read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(m => m.id !== tempMessageId));
        toast.error('Failed to send message');
        return;
      }

      // Replace temp message with real message from database
      const realMessage: Message = {
        id: data.id,
        senderId: 'expert',
        senderName: 'You',
        content: data.content,
        timestamp: new Date(data.created_at),
        type: 'text',
        status: 'sent'
      };

      setMessages(prev => 
        prev.map(m => m.id === tempMessageId ? realMessage : m)
      );

      console.log('Message sent successfully:', data);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id === tempMessage.id));
      toast.error('Failed to send message');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate file upload
    setIsUploading(true);
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          
          // Add file message
          const fileMessage: Message = {
            id: Date.now().toString(),
            senderId: 'expert',
            senderName: 'You',
            content: `Shared file: ${file.name}`,
            timestamp: new Date(),
            type: file.type.startsWith('image/') ? 'image' : 'file',
            status: 'sent',
            fileName: file.name,
            fileSize: file.size,
            fileUrl: URL.createObjectURL(file)
          };
          
          setMessages(prev => [...prev, fileMessage]);
          toast.success('File uploaded successfully');
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
    }
  };

  const renderMessage = (message: Message) => {
    const isOwn = message.senderId === 'expert';
    
    return (
      <div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
            isOwn
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {message.type === 'file' || message.type === 'image' ? (
            <div className="space-y-2">
              {message.type === 'image' ? (
                <img 
                  src={message.fileUrl} 
                  alt={message.fileName}
                  className="max-w-full h-auto rounded"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-white/10 rounded">
                  <File className="h-4 w-4" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{message.fileName}</p>
                    <p className="text-xs opacity-70">{formatFileSize(message.fileSize || 0)}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
            </div>
          ) : (
            <p>{message.content}</p>
          )}
          <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span>{formatTime(message.timestamp)}</span>
            {isOwn && getStatusIcon(message.status)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={clientAvatar} />
            <AvatarFallback>{clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{clientName}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {isOnline ? (
                <>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  <span>Last seen {lastSeen ? formatTime(lastSeen) : 'recently'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onStartVoiceCall}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onStartVideoCall}
          >
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Schedule Session</DropdownMenuItem>
              <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
              <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {messages.map(renderMessage)}
          
          {clientTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Upload Progress */}
      {isUploading && (
        <div className="p-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <File className="h-4 w-4" />
            <span>Uploading file...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isUploading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || isUploading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessageThread;
