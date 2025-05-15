
import { supabase } from '@/lib/supabase';
import { Message } from '@/types/database/unified';
import { Conversation } from './types';

export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    // Get all unique participants from messages where user is involved
    const { data: messageParticipants, error: participantsError } = await supabase
      .from('messages')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (participantsError) throw participantsError;

    // Extract unique participant IDs (who are not the current user)
    const uniqueParticipantIds = [...new Set(
      messageParticipants
        .flatMap(msg => [msg.sender_id, msg.receiver_id])
        .filter(id => id !== userId)
    )];

    if (uniqueParticipantIds.length === 0) return [];

    // Get participant details
    const { data: participants, error: detailsError } = await supabase
      .from('experts')
      .select('id, name, profile_picture')
      .in('id', uniqueParticipantIds);

    if (detailsError) throw detailsError;

    // Build conversations with participant details and message counts
    const conversations: Conversation[] = [];
    
    for (const participantId of uniqueParticipantIds) {
      const participant = participants?.find(p => p.id === participantId) || { 
        id: participantId,
        name: 'Unknown User',
        profile_picture: null
      };

      // Get latest message
      const { data: latestMessage, error: latestMessageError } = await supabase
        .from('messages')
        .select('content, created_at, read')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${participantId}),and(sender_id.eq.${participantId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestMessageError && latestMessageError.code !== 'PGRST116') {
        console.error('Error fetching latest message:', latestMessageError);
      }

      // Count unread messages
      const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('sender_id', participantId)
        .eq('receiver_id', userId)
        .eq('read', false);

      if (countError) {
        console.error('Error counting unread messages:', countError);
      }

      conversations.push({
        id: participantId, // Use participant ID as conversation ID
        participantId: participantId,
        participantName: participant.name,
        participantImage: participant.profile_picture,
        lastMessage: latestMessage?.content,
        lastMessageTime: latestMessage ? new Date(latestMessage.created_at) : undefined,
        unreadCount: count || 0,
        isOnline: false,
        lastSeen: undefined
      });
    }

    // Sort by latest message
    return conversations.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
    });
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    throw error;
  }
};

export const fetchMessages = async (userId: string, recipientId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${userId})`)
      .order('created_at');

    if (error) throw error;

    // Convert to Message type with UI helper properties
    return (data || []).map(msg => ({
      ...msg,
      isMine: msg.sender_id === userId,
      timestamp: new Date(msg.created_at),
      isRead: msg.read,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      createdAt: msg.created_at
    }));
  } catch (error) {
    console.error('Error in fetchMessages:', error);
    throw error;
  }
};

export const sendMessage = async (senderId: string, recipientId: string, content: string): Promise<Message> => {
  try {
    const newMessage = {
      sender_id: senderId,
      receiver_id: recipientId,
      content,
      read: false,
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      isMine: true,
      timestamp: new Date(data.created_at),
      isRead: false,
      senderId: data.sender_id,
      receiverId: data.receiver_id,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (userId: string, senderId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', userId)
      .eq('sender_id', senderId)
      .eq('read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    throw error;
  }
};

export const messagingRepository = {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markMessagesAsRead
};
