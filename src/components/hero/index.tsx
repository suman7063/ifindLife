import React, { useEffect, useState } from 'react';
import { HeroHeader } from './HeroHeader';
import { HelpSection } from './HelpSection';
import { DiscoverSection } from './DiscoverSection';

const Hero = () => {
  const [heroSettings, setHeroSettings] = useState({
    title: "Take Control of Your Mental Health Journey",
    subtitle: "Mental Health Journey",
    description: "We know how it feels to be stuck. Don't carry that weight alone. iFindlife provides compassionate guidance and natural energy alignment, avoiding pills. Find your inner peace, and move forward gently. Get answers when you need it the most.",
    videoUrl: "https://www.youtube.com/embed/0J_Vg-uWY-k?autoplay=0" // Professional mental health video
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
          // Ensure we're using the correct video and content
          let videoUrl = "https://www.youtube.com/embed/0J_Vg-uWY-k?autoplay=0"; // Default to professional mental health video
          
          // Remove any potential Rick Astley video if it exists
          const isRickRoll = parsedContent.heroSettings.videoUrl && 
            (parsedContent.heroSettings.videoUrl.includes("dQw4w9WgXcQ") || 
             parsedContent.heroSettings.videoUrl.toLowerCase().includes("rick") ||
             parsedContent.heroSettings.videoUrl.toLowerCase().includes("astley"));
          
          if (!isRickRoll && parsedContent.heroSettings.videoUrl) {
            videoUrl = parsedContent.heroSettings.videoUrl.replace(/([?&])autoplay=1/g, '$1autoplay=0');
            
            if (!videoUrl.includes('autoplay=')) {
              videoUrl = videoUrl.includes('?') 
                ? `${videoUrl}&autoplay=0` 
                : `${videoUrl}?autoplay=0`;
            }
          }
          
          setHeroSettings({
            title: "Take Control of Your Mental Health Journey", // Restore correct title
            subtitle: "Mental Health Journey", // Restore correct subtitle
            description: "We know how it feels to be stuck. Don't carry that weight alone. iFindlife provides compassionate guidance and natural energy alignment, avoiding pills. Find your inner peace, and move forward gently. Get answers when you need it the most.",
            videoUrl
          });
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
      // Fallback to correct default content in case of error
      setHeroSettings({
        title: "Take Control of Your Mental Health Journey",
        subtitle: "Mental Health Journey", 
        description: "We know how it feels to be stuck. Don't carry that weight alone. iFindlife provides compassionate guidance and natural energy alignment, avoiding pills. Find your inner peace, and move forward gently. Get answers when you need it the most.",
        videoUrl: "https://www.youtube.com/embed/0J_Vg-uWY-k?autoplay=0"
      });
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
        title="Take Control of Your Mental Health Journey"
        description="We know how it feels to be stuck. Don't carry that weight alone. iFindlife provides compassionate guidance and natural energy alignment, avoiding pills. Find your inner peace, and move forward gently. Get answers when you need it the most."
        rating="4.8/5.0"
        reviews="Based on 2.5k+ Reviews"  
      />
    </div>
  );
};

export default Hero;
