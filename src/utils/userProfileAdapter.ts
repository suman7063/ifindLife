
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

export const getProfilePicture = (profile: any): string => {
  return profile?.profile_picture || profile?.profilePicture || '';
};

export const adaptReview = (review: any) => {
  return {
    id: review.id || review.review_id,
    expert_id: review.expert_id,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    verified: review.verified || false,
    expert_name: review.expert_name || review.expertName || 'Unknown Expert'
  };
};

export const adaptConversation = (conversation: any) => {
  return {
    ...conversation,
    name: conversation.participant_name || conversation.name,
    profilePicture: conversation.profile_picture || conversation.profilePicture,
    lastMessage: conversation.last_message || conversation.lastMessage,
    lastMessageDate: conversation.last_message_time || conversation.lastMessageDate,
    unreadCount: conversation.unread_count || conversation.unreadCount || 0
  };
};

export const adaptUserProfile = (profile: any) => {
  return {
    ...profile,
    favorite_experts: profile.favorite_experts || [],
    favorite_programs: profile.favorite_programs || [],
    enrolled_courses: profile.enrolled_courses || [],
    reviews: profile.reviews || [],
    recent_activities: profile.recent_activities || [],
    upcoming_appointments: profile.upcoming_appointments || [],
    transactions: profile.transactions || [],
    reports: profile.reports || [],
    referrals: profile.referrals || []
  };
};
