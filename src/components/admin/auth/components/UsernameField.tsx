
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UsernameFieldProps {
  username: string;
  setUsername: (username: string) => void;
  disabled?: boolean;
}

const UsernameField: React.FC<UsernameFieldProps> = ({ 
  username, 
  setUsername, 
  disabled = false 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="admin-username">Username</Label>
      <Input
        id="admin-username"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={disabled}
        autoComplete="username"
      />
    </div>
  );
};

export default UsernameField;
