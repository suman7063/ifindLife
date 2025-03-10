
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, ImageIcon, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface ProfilePictureUploaderProps {
  currentImage?: string;
  onImageUpload: (file: File) => Promise<string>;
  name: string;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ 
  currentImage, 
  onImageUpload, 
  name 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file.");
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await onImageUpload(file);
      setPreviewUrl(imageUrl);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Generate initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-ifind-aqua/20">
          <AvatarImage src={previewUrl} alt={name} />
          <AvatarFallback className="text-lg bg-ifind-aqua/10 text-ifind-teal">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        <button
          type="button"
          onClick={triggerFileInput}
          className="absolute bottom-0 right-0 bg-ifind-aqua hover:bg-ifind-teal text-white p-1.5 rounded-full shadow-md transition-colors"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          <ImageIcon className="h-3.5 w-3.5 mr-1" />
          Change Picture
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="text-xs"
            onClick={() => setPreviewUrl(undefined)}
            disabled={isUploading}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      {isUploading && (
        <div className="text-sm text-muted-foreground">Uploading...</div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
