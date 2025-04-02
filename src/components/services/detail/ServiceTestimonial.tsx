
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceTestimonialProps {
  serviceId: string;
}

type TestimonialData = {
  [key: string]: {
    text: string;
    name: string;
    since: string;
  };
};

const testimonials: TestimonialData = {
  "therapy-sessions": {
    text: "The therapy sessions have been transformative for me. My therapist really listens and provides practical strategies that have helped me manage my anxiety in ways I never thought possible.",
    name: "Emily R.",
    since: "2021"
  },
  "guided-meditations": {
    text: "These guided meditations have completely changed my approach to stress management. The instructor's calming voice and thoughtful guidance help me find inner peace even on my most chaotic days.",
    name: "Michael T.",
    since: "2022"
  },
  "mindful-listening": {
    text: "The mindful listening service gave me something I didn't know I needed - the space to truly express myself without judgment. It's been crucial for processing my thoughts during a difficult transition.",
    name: "Sophia K.",
    since: "2023"
  },
  "offline-retreats": {
    text: "Disconnecting at the offline retreat was exactly what I needed. The balance of structured activities and free time in nature helped me reset my relationship with technology and reconnect with myself.",
    name: "James L.",
    since: "2022"
  },
  "life-coaching": {
    text: "My life coach helped me clarify my goals and create actionable steps toward achieving them. The accountability and support have been invaluable in helping me make the career change I've wanted for years.",
    name: "Olivia W.",
    since: "2023"
  }
};

const ServiceTestimonial: React.FC<ServiceTestimonialProps> = ({ serviceId }) => {
  const testimonial = testimonials[serviceId] || {
    text: "This service completely transformed my approach to mental wellness. The personalized attention and expert guidance made all the difference.",
    name: "Sarah J.",
    since: "2022"
  };

  return (
    <Card className="border border-gray-200 bg-gray-50 dark:bg-gray-800/30">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 text-gray-300 absolute -top-6 -left-6 z-0"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <p className="text-lg italic text-gray-700 dark:text-gray-300 relative z-10">
              "{testimonial.text}"
            </p>
          </div>
          <div className="mt-4">
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">Client since {testimonial.since}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceTestimonial;
