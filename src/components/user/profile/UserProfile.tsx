
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile as UserProfileType } from '@/types/database/unified';
import { adaptUserProfile, getProfilePicture } from '@/utils/userProfileAdapter';
import { Camera, Save } from 'lucide-react';

interface UserProfileProps {
  user: UserProfileType | any;
  onSave?: (data: any) => Promise<boolean>;
  loading?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSave, loading = false }) => {
  // Adapt user profile to ensure consistent structure
  const adaptedUser = adaptUserProfile(user);
  
  const [formData, setFormData] = useState({
    name: adaptedUser.name || '',
    email: adaptedUser.email || '',
    phone: adaptedUser.phone || '',
    city: adaptedUser.city || '',
    country: adaptedUser.country || '',
    currency: adaptedUser.currency || 'USD'
  });

  const [isEditing, setIsEditing] = useState(false);
  const profilePicture = getProfilePicture(adaptedUser);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (onSave) {
      const success = await onSave(formData);
      if (success) {
        setIsEditing(false);
      }
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profilePicture} alt={adaptedUser.name} />
            <AvatarFallback className="text-lg">
              {getInitials(adaptedUser.name)}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md">{adaptedUser.name || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md">{adaptedUser.email || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md">{adaptedUser.phone || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            {isEditing ? (
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md">{adaptedUser.city || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            {isEditing ? (
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md">{adaptedUser.country || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            {isEditing ? (
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md">{adaptedUser.currency || 'USD'}</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              ${adaptedUser.wallet_balance.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Wallet Balance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{adaptedUser.favorite_experts.length}</p>
            <p className="text-sm text-gray-500">Favorite Experts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{adaptedUser.favorite_programs.length}</p>
            <p className="text-sm text-gray-500">Favorite Programs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
