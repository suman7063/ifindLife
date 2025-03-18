
import React from 'react';
import { Mail, Phone, User } from 'lucide-react';
import ProfileFormField from './ProfileFormField';

interface PersonalInfoSectionProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  handleChange
}) => {
  return (
    <div className="space-y-4">
      <ProfileFormField
        id="name"
        name="name"
        label="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        Icon={User}
      />
      
      <ProfileFormField
        id="email"
        name="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleChange}
        disabled
        Icon={Mail}
      />
      
      <ProfileFormField
        id="phone"
        name="phone"
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        required
        Icon={Phone}
      />
    </div>
  );
};

export default PersonalInfoSection;
