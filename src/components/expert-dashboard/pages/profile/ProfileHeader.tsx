
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, Loader2 } from 'lucide-react';

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  isSaving?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isEditing,
  onEditClick,
  onSaveClick,
  isSaving = false
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your professional profile information</p>
      </div>
      
      {!isEditing ? (
        <Button onClick={onEditClick} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      ) : (
        <Button 
          onClick={onSaveClick} 
          className="flex items-center gap-2"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
