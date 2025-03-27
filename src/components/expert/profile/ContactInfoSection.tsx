
import React from 'react';
import { Input } from '@/components/ui/input';
import { Mail, Phone } from 'lucide-react';

interface ContactInfoSectionProps {
  formData: {
    email: string;
    phone: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email Address
        </label>
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
        <label htmlFor="phone" className="text-sm font-medium">
          Phone Number
        </label>
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
    </div>
  );
};

export default ContactInfoSection;
