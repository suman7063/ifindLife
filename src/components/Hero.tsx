
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import FreeAssessmentCTA from './FreeAssessmentCTA';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
          // Don't enable autoplay immediately - wait until user interaction or after page load
          let videoUrl = parsedContent.heroSettings.videoUrl || heroSettings.videoUrl;
          if (videoUrl) {
            // Start without autoplay for faster initial load
            videoUrl = videoUrl.includes('?') 
              ? videoUrl.split('?')[0] + '?autoplay=0' 
              : videoUrl + '?autoplay=0';
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

  // Enable video autoplay after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (heroSettings.videoUrl && !isVideoLoaded) {
        const newVideoUrl = heroSettings.videoUrl.replace('autoplay=0', 'autoplay=1');
        setHeroSettings(prev => ({ ...prev, videoUrl: newVideoUrl }));
        setIsVideoLoaded(true);
      }
    }, 3000); // 3 second delay before loading video with autoplay

    return () => clearTimeout(timer);
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
      {/* Banner Image Section with slider - updated height to 530px */}
      <div className="relative w-full h-[530px] overflow-hidden">
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
              className="w-full h-full object-cover transform scale-70 object-top" // Reduced scale to 70% (10% reduction from 80%)
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '530px', // Updated to 530px
                borderRadius: '0px'
              }}
              loading={index === 0 ? "eager" : "lazy"} // Prioritize first image
            />
          </div>
        ))}
        
        <div 
          className="absolute inset-0 flex flex-col justify-center px-[60px]"
          style={{
            width: '100%',
            height: '100%'
          }}
        >
          <h1 
            className="text-white font-bold"
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: '96px', // Increase font size proportionally
              lineHeight: '115px',
              fontWeight: 700,
              color: '#FFFFFF',
              maxWidth: '540px'
            }}
          >
            You Are<br />
            Not Alone!
          </h1>
        </div>
      </div>
      
      {/* Help Section - optimized layout */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 sm:px-12 md:px-20 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-xl font-medium text-center sm:text-left">
                {heroSettings.subtitle}
              </h2>
              <p className="text-sm text-gray-300 max-w-2xl">
                {heroSettings.description} <span className="inline-flex items-center ml-1 text-xs">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  (12 Experts currently online)
                </span>
              </p>
            </div>
            <div className="flex-shrink-0">
              <FreeAssessmentCTA />
            </div>
          </div>
        </div>
      </div>
      
      {/* Discover Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Take Control of Your <br />
                <span className="text-ifind-aqua">Mental Health Journey</span>
              </h2>
              <p className="text-gray-700 mb-6">
                We know how it feels to be stuck. Don't carry that weight alone. iFindlife provides compassionate guidance and natural energy alignment, avoiding pills. Find your inner peace, and move forward gently. Get answers when you need it the most.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <span className="font-bold mr-1">4.8/5.0</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <svg key={index} className="w-4 h-4 text-ifind-teal fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span>•</span>
                <span>Based on 2.5k+ Reviews</span>
              </div>
              <Link to="/mental-health-assessment">
                <Button className="bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white hover:opacity-90 transition-opacity">
                  Take Free Mental Health Assessment
                </Button>
              </Link>
            </div>
            <div className="relative rounded-lg overflow-hidden">
              {!isVideoLoaded ? (
                // Display placeholder before video is loaded
                <div className="w-full aspect-video rounded-lg bg-gray-200 shadow-lg flex items-center justify-center">
                  <span className="text-gray-500">Video loading...</span>
                </div>
              ) : (
                heroSettings.videoUrl ? (
                  <iframe
                    src={heroSettings.videoUrl}
                    className="w-full aspect-video rounded-lg shadow-lg"
                    title="Mental Health Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1569437061238-3cf61084f487?q=80&w=2070&auto=format&fit=crop" 
                    alt="Mental Health Expert" 
                    className="w-full h-auto rounded-lg shadow-lg"
                    loading="lazy"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
