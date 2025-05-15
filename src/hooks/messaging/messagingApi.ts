
import { supabase } from "@/lib/supabase";
import { Message } from "./types";
import { MessagingUser } from "./types";

// Fetch messaging users
export async function fetchMessagingUsers(): Promise<MessagingUser[]> {
  try {
    const { data, error } = await supabase
      .from('experts')
      .select('id, name, profile_picture, last_seen, is_online');

    if (error) throw error;

    return data.map(expert => ({
      id: expert.id,
      name: expert.name,
      profilePicture: expert.profile_picture,
      isOnline: expert.is_online || false,
      lastSeen: expert.last_seen || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching messaging users:', error);
    return [];
  }
}

// Fetch messages between two users
export async function fetchMessages(userId: string, otherId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .or(`sender_id.eq.${otherId},receiver_id.eq.${otherId}`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(message => ({
      id: message.id,
      content: message.content,
      timestamp: message.created_at,
      isRead: message.read,
      senderId: message.sender_id,
      receiverId: message.receiver_id
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

// Send a message
export async function sendMessage(
  senderId: string, 
  receiverId: string, 
  content: string
): Promise<Message | null> {
  try {
    const messageData = {
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      read: false,
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      content: data.content,
      timestamp: data.created_at,
      isRead: data.read,
      senderId: data.sender_id,
      receiverId: data.receiver_id
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

// Mark messages as read
export async function markMessagesAsRead(userId: string, otherId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', userId)
      .eq('sender_id', otherId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
}
