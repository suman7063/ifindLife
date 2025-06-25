
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExpertRegisterFormProps {
  setActiveTab: (tab: string) => void;
}

const ExpertRegisterForm: React.FC<ExpertRegisterFormProps> = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    experience: '',
    bio: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { registerExpert } = useEnhancedUnifiedAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setIsRegistering(true);
      
      const success = await registerExpert(
        formData.email,
        formData.password,
        {
          name: formData.name,
          phone: formData.phone,
          specialization: formData.specialization,
          experience: formData.experience,
          bio: formData.bio
        }
      );
      
      if (success) {
        toast.success('Registration successful! Your profile is pending approval.');
        setActiveTab('login');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expert-name">Full Name</Label>
            <Input
              id="expert-name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              disabled={isRegistering}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expert-phone">Phone</Label>
            <Input
              id="expert-phone"
              type="tel"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              disabled={isRegistering}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expert-reg-email">Email</Label>
          <Input
            id="expert-reg-email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            disabled={isRegistering}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expert-password">Password</Label>
            <Input
              id="expert-password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              disabled={isRegistering}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expert-confirm-password">Confirm Password</Label>
            <Input
              id="expert-confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              disabled={isRegistering}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expert-specialization">Specialization</Label>
            <Input
              id="expert-specialization"
              type="text"
              placeholder="e.g., Clinical Psychology"
              value={formData.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              required
              disabled={isRegistering}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expert-experience">Experience (years)</Label>
            <Input
              id="expert-experience"
              type="number"
              placeholder="Years of experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              required
              disabled={isRegistering}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expert-bio">Bio</Label>
          <Textarea
            id="expert-bio"
            placeholder="Tell us about yourself and your expertise..."
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            required
            disabled={isRegistering}
            rows={3}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isRegistering}
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Expert Account'
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an expert account?{' '}
          <button
            onClick={() => setActiveTab('login')}
            className="text-primary font-medium hover:underline"
          >
            Sign in here
          </button>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Looking for a user account?{' '}
          <Link to="/user-login" className="text-primary hover:underline">
            User Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ExpertRegisterForm;
