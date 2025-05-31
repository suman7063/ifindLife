
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Star, Calendar } from 'lucide-react';

interface ProgramData {
  title: string;
  description: string;
  overview: string;
  benefits: string[];
  features: string[];
  duration: string;
  format: string;
  price: string;
}

interface ProgramDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  programData: ProgramData | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  loading: boolean;
  error: string | null;
}

const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  isOpen,
  onClose,
  programData,
  activeTab,
  onTabChange,
  loading,
  error
}) => {
  if (!programData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{programData.title}</DialogTitle>
          <p className="text-gray-600">{programData.description}</p>
        </DialogHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Program Overview</h3>
                <p className="text-gray-700">{programData.overview}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{programData.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{programData.format}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 Rating</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Key Benefits</h3>
                <ul className="space-y-2">
                  {programData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Program Features</h3>
                <ul className="space-y-2">
                  {programData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-ifind-teal mb-2">{programData.price}</div>
                  <p className="text-gray-600">Duration: {programData.duration}</p>
                  <p className="text-gray-600">Format: {programData.format}</p>
                </div>
                <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                  Enroll Now
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Duration</h4>
                    <p className="text-gray-600">{programData.duration}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Format</h4>
                    <p className="text-gray-600">{programData.format}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailModal;
