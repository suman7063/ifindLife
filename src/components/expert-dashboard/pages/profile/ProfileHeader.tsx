
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Save } from 'lucide-react';

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  isEditing, 
  onEditClick, 
  onSaveClick 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Professional Profile</h1>
      <Button
        onClick={isEditing ? onSaveClick : onEditClick}
        className="flex items-center gap-2"
      >
        {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        {isEditing ? 'Save Changes' : 'Edit Profile'}
      </Button>
    </div>
  );
};

export default ProfileHeader;
