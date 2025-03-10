
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, MapPin, Briefcase, Clock } from 'lucide-react';
import { toast } from 'sonner';
import ProfilePictureUploader from '../common/ProfilePictureUploader';
import { ExpertFormData } from './types';

const ExpertProfileEdit: React.FC = () => {
  const [expert, setExpert] = useState<ExpertFormData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    specialization: '',
    experience: '',
    bio: '',
  });

  useEffect(() => {
    // Load expert data from localStorage
    const expertEmail = localStorage.getItem('ifindlife-expert-email');
    if (expertEmail) {
      const experts = JSON.parse(localStorage.getItem('ifindlife-experts') || '[]');
      const currentExpert = experts.find((e: ExpertFormData) => e.email === expertEmail);
      
      if (currentExpert) {
        setExpert(currentExpert);
        setFormData({
          name: currentExpert.name,
          email: currentExpert.email,
          phone: currentExpert.phone,
          address: currentExpert.address,
          city: currentExpert.city,
          state: currentExpert.state,
          country: currentExpert.country,
          specialization: currentExpert.specialization,
          experience: currentExpert.experience,
          bio: currentExpert.bio,
        });
      }
    }
    setLoading(false);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expert) return;

    // Update expert in localStorage
    const experts = JSON.parse(localStorage.getItem('ifindlife-experts') || '[]');
    const updatedExperts = experts.map((e: ExpertFormData) => {
      if (e.email === expert.email) {
        return { ...e, ...formData };
      }
      return e;
    });

    localStorage.setItem('ifindlife-experts', JSON.stringify(updatedExperts));
    toast.success('Profile updated successfully');
  };

  const handleProfilePictureUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          
          // Update expert in localStorage with new profile picture
          if (expert) {
            const experts = JSON.parse(localStorage.getItem('ifindlife-experts') || '[]');
            const updatedExperts = experts.map((e: ExpertFormData) => {
              if (e.email === expert.email) {
                return { ...e, profilePicture: base64String };
              }
              return e;
            });
            
            localStorage.setItem('ifindlife-experts', JSON.stringify(updatedExperts));
            setExpert({ ...expert, profilePicture: base64String });
          }
          
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!expert) {
    return <div>Expert not found. Please log in again.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your professional information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <ProfilePictureUploader
              currentImage={expert.profilePicture}
              onImageUpload={handleProfilePictureUpload}
              name={expert.name}
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  className="pl-10"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="pl-10"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  className="pl-10"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="specialization" className="text-sm font-medium">
                  Specialization
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    className="pl-10"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="experience" className="text-sm font-medium">
                  Years of Experience
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="experience"
                    name="experience"
                    type="text"
                    className="pl-10"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Professional Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
          >
            Update Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpertProfileEdit;
