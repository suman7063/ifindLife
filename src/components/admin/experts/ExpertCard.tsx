
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expert } from './types';

interface ExpertCardProps {
  expert: Expert;
  index: number;
  experts: Expert[];
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, index, experts, setExperts }) => {
  const updateExpert = (field: keyof Expert, value: any) => {
    const newExperts = [...experts];
    newExperts[index] = { ...newExperts[index], [field]: value };
    setExperts(newExperts);
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="w-full md:w-1/4">
          <img 
            src={expert.imageUrl} 
            alt={expert.name}
            className="aspect-square w-full object-cover rounded-lg" 
          />
          <Input
            className="mt-2 text-xs"
            placeholder="Image URL"
            value={expert.imageUrl}
            onChange={(e) => updateExpert('imageUrl', e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-3">
          <BasicInfoSection expert={expert} updateExpert={updateExpert} />
          <StatsSection expert={expert} updateExpert={updateExpert} />
          <AvailabilitySection expert={expert} updateExpert={updateExpert} />
          <SpecialtiesSection expert={expert} updateExpert={updateExpert} />
          <BiographySection expert={expert} updateExpert={updateExpert} />
          <ContactSection expert={expert} updateExpert={updateExpert} />
          <LocationSection expert={expert} updateExpert={updateExpert} />
          <OnlineStatusSection expert={expert} updateExpert={updateExpert} />
          
          <div className="flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const newExperts = experts.filter((_, i) => i !== index);
                setExperts(newExperts);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Field section components for better organization
const BasicInfoSection = ({ expert, updateExpert }: { expert: Expert, updateExpert: (field: keyof Expert, value: any) => void }) => (
  <div>
    <label className="text-xs font-medium">Name</label>
    <Input
      value={expert.name}
      onChange={(e) => updateExpert('name', e.target.value)}
    />
  </div>
);

const StatsSection = ({ expert, updateExpert }: { expert: Expert, updateExpert: (field: keyof Expert, value: any) => void }) => (
  <>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium">Experience (years)</label>
        <Input
          type="number"
          value={expert.experience}
          onChange={(e) => updateExpert('experience', Number(e.target.value))}
        />
      </div>
      <div>
        <label className="text-xs font-medium">Rating</label>
        <Input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={expert.rating}
          onChange={(e) => updateExpert('rating', Number(e.target.value))}
        />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium">Consultations</label>
        <Input
          type="number"
          value={expert.consultations}
          onChange={(e) => updateExpert('consultations', Number(e.target.value))}
        />
      </div>
      <div>
        <label className="text-xs font-medium">Price ($/min)</label>
        <Input
          type="number"
          value={expert.price}
          onChange={(e) => updateExpert('price', Number(e.target.value))}
        />
      </div>
    </div>
  </>
);

const AvailabilitySection = ({ expert, updateExpert }: { expert: Expert, updateExpert: (field: keyof Expert, value: any) => void }) => (
  <div>
    <label className="text-xs font-medium">Wait Time</label>
    <Input
      value={expert.waitTime}
      onChange={(e) => updateExpert('waitTime', e.target.value)}
    />
  </div>
);

const SpecialtiesSection = ({ expert, updateExpert }: { expert: Expert, updateExpert: (field: keyof Expert, value: any) => void }) => (
  <>
    <div>
      <label className="text-xs font-medium">Specialties (comma separated)</label>
      <Input
        value={expert.specialties.join(", ")}
        onChange={(e) => updateExpert('specialties', e.target.value.split(",").map(s => s.trim()))}
      />
    </div>
    
    <div>
      <label className="text-xs font-medium">Languages (comma separated)</label>
      <Input
        value={expert.languages?.join(", ") || ""}
        onChange={(e) => updateExpert('languages', e.target.value.split(",").map(s => s.trim()))}
      />
    </div>
  </>
);

const BiographySection = ({ expert, updateExpert }: { expert: Expert, updateExpert: (field: keyof Expert, value: any) => void }) => (
  <div>
    <label className="text-xs font-medium">Bio</label>
    <Textarea
      value={expert.bio || ""}
      onChange={(e) => updateExpert('bio', e.target.value)}
      rows={3}
    />
  </div>
);

const ContactSection = ({ expert, updateExpert }: { expert: Expert, updateExpert: (field: keyof Expert, value: any) => void }) => (
  <>
    <div>
      <label className="text-xs font-medium">Email</label>
      <Input
        type="email"
        value={expert.email || ""}
        onChange={(e) => updateExpert('email', e.target.value)}
      />
    </div>

    <div>
      <label className="text-xs font-medium">Phone</label>
      <Input
        value={expert.phone || ""}
        onChange={(e) => updateExpert('phone', e.target.value)}
      />
    </div>
  </>
);

const LocationSection = ({ expert, updateExpert }: { expert: Expert, updateExpert: (field: keyof Expert, value: any) => void }) => (
  <>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium">Address</label>
        <Input
          value={expert.address || ""}
          onChange={(e) => updateExpert('address', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium">City</label>
        <Input
          value={expert.city || ""}
          onChange={(e) => updateExpert('city', e.target.value)}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium">State</label>
        <Input
          value={expert.state || ""}
          onChange={(e) => updateExpert('state', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium">Country</label>
        <Input
          value={expert.country || ""}
          onChange={(e) => updateExpert('country', e.target.value)}
        />
      </div>
    </div>
  </>
);

const OnlineStatusSection = ({ expert, updateExpert }: { expert: Expert, updateExpert: (field: keyof Expert, value: any) => void }) => (
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="text-xs font-medium">Online Status</label>
      <Select 
        value={expert.online ? "true" : "false"}
        onValueChange={(value) => updateExpert('online', value === "true")}
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
    <div>
      <label className="text-xs font-medium">Availability</label>
      <Input
        value={expert.availability || ""}
        onChange={(e) => updateExpert('availability', e.target.value)}
        placeholder="e.g. Available, 5 min wait, etc."
      />
    </div>
  </div>
);

export default ExpertCard;
