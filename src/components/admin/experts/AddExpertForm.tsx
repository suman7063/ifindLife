
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expert } from './types';

interface AddExpertFormProps {
  onAdd: (newExpert: Expert) => void;
}

const AddExpertForm: React.FC<AddExpertFormProps> = ({ onAdd }) => {
  const [newExpert, setNewExpert] = useState<Expert>({
    id: Date.now().toString(), // Changed to string to match updated Expert interface
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
          onClick={() => {
            if (newExpert.name && newExpert.imageUrl) {
              onAdd(newExpert);
            } else {
              alert("Please fill in all required fields");
            }
          }}
        >
          Add Expert
        </Button>
      </div>
    </div>
  );
};

// Field section components for better organization
const BasicInfoSection = ({ expert, onChange }: { expert: Expert, onChange: (field: keyof Expert, value: any) => void }) => (
  <>
    <div>
      <label className="block text-sm font-medium mb-1">Name</label>
      <Input 
        value={expert.name} 
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Expert name"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Experience (years)</label>
        <Input 
          type="number"
          value={expert.experience} 
          onChange={(e) => onChange('experience', Number(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <Input 
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={expert.rating} 
          onChange={(e) => onChange('rating', Number(e.target.value))}
        />
      </div>
    </div>
  </>
);

const SpecialtiesSection = ({ expert, onChange }: { expert: Expert, onChange: (field: keyof Expert, value: any) => void }) => (
  <>
    <div>
      <label className="block text-sm font-medium mb-1">Specialties (comma separated)</label>
      <Input 
        value={expert.specialties.join(", ")} 
        onChange={(e) => onChange('specialties', e.target.value.split(",").map(s => s.trim()))}
        placeholder="Anxiety, Depression, CBT"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Languages (comma separated)</label>
      <Input 
        value={expert.languages?.join(", ") || ""} 
        onChange={(e) => onChange('languages', e.target.value.split(",").map(s => s.trim()))}
        placeholder="English, Hindi"
      />
    </div>
  </>
);

const BiographySection = ({ expert, onChange }: { expert: Expert, onChange: (field: keyof Expert, value: any) => void }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Bio</label>
    <Textarea 
      value={expert.bio || ""} 
      onChange={(e) => onChange('bio', e.target.value)}
      placeholder="Professional background and expertise"
      rows={3}
    />
  </div>
);

const ContactSection = ({ expert, onChange }: { expert: Expert, onChange: (field: keyof Expert, value: any) => void }) => (
  <>
    <div>
      <label className="block text-sm font-medium mb-1">Email</label>
      <Input 
        type="email"
        value={expert.email || ""} 
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="expert@example.com"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Phone</label>
      <Input 
        value={expert.phone || ""} 
        onChange={(e) => onChange('phone', e.target.value)}
        placeholder="+1 (555) 123-4567"
      />
    </div>
  </>
);

const LocationSection = ({ expert, onChange }: { expert: Expert, onChange: (field: keyof Expert, value: any) => void }) => (
  <>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <Input 
          value={expert.address || ""} 
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="123 Main St"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <Input 
          value={expert.city || ""} 
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="New Delhi"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <Input 
          value={expert.state || ""} 
          onChange={(e) => onChange('state', e.target.value)}
          placeholder="Delhi"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <Input 
          value={expert.country || ""} 
          onChange={(e) => onChange('country', e.target.value)}
          placeholder="India"
        />
      </div>
    </div>
  </>
);

const ImageSection = ({ expert, onChange }: { expert: Expert, onChange: (field: keyof Expert, value: any) => void }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Profile Image URL</label>
    <Input 
      value={expert.imageUrl} 
      onChange={(e) => onChange('imageUrl', e.target.value)}
      placeholder="https://example.com/image.jpg"
    />
  </div>
);

const PricingSection = ({ expert, onChange }: { expert: Expert, onChange: (field: keyof Expert, value: any) => void }) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Price ($/min)</label>
      <Input 
        type="number"
        value={expert.price} 
        onChange={(e) => onChange('price', Number(e.target.value))}
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Wait Time</label>
      <Input 
        value={expert.waitTime} 
        onChange={(e) => onChange('waitTime', e.target.value)}
        placeholder="Available or wait time"
      />
    </div>
  </div>
);

const StatusSection = ({ expert, onChange }: { expert: Expert, onChange: (field: keyof Expert, value: any) => void }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Online Status</label>
    <Select 
      value={expert.online ? "true" : "false"}
      onValueChange={(value) => onChange('online', value === "true")}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Online
          </div>
        </SelectItem>
        <SelectItem value="false">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
            Offline
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default AddExpertForm;
