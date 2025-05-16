
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Headphones, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const EnhancedHero: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();
  
  // Slider images - Using the woman image as shown in the screenshot
  const sliderImages = [
    "/lovable-uploads/2ce75196-58b1-4f39-b5cb-9b4a559c53b2.png", // Woman image
  ];

  // Service cards data with proper colors
  const serviceCards = [
    {
      title: "Speak your Heart",
      description: "We are here to listen mindfully. No judgement",
      icon: <MessageSquare className="h-6 w-6" />,
      action: () => navigate("/services/mindful-listening"),
      color: "from-ifind-teal/70 to-ifind-teal/90" // Teal color
    },
    {
      title: "Get Guidance",
      description: "Get 1 on 1 guidance from experts for your situation",
      icon: <Headphones className="h-6 w-6" />,
      action: () => navigate("/services/therapy-sessions"),
      color: "from-ifind-purple/70 to-ifind-purple/90" // Purple color
    },
    {
      title: "Take a Test",
      description: "Discover insights about your mental wellbeing through our assessment",
      icon: <BookOpen className="h-6 w-6" />,
      action: () => navigate("/mental-health-assessment"),
      color: "from-ifind-aqua/70 to-ifind-aqua/90" // Aqua color
    }
  ];

  // Service Card Component
  const ServiceCard = ({ title, description, icon, action, color }: any) => (
    <div 
      onClick={action}
      className={`cursor-pointer rounded-lg bg-gradient-to-r ${color} backdrop-blur-sm text-white shadow-lg 
                hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col`}
    >
      <div className="p-4 md:p-5 flex flex-col h-full">
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          {icon}
          <h3 className="text-base md:text-lg lg:text-xl font-bold">{title}</h3>
        </div>
        <p className="text-xs md:text-sm lg:text-base opacity-90">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="relative h-screen w-full">
      {/* Hero image - fixed to show the woman image as in screenshot */}
      <div className="relative w-full h-full overflow-hidden">
        <img 
          src={sliderImages[0]} 
          alt="Hero" 
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
          }}
          loading="eager"
        />
        
        {/* Headline - positioned correctly */}
        <div 
          className="absolute inset-0 flex flex-col justify-start items-start"
          style={{paddingTop: isMobile ? '180px' : '200px', paddingLeft: isMobile ? '24px' : '60px'}}
        >
          <h1 
            className="text-white font-bold text-left"
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: isMobile ? '58px' : '96px',
              lineHeight: isMobile ? '64px' : '108px',
              fontWeight: 700,
              color: '#FFFFFF',
              maxWidth: '540px'
            }}
          >
            You Are<br />
            Not Alone!
          </h1>
        </div>
        
        {/* Service Cards */}
        <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-0 right-0 px-4 sm:px-6 md:px-12 lg:px-[60px]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
            {serviceCards.map((card, index) => (
              <ServiceCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero;
