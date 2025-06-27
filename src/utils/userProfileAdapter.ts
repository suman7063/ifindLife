
import { Message } from '@/types/database/unified';
import { Message as MessagingMessage } from '@/hooks/messaging/types';

export const adaptMessage = (message: Message, currentUserId: string): MessagingMessage & { isMine: boolean; timestamp: Date } => {
  return {
    id: message.id,
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    content: message.content,
    read: message.read,
    created_at: message.created_at,
    updated_at: message.updated_at,
    isMine: message.sender_id === currentUserId,
    timestamp: new Date(message.created_at)
  };
};
