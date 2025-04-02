
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ServiceFAQProps {
  color: string;
}

const ServiceFAQ: React.FC<ServiceFAQProps> = ({ color }) => {
  return (
    <Card className="bg-gray-50 dark:bg-gray-800/50 overflow-hidden rounded-xl mt-12">
      <div className={`${color} h-2 w-full`}></div>
      <CardHeader>
        <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <div>
          <h4 className="font-medium text-lg mb-2">How do I prepare for my first session?</h4>
          <p className="text-gray-600 dark:text-gray-400">Come as you are! There's no special preparation needed. You might want to take a few minutes before your session to reflect on what you hope to gain from the experience.</p>
        </div>
        <Separator className="my-2" />
        <div>
          <h4 className="font-medium text-lg mb-2">Are these services covered by insurance?</h4>
          <p className="text-gray-600 dark:text-gray-400">Some of our services may be covered by insurance. Please contact your insurance provider to verify coverage and contact us for assistance with paperwork.</p>
        </div>
        <Separator className="my-2" />
        <div>
          <h4 className="font-medium text-lg mb-2">How many sessions will I need?</h4>
          <p className="text-gray-600 dark:text-gray-400">This varies greatly depending on individual needs and goals. Some people benefit from just a few sessions, while others prefer ongoing support. We'll discuss recommendations during your initial session.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceFAQ;
