
import React from 'react';
import { Button } from "@/components/ui/button";
import { Expert } from '../types';
import BasicInfoSection from './sections/BasicInfoSection';
import StatsSection from './sections/StatsSection';
import AvailabilitySection from './sections/AvailabilitySection';
import SpecialtiesSection from './sections/SpecialtiesSection';
import BiographySection from './sections/BiographySection';
import ContactSection from './sections/ContactSection';
import LocationSection from './sections/LocationSection';
import OnlineStatusSection from './sections/OnlineStatusSection';
import ImageSection from './sections/ImageSection';

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
        <ImageSection expert={expert} updateExpert={updateExpert} />
        
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

export default ExpertCard;
