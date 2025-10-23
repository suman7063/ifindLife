import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  FileText,
  Camera,
  Save,
  Languages,
  Calendar
} from 'lucide-react';

export const ExpertProfileManageScreen: React.FC = () => {
  const [profile, setProfile] = useState({
    phone: '+1 (555) 123-4567',
    experience: '8',
    bio: 'Experienced therapist specializing in anxiety and stress management. Passionate about helping people find peace and balance in their lives.',
    languages: 'English, Spanish'
  });

  const handleSave = () => {
    console.log('Profile saved:', profile);
  };

  return (
    <div className="flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10 p-6 rounded-b-3xl">
        <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
          Edit Profile
        </h1>
        <p className="text-muted-foreground">
          Update your professional information
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Picture */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">SJ</span>
                </div>
                <Button 
                  size="icon" 
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white border-2 border-background shadow-lg"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-ifind-charcoal">Profile Photo</h3>
                <p className="text-sm text-muted-foreground">Upload a professional photo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editable Information */}
        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-ifind-charcoal">Contact Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-ifind-charcoal">Professional Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="experience"
                type="number"
                value={profile.experience}
                onChange={(e) => setProfile({...profile, experience: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="languages">Languages Spoken</Label>
            <div className="relative">
              <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="languages"
                value={profile.languages}
                onChange={(e) => setProfile({...profile, languages: e.target.value})}
                placeholder="e.g., English, Spanish"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="pl-10 min-h-32"
                placeholder="Tell clients about your expertise and approach..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          className="w-full bg-gradient-to-r from-ifind-teal to-ifind-aqua hover:from-ifind-teal/90 hover:to-ifind-aqua/90"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
