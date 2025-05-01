
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from '../types';

const ContactSection: React.FC<SectionProps> = ({ expert, onChange }) => (
  <>
    <div>
      <label className="block text-sm font-medium mb-1">Email</label>
      <Input 
        type="email"
        value={expert.email || ""} 
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="expert@example.com"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Phone</label>
      <Input 
        value={expert.phone || ""} 
        onChange={(e) => onChange('phone', e.target.value)}
        placeholder="+1 (555) 123-4567"
      />
    </div>
  </>
);

export default ContactSection;
