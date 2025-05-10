
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Headphones, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Layout option constants
const LAYOUT_HORIZONTAL = 'horizontal';
const LAYOUT_GRID = 'grid';

const EnhancedHero: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentLayout, setCurrentLayout] = useState<string>(LAYOUT_HORIZONTAL);
  const isMobile = useIsMobile();
  
  // Toggle between layouts - for demo purposes
  const toggleLayout = () => {
    setCurrentLayout(prev => prev === LAYOUT_HORIZONTAL ? LAYOUT_GRID : LAYOUT_HORIZONTAL);
  };

  // Slider images
  const sliderImages = [
    "/lovable-uploads/35d6ff96-c06b-4787-84bc-64318cfa9fb0.png", // First image (man)
    "/lovable-uploads/2ce75196-58b1-4f39-b5cb-9b4a559c53b2.png", // Second image (woman)
  ];

  // Service cards data
  const serviceCards = [
    {
      title: "Speak your Heart",
      description: "We are here to listen mindfully. No judgement",
      icon: <MessageSquare className="h-6 w-6" />,
      action: () => navigate("/services/speak"),
      color: "from-ifind-aqua/70 to-ifind-aqua/90"
    },
    {
      title: "Get Guidance",
      description: "Get 1 on 1 guidance from experts for your situation",
      icon: <Headphones className="h-6 w-6" />,
      action: () => navigate("/experts"),
      color: "from-ifind-purple/70 to-ifind-purple/90"
    },
    {
      title: "Take a Test",
      description: "Discover insights about your mental wellbeing through our assessment",
      icon: <BookOpen className="h-6 w-6" />,
      action: () => navigate("/mental-health-assessment"),
      color: "from-ifind-teal/70 to-ifind-teal/90"
    }
  ];

  // Auto slide rotation with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [sliderImages.length]);

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

  // Layout Option 1: Horizontal Cards Below Headline
  const HorizontalLayout = () => (
    <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-0 right-0 px-4 sm:px-6 md:px-12 lg:px-[60px]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        {serviceCards.map((card, index) => (
          <ServiceCard key={index} {...card} />
        ))}
      </div>
    </div>
  );

  // Layout Option 2: Feature Grid with Large Center Button
  const GridLayout = () => (
    <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-0 right-0 px-4 sm:px-6 md:px-12 lg:px-[60px]">
      <div className="grid grid-cols-1 gap-3 md:gap-5">
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          <ServiceCard {...serviceCards[0]} />
          <ServiceCard {...serviceCards[1]} />
        </div>
        <div className="mx-auto w-full md:w-2/3">
          <ServiceCard {...serviceCards[2]} 
            color="from-ifind-teal/80 to-ifind-teal/95"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-[100vh]">
      {/* Hero image/slider */}
      <div className="relative w-full h-full overflow-hidden">
        {sliderImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={currentSlide !== index}
          >
            <img 
              src={image} 
              alt={`Slide ${index + 1}`} 
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
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Add a semi-transparent overlay to improve text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20"></div>
          </div>
        ))}
        
        {/* Headline - Moved down by 100px */}
        <div 
          className={`absolute inset-0 flex flex-col justify-start ${isMobile ? 'pt-[180px]' : 'pt-[220px]'} px-6 sm:px-12 lg:px-[60px]`}
        >
          <h1 
            className="text-white font-bold"
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: isMobile ? '48px' : '80px',
              lineHeight: isMobile ? '54px' : '90px',
              fontWeight: 700,
              color: '#FFFFFF',
              maxWidth: '540px'
            }}
          >
            You Are<br />
            Not Alone!
          </h1>
        </div>
        
        {/* Service Cards - conditionally render based on selected layout */}
        {currentLayout === LAYOUT_HORIZONTAL ? <HorizontalLayout /> : <GridLayout />}
        
        {/* Layout toggle button - for demo purposes */}
        <div className="absolute top-4 right-4">
          <Button 
            variant="outline" 
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            onClick={toggleLayout}
          >
            Toggle Layout: {currentLayout === LAYOUT_HORIZONTAL ? 'Horizontal' : 'Grid'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero;
