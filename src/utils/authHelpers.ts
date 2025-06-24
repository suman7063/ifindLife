
/**
 * Auth refresh utilities for forcing context synchronization
 */

export const forceAuthRefresh = () => {
  console.log('🔄 Forcing auth context refresh...');
  
  // Method 1: Dispatch custom event
  window.dispatchEvent(new CustomEvent('auth-refresh'));
  
  // Method 2: Force component re-renders with small delay
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('resize'));
  }, 100);
};

export const navigateAfterLogin = (sessionType: 'user' | 'expert' | 'admin') => {
  console.log('🚀 Navigating after login, session type:', sessionType);
  
  // Set session type
  localStorage.setItem('sessionType', sessionType);
  
  // Force navigation with context refresh
  const targetUrl = sessionType === 'expert' ? '/expert-dashboard' : '/user-dashboard';
  
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 200);
};

export const clearAuthState = () => {
  console.log('🔒 Clearing auth state...');
  localStorage.removeItem('sessionType');
  localStorage.removeItem('supabase.auth.token');
};
