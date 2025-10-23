import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  rate_usd: number;
  rate_inr: number;
  duration: number;
}

// Mock expert data - in real app, this would come from auth context
const mockExpertAccount = {
  id: '123',
  category: 'listening-expert',
  name: 'Dr. Sarah Johnson'
};

// Mock services based on category
const mockServices: Record<string, Service[]> = {
  'listening-volunteer': [
    { id: 1, name: 'Active Listening Session', description: 'Provide compassionate listening and emotional support', category: 'listening', rate_usd: 20, rate_inr: 1500, duration: 30 },
    { id: 2, name: 'Peer Support Call', description: 'One-on-one supportive conversation', category: 'listening', rate_usd: 25, rate_inr: 2000, duration: 45 }
  ],
  'listening-expert': [
    { id: 1, name: 'Active Listening Session', description: 'Provide compassionate listening and emotional support', category: 'listening', rate_usd: 40, rate_inr: 3000, duration: 30 },
    { id: 2, name: 'Peer Support Call', description: 'One-on-one supportive conversation', category: 'listening', rate_usd: 50, rate_inr: 4000, duration: 45 },
    { id: 3, name: 'Crisis Support', description: 'Immediate emotional support during difficult times', category: 'listening', rate_usd: 60, rate_inr: 4500, duration: 60 },
    { id: 4, name: 'Wellness Check-in', description: 'Regular mental wellness conversations', category: 'listening', rate_usd: 35, rate_inr: 2500, duration: 30 }
  ],
  'mindfulness-coach': [
    { id: 5, name: 'Guided Meditation', description: 'Lead mindfulness meditation sessions', category: 'mindfulness', rate_usd: 45, rate_inr: 3500, duration: 30 },
    { id: 6, name: 'Stress Management', description: 'Techniques for managing stress and anxiety', category: 'mindfulness', rate_usd: 55, rate_inr: 4000, duration: 45 },
    { id: 7, name: 'Breathwork Session', description: 'Breathing exercises for calm and focus', category: 'mindfulness', rate_usd: 40, rate_inr: 3000, duration: 30 }
  ],
  'mindfulness-expert': [
    { id: 6, name: 'Advanced Meditation', description: 'Deep meditation and mindfulness practice', category: 'mindfulness', rate_usd: 70, rate_inr: 5500, duration: 60 },
    { id: 7, name: 'Mindfulness Coaching', description: 'Personal mindfulness development program', category: 'mindfulness', rate_usd: 80, rate_inr: 6000, duration: 60 },
    { id: 8, name: 'Stress Reduction Program', description: 'Comprehensive stress management techniques', category: 'mindfulness', rate_usd: 65, rate_inr: 5000, duration: 45 }
  ],
  'spiritual-mentor': [
    { id: 9, name: 'Spiritual Guidance', description: 'Personal spiritual counseling and growth', category: 'spiritual', rate_usd: 75, rate_inr: 6000, duration: 60 },
    { id: 10, name: 'Life Purpose Exploration', description: 'Discover your path and purpose', category: 'spiritual', rate_usd: 85, rate_inr: 6500, duration: 60 }
  ]
};

export const ExpertServiceSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Simulate fetching services based on expert category
    setTimeout(() => {
      const services = mockServices[mockExpertAccount.category] || [];
      setAvailableServices(services);
      setLoading(false);
    }, 500);
  }, []);

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSaveServices = async () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    setSaving(true);
    
    // Mock save - simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success('Services saved successfully! You are now visible to users.');
      setTimeout(() => {
        navigate('/mobile-app/expert-app/dashboard');
      }, 1500);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-ifind-teal to-ifind-aqua rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
          Welcome, {mockExpertAccount.name}!
        </h1>
        <p className="text-muted-foreground mb-1">
          Select the services you want to offer
        </p>
        <Badge variant="outline" className="mt-2">
          {mockExpertAccount.category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </Badge>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 pb-32">
          <div className="space-y-3">
            {availableServices.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'ring-2 ring-primary bg-ifind-teal/5' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {isSelected ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{service.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="bg-secondary px-2 py-1 rounded">
                            {service.duration} min
                          </span>
                          <span className="bg-secondary px-2 py-1 rounded">
                            ₹{service.rate_inr}
                          </span>
                          <span className="bg-secondary px-2 py-1 rounded">
                            ${service.rate_usd}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <p className="text-sm text-center text-muted-foreground mb-3">
            Selected {selectedServices.length} of {availableServices.length} services
          </p>
          <Button 
            onClick={handleSaveServices}
            disabled={selectedServices.length === 0 || saving}
            className="w-full bg-gradient-to-r from-ifind-teal to-ifind-aqua hover:from-ifind-teal/90 hover:to-ifind-aqua/90"
          >
            {saving ? 'Saving...' : 'Continue to Dashboard'}
          </Button>
        </div>
      </div>
    </div>
  );
};
