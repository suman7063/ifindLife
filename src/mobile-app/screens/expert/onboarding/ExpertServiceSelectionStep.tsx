import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface ExpertServiceSelectionStepProps {
  onNext: () => void;
}

export const ExpertServiceSelectionStep: React.FC<ExpertServiceSelectionStepProps> = ({
  onNext
}) => {
  // Mock expert data
  const mockExpert = {
    name: 'Dr. Sarah Johnson',
    category: 'Psychologist'
  };

  // Mock services based on expert category
  const mockServices: Service[] = [
    {
      id: 1,
      name: 'Individual Therapy',
      description: 'One-on-one counseling sessions',
      category: 'Psychologist'
    },
    {
      id: 2,
      name: 'Couples Therapy',
      description: 'Relationship counseling for couples',
      category: 'Psychologist'
    },
    {
      id: 3,
      name: 'Family Therapy',
      description: 'Family dynamics and conflict resolution',
      category: 'Psychologist'
    },
    {
      id: 4,
      name: 'Cognitive Behavioral Therapy',
      description: 'CBT techniques for anxiety and depression',
      category: 'Psychologist'
    },
    {
      id: 5,
      name: 'Stress Management',
      description: 'Techniques to manage stress and anxiety',
      category: 'Psychologist'
    }
  ];

  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleContinue = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }
    toast.success(`${selectedServices.length} service(s) selected`);
    onNext();
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Select Your Services
        </h1>
        <p className="text-muted-foreground">
          Choose the services you'll offer to clients. You can update these later.
        </p>
        <div className="flex items-center gap-2 pt-2">
          <div className="text-sm font-medium text-primary">
            Category: {mockExpert.category}
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {mockServices.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <Card
              key={service.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleService(service.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground/30'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {selectedServices.length} service(s) selected
          </span>
        </div>
        <Button
          onClick={handleContinue}
          disabled={selectedServices.length === 0}
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
