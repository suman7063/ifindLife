
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ServiceCTAProps {
  title: string;
  color: string;
  textColor: string;
  buttonColor: string;
  gradientColor: string;
  dialogTriggerElement: React.ReactNode;
  onBookNowClick: () => void;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({
  title,
  color,
  textColor,
  buttonColor,
  gradientColor,
  dialogTriggerElement,
  onBookNowClick
}) => {
  return (
    <Card className={`border ${color.replace('bg-', 'border-')} shadow-lg overflow-hidden`}>
      <div className={`${color} h-2 w-full`}></div>
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-t-lg">
        <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Ready to Begin Your Journey?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Take the first step toward positive change. Our experts are ready to support you on your journey to improved mental wellness.
        </p>
        
        <div className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              {dialogTriggerElement}
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Inquiry Form</DialogTitle>
              <DialogDescription>
                Please fill out this form to learn more about our services.
              </DialogDescription>
              <p>This dialog content is provided by the parent component.</p>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className={`w-full ${textColor} border-${color.replace('bg-', '')} hover:${color.replace('bg-', 'bg-')}/10`} 
            onClick={onBookNowClick}
          >
            <Calendar className="mr-2 h-4 w-4" /> Book Now
          </Button>
        </div>
      </div>
      
      <div className="px-6 pb-6 pt-3 bg-gray-50 dark:bg-gray-900">
        <Separator className="my-6" />
        
        <div className="text-sm space-y-4">
          <div className="flex items-center">
            <Badge variant="outline" className={`${textColor} px-3 py-1 text-sm`}>Popular</Badge>
            <span className="ml-2 text-gray-500">High demand service</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-500">1000+ clients helped</span>
          </div>
          
          <div className="mt-4">
            <p className="font-medium">Still have questions?</p>
            <p>Contact us at <a href="mailto:support@ifindlife.com" className={`${textColor} hover:underline`}>support@ifindlife.com</a></p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCTA;
