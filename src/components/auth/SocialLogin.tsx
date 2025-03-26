
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SocialLoginProps {
  socialLoading: string | null;
  authLoading: boolean;
  setSocialLoading?: (provider: string | null) => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({
  socialLoading,
  authLoading,
  setSocialLoading
}) => {
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      if (setSocialLoading) {
        setSocialLoading(provider);
      }
      toast.info(`Logging in with ${provider}...`);
      
      let { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/user-dashboard`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error(`${provider} login failed: ${error.message || 'Please try again later'}`);
    } finally {
      if (setSocialLoading) {
        setSocialLoading(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-3 text-gray-500 text-sm">or continue with</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline" 
          className="flex items-center justify-center" 
          onClick={() => handleSocialLogin('google')}
          disabled={!!socialLoading || authLoading}
        >
          {socialLoading === 'google' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <img src="/lovable-uploads/e973bbdf-7ff5-43b6-9c67-969efbc55fa4.png" alt="Google" className="h-5 w-5" />
          )}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center justify-center" 
          onClick={() => handleSocialLogin('facebook')}
          disabled={!!socialLoading || authLoading}
        >
          {socialLoading === 'facebook' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <img src="/lovable-uploads/6fdf43ed-732a-4659-a397-a7d061440bc2.png" alt="Facebook" className="h-5 w-5" />
          )}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center justify-center" 
          onClick={() => handleSocialLogin('apple')}
          disabled={!!socialLoading || authLoading}
        >
          {socialLoading === 'apple' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <img src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" alt="Apple" className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SocialLogin;
