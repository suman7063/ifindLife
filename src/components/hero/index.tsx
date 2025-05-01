
import React, { useEffect, useState } from 'react';
import { HeroHeader } from './HeroHeader';
import { HelpSection } from './HelpSection';
import { DiscoverSection } from './DiscoverSection';
import { initialHeroSettings } from '@/data/initialAdminData';
import { sanitizeVideoUrl } from '@/components/admin/hooks/utils/dataLoaders';
import { toast } from 'sonner';

const Hero = () => {
  const [heroSettings, setHeroSettings] = useState({
    title: initialHeroSettings.title,
    subtitle: initialHeroSettings.subtitle,
    description: initialHeroSettings.description,
    videoUrl: initialHeroSettings.videoUrl
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
          // Sanitize the video URL to prevent inappropriate content
          const safeVideoUrl = sanitizeVideoUrl(parsedContent.heroSettings.videoUrl || initialHeroSettings.videoUrl);
          
          setHeroSettings({
            title: parsedContent.heroSettings.title || initialHeroSettings.title,
            subtitle: parsedContent.heroSettings.subtitle || initialHeroSettings.subtitle,
            description: parsedContent.heroSettings.description || initialHeroSettings.description,
            videoUrl: safeVideoUrl
          });
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
      // Fallback to correct default content in case of error
      setHeroSettings({
        title: initialHeroSettings.title,
        subtitle: initialHeroSettings.subtitle,
        description: initialHeroSettings.description,
        videoUrl: initialHeroSettings.videoUrl
      });
      toast.error('Error loading hero content. Using default settings.');
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
        subtitle={"Is there a situation, you need immediate help with?"}
        description={"Connect with our currently online experts through an instant call"} 
      />
      <DiscoverSection 
        videoUrl={heroSettings.videoUrl} 
        isVideoLoaded={isVideoLoaded}
        title={heroSettings.title}
        description={heroSettings.description}
        rating="4.8/5.0"
        reviews="Based on 2.5k+ Reviews"  
      />
    </div>
  );
};

export default Hero;
