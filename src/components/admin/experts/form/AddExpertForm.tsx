
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Expert } from '../types';
import {
  BasicInfoSection,
  SpecialtiesSection,
  BiographySection,
  ContactSection,
  LocationSection,
  ImageSection,
  PricingSection,
  StatusSection
} from './sections';

interface AddExpertFormProps {
  onAdd: (newExpert: Expert) => void;
}

const AddExpertForm: React.FC<AddExpertFormProps> = ({ onAdd }) => {
  const [newExpert, setNewExpert] = useState<Expert>({
    id: Date.now().toString(),
    name: "",
    experience: 5,
    specialties: [""],
    rating: 4.5,
    consultations: 1000,
    price: 30,
    waitTime: "Available",
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    online: true,
    languages: ["English", "Hindi"],
    bio: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    availability: "Available"
  });

  const handleChange = (field: keyof Expert, value: any) => {
    setNewExpert(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (newExpert.name && newExpert.imageUrl) {
      onAdd(newExpert);
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <BasicInfoSection expert={newExpert} onChange={handleChange} />
      <SpecialtiesSection expert={newExpert} onChange={handleChange} />
      <BiographySection expert={newExpert} onChange={handleChange} />
      <ContactSection expert={newExpert} onChange={handleChange} />
      <LocationSection expert={newExpert} onChange={handleChange} />
      <ImageSection expert={newExpert} onChange={handleChange} />
      <PricingSection expert={newExpert} onChange={handleChange} />
      <StatusSection expert={newExpert} onChange={handleChange} />
      
      <div className="flex justify-end mt-4">
        <Button 
          className="bg-ifind-aqua hover:bg-ifind-teal"
          onClick={handleSubmit}
        >
          Add Expert
        </Button>
      </div>
    </div>
  );
};

export default AddExpertForm;
