
import React from 'react';
import { Check, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

interface ServiceAboutProps {
  title: string;
  icon: React.ReactNode;
  textColor: string;
  color: string;
  gradientColor: string;
  detailedDescription: string;
  benefits: string[];
  duration: string;
  process: string;
}

const ServiceAbout: React.FC<ServiceAboutProps> = ({
  title,
  icon,
  textColor,
  color,
  gradientColor,
  detailedDescription,
  benefits,
  duration,
  process
}) => {
  return (
    <Card className={`border-l-4 ${color} shadow-lg overflow-hidden mb-8`}>
      <div className="bg-gray-50 dark:bg-gray-900 p-8">
        <div className={`inline-flex items-center justify-center ${color} text-white p-4 rounded-full mb-4`}>
          {icon}
        </div>
        <CardTitle className={`text-3xl ${textColor} mb-2`}>About {title}</CardTitle>
        <CardDescription className="text-lg">Comprehensive support for your mental wellness journey</CardDescription>
      </div>
      <CardContent className="space-y-8 p-8">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {detailedDescription}
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className={`text-xl font-semibold mb-6 flex items-center ${textColor}`}>
            <Check className="h-6 w-6 mr-2" /> Key Benefits
          </h3>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className={`inline-flex items-center justify-center p-1 ${textColor} mr-3 mt-1`}>
                  <Check className="h-5 w-5" />
                </span>
                <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`border-l-4 ${color} bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm`}>
            <h3 className={`text-xl font-semibold mb-3 flex items-center ${textColor}`}>
              <Clock className="h-6 w-6 mr-2" /> Duration
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300">{duration}</p>
          </div>
          
          <div className={`border-l-4 ${color} bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm`}>
            <h3 className={`text-xl font-semibold mb-3 flex items-center ${textColor}`}>
              <Calendar className="h-6 w-6 mr-2" /> Process
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300">{process}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceAbout;
