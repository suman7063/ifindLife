import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

const AdminPasswordChange: React.FC = () => {
  const auth = useSimpleAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    isValid: false
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      const strength = validatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    
    if (!passwordStrength.isValid) {
      toast.error("Please use a stronger password.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Note: updatePassword function needs to be implemented in SimpleAuth context
      
      if (success) {
        toast.success("Admin password updated successfully.");
        // Reset form
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setPasswordStrength({ score: 0, feedback: '', isValid: false });
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating admin password:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = () => {
    const colors = [
      'bg-red-500',    // Very Weak
      'bg-orange-500', // Weak
      'bg-yellow-500', // Medium
      'bg-blue-500',   // Strong
      'bg-green-500'   // Very Strong
    ];
    return colors[Math.min(passwordStrength.score, 4)];
  };

  const getStrengthLabel = () => {
    const labels = [
      'Very Weak',
      'Weak',
      'Medium',
      'Strong',
      'Very Strong'
    ];
    return labels[Math.min(passwordStrength.score, 4)];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Admin Password Change
        </CardTitle>
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
              onChange={handlePasswordChange}
              className="w-full"
              placeholder="Enter new password"
              required
            />
            
            {passwordData.newPassword && (
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full bg-gray-200 rounded">
                  <div 
                    className={`h-2 rounded transition-all duration-300 ${getStrengthColor()}`} 
                    style={{ width: `${Math.max(5, Math.min(100, passwordStrength.score * 20))}%` }} 
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium">
                    {passwordData.newPassword ? getStrengthLabel() : 'Enter password'}
                  </span>
                  <span className="text-muted-foreground">
                    {passwordStrength.feedback}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full"
              placeholder="Confirm new password"
              required
            />
            
            {passwordData.newPassword && passwordData.confirmPassword && 
              passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  Passwords don't match
                </p>
              )
            }
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !passwordStrength.isValid || passwordData.newPassword !== passwordData.confirmPassword}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Update Admin Password'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminPasswordChange;