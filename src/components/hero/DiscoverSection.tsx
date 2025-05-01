
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DiscoverSectionProps {
  videoUrl: string;
  isVideoLoaded: boolean;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({ videoUrl, isVideoLoaded }) => {
  return (
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
              videoUrl ? (
                <iframe
                  src={videoUrl}
                  className="w-full aspect-video rounded-lg shadow-lg"
                  title="Mental Health Video"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
  );
};
