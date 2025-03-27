
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
      
      // Create a temporary preview URL immediately for better UX
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
      
      // Call the actual upload function
      const imageUrl = await onImageUpload(file);
      
      // Update with the server URL
      if (imageUrl) {
        setPreviewUrl(imageUrl);
        toast.success("Profile picture updated successfully!");
      }
      
      // Release the temporary object URL
      setTimeout(() => {
        URL.revokeObjectURL(tempUrl);
      }, 3000);
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
      // Revert to previous image on error
      setPreviewUrl(currentImage);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success("Profile picture removed");
  };

  // Generate initials for the avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
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
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt={name || "User"} />
          ) : null}
          <AvatarFallback className="text-lg bg-ifind-aqua/10 text-ifind-teal">
            {getInitials(name || "User")}
          </AvatarFallback>
        </Avatar>
        
        <button
          type="button"
          onClick={triggerFileInput}
          className="absolute bottom-0 right-0 bg-ifind-aqua hover:bg-ifind-teal text-white p-1.5 rounded-full shadow-md transition-colors"
          disabled={isUploading}
          aria-label="Change profile picture"
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
        aria-label="Upload profile picture"
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
          {isUploading ? (
            <span className="flex items-center">
              <span className="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Uploading...
            </span>
          ) : (
            <span className="flex items-center">
              <ImageIcon className="h-3.5 w-3.5 mr-1" />
              Change Picture
            </span>
          )}
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="text-xs"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      {isUploading && (
        <div className="text-sm text-muted-foreground">Uploading your image...</div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
