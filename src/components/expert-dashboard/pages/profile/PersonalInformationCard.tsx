
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'lucide-react';

interface PersonalInformationCardProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  isEditing: boolean;
  onFormDataChange: (updater: (prev: any) => any) => void;
}

const PersonalInformationCard: React.FC<PersonalInformationCardProps> = ({
  formData,
  isEditing,
  onFormDataChange
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>Manage your personal details and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, location: e.target.value }))}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onFormDataChange(prev => ({ ...prev, bio: e.target.value }))}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
            rows={4}
            placeholder="Tell clients about your experience and approach..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationCard;
