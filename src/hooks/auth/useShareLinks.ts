
export const useShareLinks = () => {
  const getExpertShareLink = (expertId: string, userId?: string): string => {
    // In a real application, you would generate a share link with proper referral tracking
    return `${window.location.origin}/experts/${expertId}${userId ? `?ref=${userId}` : ''}`;
  };

  const getReferralLink = (referralCode?: string): string => {
    if (!referralCode) return '';
    return `${window.location.origin}/user-login?ref=${referralCode}`;
  };

  return {
    getExpertShareLink,
    getReferralLink
  };
};
