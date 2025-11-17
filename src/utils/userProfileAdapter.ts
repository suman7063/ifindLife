
import { UserProfile } from '@/types/database/unified';

export function adaptUserProfile(user: any): UserProfile | null {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    city: user.city,
    currency: user.currency || 'EUR',
    profile_picture: user.profile_picture || user.profilePicture,
    wallet_balance: user.wallet_balance || user.walletBalance || 0,
    created_at: user.created_at,
    updated_at: user.updated_at,
    referred_by: user.referred_by,
    referral_code: user.referral_code || user.referralCode,
    referral_link: user.referral_link,
    favorite_experts: user.favorite_experts || user.favoriteExperts || [],
    favorite_programs: user.favorite_programs || [],
    enrolled_courses: user.enrolled_courses || user.enrolledCourses || [],
    reviews: user.reviews || [],
    recent_activities: user.recent_activities || [],
    upcoming_appointments: user.upcoming_appointments || [],
    reports: user.reports || [],
    transactions: user.transactions || [],
    referrals: user.referrals || []
  };
}

// Fix adaptMessage to take only one parameter and add userId context
export function adaptMessage(message: any, currentUserId?: string) {
  if (!message) return null;
  
  return {
    id: message.id,
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    content: message.content,
    read: message.read,
    created_at: message.created_at,
    updated_at: message.updated_at,
    isMine: currentUserId ? message.sender_id === currentUserId : message.isMine,
    timestamp: message.timestamp ? new Date(message.timestamp) : new Date(message.created_at)
  };
}

export function adaptConversation(conversation: any) {
  if (!conversation) return null;
  
  return {
    id: conversation.id || conversation.participant_id,
    participant_id: conversation.participant_id || conversation.id,
    participant_name: conversation.participant_name || conversation.name,
    name: conversation.name || conversation.participant_name,
    profilePicture: conversation.profilePicture || conversation.profile_picture,
    last_message: conversation.last_message || conversation.lastMessage || '',
    lastMessage: conversation.lastMessage || conversation.last_message || '',
    last_message_time: conversation.last_message_time || conversation.lastMessageDate,
    lastMessageDate: conversation.lastMessageDate || conversation.last_message_time,
    unread_count: conversation.unread_count || conversation.unreadCount || 0,
    unreadCount: conversation.unreadCount || conversation.unread_count || 0
  };
}

export function adaptTransaction(transaction: any) {
  if (!transaction) return null;
  
  return {
    id: transaction.id,
    user_id: transaction.user_id,
    amount: transaction.amount,
    date: transaction.date || transaction.created_at,
    created_at: transaction.created_at || transaction.date,
    type: transaction.type || transaction.transaction_type,
    transaction_type: transaction.transaction_type || transaction.type,
    currency: transaction.currency,
    description: transaction.description
  };
}

export function adaptReview(review: any) {
  if (!review) return null;
  
  return {
    id: review.id,
    expert_id: review.expert_id,
    rating: review.rating,
    date: review.date,
    comment: review.comment,
    verified: review.verified,
    user_name: review.user_name,
    expert_name: review.expert_name,
    review_id: review.review_id || review.id
  };
}

export function getProfilePicture(profile: any): string {
  if (!profile) return '';
  return profile.profile_picture || profile.profilePicture || '';
}
