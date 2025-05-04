
import { useContext } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserAuthContext } from '@/contexts/auth/UserAuthContext';

interface ExpertAuth {
  currentExpert: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, expertData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: any) => Promise<boolean>;
}

interface UserAuth {
  currentUser: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: any) => Promise<boolean>;
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
}

export const useAuthBackCompat = () => {
  const auth = useAuth();
  const userContext = useContext(UserAuthContext);
  
  const userAuth: UserAuth = {
    currentUser: auth.userProfile,
    isAuthenticated: !!auth.userProfile && auth.isAuthenticated,
    loading: auth.isLoading,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    updateProfile: auth.updateUserProfile,
    addToFavorites: async (expertId: number) => {
      if (!auth.userProfile) return false;
      
      const currentFavorites = auth.userProfile.favorite_experts || [];
      const updatedFavorites = [...currentFavorites, expertId.toString()];
      
      return auth.updateUserProfile({ favorite_experts: updatedFavorites });
    },
    removeFromFavorites: async (expertId: number) => {
      if (!auth.userProfile) return false;
      
      const currentFavorites = auth.userProfile.favorite_experts || [];
      const updatedFavorites = currentFavorites.filter(
        id => id !== expertId.toString()
      );
      
      return auth.updateUserProfile({ favorite_experts: updatedFavorites });
    }
  };
  
  const expertAuth: ExpertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: !!auth.expertProfile && auth.isAuthenticated,
    loading: auth.isLoading,
    login: (email: string, password: string) => auth.login(email, password),
    signup: (email: string, password: string, expertData: any) => {
      return auth.signup(email, password, expertData);
    },
    logout: auth.logout,
    updateProfile: (data: any) => {
      if (!auth.expertProfile) return Promise.resolve(false);
      return auth.updateUserProfile(data);
    }
  };
  
  return {
    userAuth,
    expertAuth,
    auth
  };
};
