
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';
import ExpertSelectionModal from '@/components/services/ExpertSelectionModal';

interface HelpSectionProps {
  subtitle: string;
  description: string;
}

export const HelpSection: React.FC<HelpSectionProps> = ({ subtitle, description }) => {
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{title: string, id?: string}>({title: ''});

  const handleSpeakYourHeart = () => {
    setSelectedService({title: 'Speak Your Heart - Express & Share', id: 'emotional-healing'});
    setIsExpertModalOpen(true);
  };

  const handleGetGuidance = () => {
    setSelectedService({title: 'Get Guidance - Life Coaching', id: 'life-coaching'});
    setIsExpertModalOpen(true);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 sm:px-12 md:px-20 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-xl font-medium text-center sm:text-left">
                {subtitle}
              </h2>
              <p className="text-sm text-gray-300 max-w-2xl">
                {description} <span className="inline-flex items-center ml-1 text-xs">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  (12 Experts currently online)
                </span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleSpeakYourHeart}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 text-white px-6 py-3 rounded-full group shadow-lg transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                <span className="font-medium">Speak Your Heart</span>
              </Button>
              <Button 
                onClick={handleGetGuidance}
                className="bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 transition-all duration-300 text-white px-6 py-3 rounded-full group shadow-lg transform hover:scale-105"
              >
                <Phone className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                <span className="font-medium">Get Guidance</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Selection Modal */}
      <ExpertSelectionModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
        serviceTitle={selectedService.title}
        serviceId={selectedService.id}
      />
    </>
  );
};
