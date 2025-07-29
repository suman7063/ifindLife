
import React from 'react';
import { Button } from '@/components/ui/button';
import ServiceAbout from './ServiceAbout';
import ServiceFAQ from './ServiceFAQ';
import ServiceCTA from './ServiceCTA';
import RelatedServices from './RelatedServices';
import ServiceTestimonial from './ServiceTestimonial';
import ServiceExperts from './ServiceExperts';

interface ServiceDetailContentProps {
  serviceId: string;
  serviceData: any;
  onBookNowClick: () => void;
}

const ServiceDetailContent: React.FC<ServiceDetailContentProps> = ({
  serviceId,
  serviceData,
  onBookNowClick
}) => {
  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-8">
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
            onBookNowClick={onBookNowClick}
          />
          
          {/* Service Experts Section */}
          <ServiceExperts 
            serviceId={serviceId}
            serviceData={serviceData}
          />
          
          {/* Testimonial */}
          <ServiceTestimonial serviceId={serviceId} />
        </div>
      </div>
      
      {/* Related Services - Horizontal at bottom */}
      <div className="border-t border-gray-200 pt-12">
        <RelatedServices 
          currentServiceId={serviceId}
          color={serviceData.color}
          relatedServices={serviceData}
        />
      </div>
    </div>
  );
};

export default ServiceDetailContent;
