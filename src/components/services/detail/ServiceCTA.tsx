
import React from 'react';
import { Button } from '@/components/ui/button';

interface ServiceCTAProps {
  title: string;
  color: string;
  textColor: string;
  buttonColor: string;
  gradientColor: string;
  onBookNowClick: () => void;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({
  title,
  color,
  textColor,
  buttonColor,
  gradientColor,
  onBookNowClick
}) => {
  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${gradientColor}`}>
      <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>
        Ready to experience {title}?
      </h3>
      <p className="text-gray-700 mb-6">
        Schedule your session now and take the first step toward greater well-being.
      </p>
      <Button
        className={`w-full ${buttonColor} text-white py-2 px-4 rounded-md`}
        onClick={onBookNowClick}
      >
        Book Now
      </Button>
    </div>
  );
};

export default ServiceCTA;
