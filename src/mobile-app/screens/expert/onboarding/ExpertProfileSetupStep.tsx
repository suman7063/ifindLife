import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Camera, Upload, User } from 'lucide-react';
import { toast } from 'sonner';

interface ExpertProfileSetupStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const ExpertProfileSetupStep: React.FC<ExpertProfileSetupStepProps> = ({
  onNext,
  onBack
}) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WEBP image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
      toast.success('Photo selected successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    if (!profilePicture) {
      toast.error('Please upload a profile picture');
      return;
    }
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      toast.success('Profile picture uploaded');
      onNext();
    }, 1000);
  };

  const handleSkip = () => {
    toast.info('You can add a profile picture later');
    onNext();
  };

  return (
    <div className="p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Profile Picture
        </h1>
        <p className="text-muted-foreground">
          Add a professional photo to help clients recognize you
        </p>
      </div>

      {/* Profile Picture Upload */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Preview Area */}
          <div className="flex justify-center">
            <div className="relative">
              {profilePicture ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                  <img
                    src={profilePicture}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-dashed border-muted-foreground/30">
                  <User className="w-16 h-16 text-muted-foreground/50" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-3 shadow-lg">
                <Camera className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Upload Instructions */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Label htmlFor="profile-picture" className="text-base font-medium">
                Upload Your Photo
              </Label>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or WEBP (max 5MB)
              </p>
            </div>

            {/* Upload Button */}
            <div className="space-y-3">
              <Input
                id="profile-picture"
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label htmlFor="profile-picture">
                <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                  <Upload className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {profilePicture ? 'Change Photo' : 'Choose Photo'}
                  </span>
                </div>
              </Label>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-foreground">Tips for a great photo:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use good lighting and a clear background</li>
              <li>• Face the camera and smile naturally</li>
              <li>• Wear professional attire</li>
              <li>• Avoid filters or heavy editing</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border space-y-3">
        <Button
          onClick={handleContinue}
          disabled={!profilePicture || uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? 'Uploading...' : 'Continue'}
        </Button>
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Back
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="flex-1"
            size="lg"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </div>
  );
};
