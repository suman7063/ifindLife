
import React from 'react';
import { Button } from '@/components/ui/button';
import ServiceAbout from './ServiceAbout';
import ServiceFAQ from './ServiceFAQ';
import ServiceCTA from './ServiceCTA';
import RelatedServices from './RelatedServices';
import ServiceTestimonial from './ServiceTestimonial';

interface ServiceDetailContentProps {
  serviceId: string;
  serviceData: any;
  dialogTriggerElement: React.ReactNode;
  onBookNowClick: () => void;
}

const ServiceDetailContent: React.FC<ServiceDetailContentProps> = ({
  serviceId,
  serviceData,
  dialogTriggerElement,
  onBookNowClick
}) => {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-12">
      <div className="md:col-span-2">
        {/* About Service */}
        <ServiceAbout 
          title={serviceData.title}
          icon={serviceData.icon}
          textColor={serviceData.textColor}
          color={serviceData.color}
          gradientColor={serviceData.gradientColor}
          detailedDescription={serviceData.detailedDescription}
          benefits={serviceData.benefits}
          duration={serviceData.duration}
          process={serviceData.process}
        />
        
        {/* FAQ Section */}
        <ServiceFAQ color={serviceData.color} />
      </div>
      
      <div className="space-y-8">
        {/* Call to Action */}
        <ServiceCTA 
          title={serviceData.title}
          color={serviceData.color}
          textColor={serviceData.textColor}
          buttonColor={serviceData.buttonColor}
          gradientColor={serviceData.gradientColor}
          dialogTriggerElement={dialogTriggerElement}
          onBookNowClick={onBookNowClick}
        />
        
        {/* Related Services */}
        <RelatedServices 
          currentServiceId={serviceId}
          color={serviceData.color}
          relatedServices={serviceData}
        />
        
        {/* Testimonial */}
        <ServiceTestimonial serviceId={serviceId} />
      </div>
    </div>
  );
};

export default ServiceDetailContent;
