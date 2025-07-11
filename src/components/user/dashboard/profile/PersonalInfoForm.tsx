
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { UserProfile } from '@/types/database/unified';
import { useAuth } from '@/contexts/auth/AuthContext';

interface PersonalInfoFormProps {
  user: UserProfile | null;
  profileData: {
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    currency: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    currency: string;
  }>>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  user, 
  profileData, 
  setProfileData 
}) => {
  const auth = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("Cannot update profile: User ID not found");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Use updateProfile instead of updateUserProfile
      if (!auth.updateProfile) {
        toast.error("Profile update functionality is not available");
        return;
      }
      
      const success = await auth.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        country: profileData.country,
        city: profileData.city,
        currency: profileData.currency
      });
      
      if (success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">Personal Information</h3>
        <p className="text-muted-foreground text-sm mb-4">Update your personal details</p>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name"
                value={profileData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                value={profileData.email}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Preferred Currency</Label>
              <Input 
                id="currency" 
                name="currency"
                value={profileData.currency}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                name="city"
                value={profileData.city}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country" 
                name="country"
                value={profileData.country}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
