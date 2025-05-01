
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from './types';

const ContactSection: React.FC<SectionProps> = ({ expert, updateExpert }) => (
  <>
    <div>
      <label className="text-xs font-medium">Email</label>
      <Input
        type="email"
        value={expert.email || ""}
        onChange={(e) => updateExpert('email', e.target.value)}
      />
    </div>

    <div>
      <label className="text-xs font-medium">Phone</label>
      <Input
        value={expert.phone || ""}
        onChange={(e) => updateExpert('phone', e.target.value)}
      />
    </div>
  </>
);

export default ContactSection;
