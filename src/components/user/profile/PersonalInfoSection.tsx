
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone } from 'lucide-react';
import { ProfileFormData } from './UserProfileForm';

interface PersonalInfoSectionProps {
  formData: ProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="name"
            name="name"
            type="text"
            className="pl-10"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            className="pl-10"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="phone"
            name="phone"
            type="tel"
            className="pl-10"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </>
  );
};

export default PersonalInfoSection;
