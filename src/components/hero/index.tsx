
import React, { useEffect, useState } from 'react';
import { HeroHeader } from './HeroHeader';
import { HelpSection } from './HelpSection';
import { DiscoverSection } from './DiscoverSection';

const Hero = () => {
  const [heroSettings, setHeroSettings] = useState({
    title: "You Are Not Alone!",
    subtitle: "Is there a situation, you need immediate help with?",
    description: "Connect with our currently online experts through an instant call",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0" // Disable autoplay initially
  });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider images - update with just two images and remove the third one
  const sliderImages = [
    "/lovable-uploads/35d6ff96-c06b-4787-84bc-64318cfa9fb0.png", // First image (man)
    "/lovable-uploads/2ce75196-58b1-4f39-b5cb-9b4a559c53b2.png", // Second image (woman)
  ];

  // Load content from localStorage on component mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.heroSettings) {
          // Ensure autoplay is disabled
          let videoUrl = parsedContent.heroSettings.videoUrl || heroSettings.videoUrl;
          if (videoUrl) {
            // Remove autoplay parameter if present
            videoUrl = videoUrl.replace(/([?&])autoplay=1/g, '$1autoplay=0');
            
            // If no autoplay parameter exists, add it with value 0
            if (!videoUrl.includes('autoplay=')) {
              videoUrl = videoUrl.includes('?') 
                ? `${videoUrl}&autoplay=0` 
                : `${videoUrl}?autoplay=0`;
            }
          }
          
          setHeroSettings({
            ...parsedContent.heroSettings,
            title: "You Are Not Alone!", // Override title with the new text
            subtitle: "Is there a situation, you need immediate help with?", // Update the subtitle
            description: "Connect with our currently online experts through an instant call", // Add description
            videoUrl
          });
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, []);

  // Effect to manage video loading state
  useEffect(() => {
    if (heroSettings.videoUrl && !isVideoLoaded) {
      setIsVideoLoaded(true);
    }
  }, [heroSettings.videoUrl, isVideoLoaded]);

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
        subtitle={heroSettings.subtitle} 
        description={heroSettings.description} 
      />
      <DiscoverSection 
        videoUrl={heroSettings.videoUrl} 
        isVideoLoaded={isVideoLoaded} 
      />
    </div>
  );
};

export default Hero;
