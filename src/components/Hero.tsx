
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import FreeAssessmentCTA from './FreeAssessmentCTA';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [heroSettings, setHeroSettings] = useState({
    title: "You Are Not Alone!",
    subtitle: "Mental & Emotional Wellness",
    description: "Connect with our currently online experts through an instant call",
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
            title: "You Are Not Alone!", // Override title with the new text
            subtitle: "Mental & Emotional Wellness", // Set consistent subtitle
            description: "Connect with our currently online experts through an instant call", // Add description
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
      {/* Banner Image Section with new styling */}
      <div className="relative w-full h-[504px]">
        <img 
          src="/lovable-uploads/279827ab-6ab5-47dc-a1af-213e53684caf.png" 
          alt="Woman with sunglasses" 
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '504px',
            borderRadius: '0px'
          }}
        />
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
              fontSize: '80px',
              lineHeight: '104px',
              fontWeight: 700,
              color: '#FFFFFF',
              maxWidth: '449px'
            }}
          >
            You Are<br />
            Not Alone!
          </h1>
        </div>
      </div>
      
      {/* Help Section - Center aligned button with link */}
      <div className="bg-gray-800 text-white py-6 px-6 sm:px-12 md:px-20">
        <div className="container mx-auto flex flex-col items-center">
          <h2 className="text-lg font-medium mb-2 text-center">
            {heroSettings.subtitle}
          </h2>
          <p className="text-sm text-center text-gray-300 mb-4">
            {heroSettings.description}
          </p>
          <div className="flex justify-center">
            <FreeAssessmentCTA />
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
              <Link to="/mental-health-assessment#top">
                <Button className="bg-ifind-purple hover:bg-ifind-purple/90 text-white">
                  Take Free Mental Health Assessment
                </Button>
              </Link>
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
