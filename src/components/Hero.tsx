
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import FreeAssessmentCTA from './FreeAssessmentCTA';

const Hero = () => {
  const [heroSettings, setHeroSettings] = useState({
    title: "Mental Health Solutions that Work",
    subtitle: "Is there a situation you want immediate help with?",
    description: "Expert guidance from licensed therapists available 24/7",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" // Default video URL with autoplay
  });

  // Load content from localStorage on component mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.heroSettings) {
          // Ensure the autoplay parameter is added to the video URL if not already present
          let videoUrl = parsedContent.heroSettings.videoUrl || heroSettings.videoUrl;
          if (videoUrl && !videoUrl.includes('autoplay=1')) {
            videoUrl = videoUrl.includes('?') 
              ? `${videoUrl}&autoplay=1` 
              : `${videoUrl}?autoplay=1`;
          }
          
          setHeroSettings({
            ...parsedContent.heroSettings,
            videoUrl
          });
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, []);

  return (
    <div className="relative">
      {/* Banner Image Section */}
      <div className="relative w-full h-[400px] bg-gradient-to-r from-gray-900 to-gray-800">
        <img 
          src="public/lovable-uploads/6fdf43ed-732a-4659-a397-a7d061440bc2.png" 
          alt="Woman with sunglasses" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
            {heroSettings.title}
          </h1>
          <p className="text-white text-xl max-w-xl">
            {heroSettings.description}
          </p>
        </div>
      </div>
      
      {/* Help Section */}
      <div className="bg-gray-800 text-white py-6 px-6 sm:px-12 md:px-20">
        <div className="container mx-auto">
          <h2 className="text-lg font-medium mb-2">
            {heroSettings.subtitle}
          </h2>
          <div className="flex flex-wrap gap-4">
            <FreeAssessmentCTA />
            <Button className="bg-white text-gray-800 hover:bg-gray-100">
              Book a Session
            </Button>
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
                <span className="text-ifind-aqua">Mental Health</span> <br />
                <span className="text-ifind-aqua">Journey</span>
              </h2>
              <p className="text-gray-700 mb-6">
                Connect with qualified mental health professionals who offer insightful guidance to address your emotional wellbeing, relationships, and personal growth. Get answers when you need it the most.
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
              <Button className="bg-ifind-purple hover:bg-ifind-purple/90 text-white">
                Take Free Mental Health Assessment
              </Button>
            </div>
            <div className="relative rounded-lg overflow-hidden">
              {heroSettings.videoUrl ? (
                <iframe
                  src={heroSettings.videoUrl}
                  className="w-full aspect-video rounded-lg shadow-lg"
                  title="Mental Health Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1569437061238-3cf61084f487?q=80&w=2070&auto=format&fit=crop" 
                  alt="Mental Health Expert" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
