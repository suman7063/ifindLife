
import React from 'react';
import { Check, Clock, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

interface ServiceAboutProps {
  title: string;
  icon: React.ComponentType<any>;
  textColor: string;
  color: string;
  gradientColor: string;
  detailedDescription?: string;
  benefits: string[]; // Always provided (default if not in database)
  duration?: string; // Formatted duration info (only for retreats) - deprecated
  process: string; // Always provided (default if not in database)
  serviceType?: string | null; // Service type to determine if Duration box should show
  retreatInfo?: {
    duration: string;
    rates: string | null;
    location: string | null;
  }; // Structured retreat info for better display
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
  process,
  serviceType,
  retreatInfo
}) => {
  const IconComponent = icon;
  
  // Use hex colors directly with inline styles
  const borderColor = color || '#5AC8FA';
  const textColorValue = textColor || color || '#5AC8FA';
  
  return (
    <Card className="shadow-lg overflow-hidden mb-8" style={{ borderLeft: `4px solid ${borderColor}` }}>
      <div className="bg-gray-50 dark:bg-gray-900 p-8">
        <div 
          className="inline-flex items-center justify-center text-white p-4 rounded-full mb-4"
          style={{ backgroundColor: borderColor }}
        >
          <IconComponent className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl mb-2" style={{ color: textColorValue }}>About {title}</CardTitle>
        <CardDescription className="text-lg">Comprehensive support for your mental wellness journey</CardDescription>
      </div>
      <CardContent className="space-y-8 p-8 bg-gray-50 dark:bg-gray-900">
        {detailedDescription && (
          <div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {detailedDescription}
            </p>
          </div>
        )}
        
        {/* Benefits - Always shown (default provided if not in database) */}
        {benefits.length > 0 && (
          <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center" style={{ color: textColorValue }}>
              <Check className="h-6 w-6 mr-2" /> Key Benefits
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span 
                    className="inline-flex items-center justify-center p-1 mr-3 mt-1"
                    style={{ color: textColorValue }}
                  >
                    <Check className="h-5 w-5" />
                  </span>
                  <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Duration and Process - Always side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Retreat Details box - Only show for retreats */}
          {serviceType === 'retreat' && retreatInfo && (
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: textColorValue }}>
                <Calendar className="h-6 w-6 mr-2" /> Retreat Details
              </h3>
              <div className="space-y-4">
                {/* Duration value */}
                {retreatInfo.duration && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 mt-0.5" style={{ color: textColorValue }} />
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {retreatInfo.duration}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Rates */}
                {retreatInfo.rates && (
                  <div className="flex items-start gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <DollarSign className="h-5 w-5 mt-0.5" style={{ color: textColorValue }} />
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rates</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {retreatInfo.rates}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Location */}
                {retreatInfo.location && (
                  <div className="flex items-start gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <MapPin className="h-5 w-5 mt-0.5" style={{ color: textColorValue }} />
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {retreatInfo.location}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Process - Always shown (default provided if not in database) */}
          <div className={`p-6 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${serviceType !== 'retreat' || !retreatInfo ? 'md:col-span-2' : ''}`}>
            <h3 className="text-xl font-semibold mb-3 flex items-center" style={{ color: textColorValue }}>
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
