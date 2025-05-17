
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Lock, Shield } from 'lucide-react';

const SecuritySection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Password updated successfully");
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Account Security</CardTitle>
          </div>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
              
              {passwordData.newPassword && passwordData.confirmPassword && 
                passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>
            
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Two-factor authentication is currently disabled. Enable it to add an extra layer of security to your account.
          </p>
          <Button variant="outline">Enable 2FA</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySection;
