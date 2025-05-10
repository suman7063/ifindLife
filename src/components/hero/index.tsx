
import React, { useEffect, useState } from 'react';
import { HeroHeader } from './HeroHeader';
import { HelpSection } from './HelpSection';
import { DiscoverSection } from './DiscoverSection';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider images
  const sliderImages = [
    "/lovable-uploads/35d6ff96-c06b-4787-84bc-64318cfa9fb0.png", // First image (man)
    "/lovable-uploads/2ce75196-58b1-4f39-b5cb-9b4a559c53b2.png", // Second image (woman)
  ];

  // Auto slide rotation with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <div className="relative">
      <HeroHeader 
        images={sliderImages} 
        currentSlide={currentSlide} 
      />
      <HelpSection 
        subtitle={"Is there a situation, you need immediate help with?"}
        description={"Connect with our currently online experts through an instant call"} 
      />
      <DiscoverSection 
        videoUrl={"https://www.youtube.com/embed/0J_Vg-uWY-k?autoplay=0"} 
        isVideoLoaded={true}
        title="Take Control of Your"
        description="We know how it feels to be stuck. Don't carry that weight alone. iFindlife provides compassionate guidance, root cause healing and energy alignment, naturally. Find your inner peace, and move forward gently. Get answers when you need it the most."
        rating="4.8/5.0"
        reviews="Based on 2.5k+ Reviews"  
      />
    </div>
  );
};

export default Hero;
