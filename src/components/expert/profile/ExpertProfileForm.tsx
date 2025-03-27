
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ExpertFormData } from '../types';
import ExpertProfilePictureSection from './ExpertProfilePictureSection';
import PersonalInfoSection from './PersonalInfoSection';
import ContactInfoSection from './ContactInfoSection';
import LocationInfoSection from './LocationInfoSection';
import ProfessionalInfoSection from './ProfessionalInfoSection';

const ExpertProfileForm: React.FC = () => {
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

  const handleProfilePictureUpdate = (newExpert: ExpertFormData) => {
    setExpert(newExpert);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!expert) {
    return <div>Expert not found. Please log in again.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ExpertProfilePictureSection 
        expert={expert} 
        onProfileUpdate={handleProfilePictureUpdate} 
      />
      
      <div className="space-y-4">
        <PersonalInfoSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <ContactInfoSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <LocationInfoSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <ProfessionalInfoSection 
          formData={formData} 
          handleChange={handleChange} 
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
      >
        Update Profile
      </Button>
    </form>
  );
};

export default ExpertProfileForm;
