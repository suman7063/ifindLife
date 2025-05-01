
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from 'react-router-dom';

interface DiscoverSectionProps {
  videoUrl: string;
  isVideoLoaded: boolean;
  title: string;
  description: string;
  rating: string;
  reviews: string;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({ 
  videoUrl, 
  isVideoLoaded,
  title,
  description,
  rating,
  reviews
}) => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-2">
            <span className="block text-gray-800">{title}</span>
            <span className="block text-ifind-aqua">Mental Health Journey</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {description}
          </p>
          
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-xl font-bold mr-2">{rating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={star <= 4 ? "currentColor" : "none"} 
                    stroke={star > 4 ? "currentColor" : "none"} 
                    className={`w-5 h-5 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">{reviews}</span>
            </div>
          </div>
          
          <Link to="/mental-health-assessment">
            <Button className="bg-ifind-aqua hover:bg-ifind-teal text-white py-6 px-6 rounded-md font-medium text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Take Free Mental Health Assessment
            </Button>
          </Link>
        </div>
        
        <div className="relative aspect-video w-full bg-gray-100 rounded shadow-lg overflow-hidden">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="iFind Life Introduction"
              loading={isVideoLoaded ? "eager" : "lazy"}
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Video not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
