import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Video, MessageCircle, Calendar, Shield } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Live Video Sessions',
    description: 'Connect face-to-face with certified experts in real-time',
    color: 'text-ifind-aqua bg-ifind-aqua/10'
  },
  {
    icon: MessageCircle,
    title: 'Secure Chat Support',
    description: 'Get support through encrypted messaging anytime',
    color: 'text-ifind-teal bg-ifind-teal/10'
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Book sessions that fit your schedule, 24/7 availability',
    color: 'text-ifind-purple bg-ifind-purple/10'
  },
  {
    icon: Shield,
    title: 'Complete Privacy',
    description: 'Your conversations are completely confidential and secure',
    color: 'text-ifind-charcoal bg-ifind-charcoal/10'
  }
];

export const OnboardingFeatures: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-background p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-2 p-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-poppins font-semibold">App Features</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-4">
            Everything you need for your wellness journey
          </h2>
          <p className="text-muted-foreground">
            Powerful features designed to support your mental health
          </p>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 p-4 rounded-xl bg-white border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-poppins font-semibold text-ifind-charcoal mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <Button 
          onClick={() => navigate('/mobile-app/onboarding/complete')}
          className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 text-white py-6"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};