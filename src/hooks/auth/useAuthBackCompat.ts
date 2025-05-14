
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/user';

// This hook provides backward compatibility for components
// that depend on the old authentication hooks
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Map new unified auth to user auth format
  const userAuth = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: (email: string, password: string) => auth.login(email, password, 'user'),
    logout: auth.logout,
    signup: (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string) => 
      auth.signup(email, password, userData, referralCode),
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: auth.isAuthenticated && auth.role === 'user' && !auth.userProfile,
    updateProfile: auth.updateProfile,
    updatePassword: auth.updatePassword,
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    rechargeWallet: auth.rechargeWallet,
    addReview: auth.addReview,
    reportExpert: auth.reportExpert,
    hasTakenServiceFrom: auth.hasTakenServiceFrom,
    getExpertShareLink: auth.getExpertShareLink,
    getReferralLink: auth.getReferralLink,
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture
  };
  
  // Map new unified auth to expert auth format
  const expertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    login: (email: string, password: string) => auth.login(email, password, 'expert'),
    logout: auth.logout,
    register: (data: any) => auth.signup(data.email, data.password, data),
    updateProfile: auth.updateExpertProfile,
    initialized: !auth.isLoading,
    loading: auth.isLoading,
    error: null,
    hasUserAccount: async () => {
      return auth.role === 'user' || auth.sessionType === 'dual';
    }
  };
  
  return {
    userAuth,
    expertAuth
  };
};
