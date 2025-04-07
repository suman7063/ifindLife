
import { useExpertAuth } from '@/hooks/expert-auth';
import { useLoginPageStatus } from './login-page/useLoginPageStatus';
import { useUserProfileCheck } from './login-page/useUserProfileCheck';
import { useLoginFormHandler } from './login-page/useLoginFormHandler';
import { useRedirectHandler } from './login-page/useRedirectHandler';
import { useTabHandler } from './login-page/useTabHandler';
import { useDebugLogging } from './login-page/useDebugLogging';
import { UseExpertLoginPageReturn } from './login-page/loginPageTypes';

export const useExpertLoginPage = (): UseExpertLoginPageReturn => {
  const { currentExpert: expert, loading, initialized } = useExpertAuth();
  const { statusMessage } = useLoginPageStatus();
  const { userProfile, isCheckingUser } = useUserProfileCheck();
  const { isLoggingIn, loginError, handleLogin } = useLoginFormHandler(userProfile);
  const { redirectAttempted } = useRedirectHandler(expert, loading, initialized);
  const { activeTab, setActiveTab } = useTabHandler();
  
  // Set up debug logging
  useDebugLogging(loading, initialized, expert, userProfile, redirectAttempted);
  
  return {
    isLoggingIn,
    loginError,
    activeTab,
    setActiveTab,
    userProfile,
    statusMessage,
    expert,
    loading,
    initialized,
    isCheckingUser,
    handleLogin,
    redirectAttempted
  };
};
