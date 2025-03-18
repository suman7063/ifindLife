
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LucideIcon } from 'lucide-react';

interface ProfileFormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  Icon?: LucideIcon;
}

const ProfileFormField: React.FC<ProfileFormFieldProps> = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false,
  Icon
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <Input
          id={id}
          name={name}
          type={type}
          className={Icon ? "pl-10" : ""}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ProfileFormField;
