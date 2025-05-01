
import React from 'react';

interface DiscoverSectionProps {
  videoUrl: string;
  isVideoLoaded: boolean;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({ videoUrl, isVideoLoaded }) => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Discover iFind Life</h2>
        <p className="text-lg text-gray-600">
          Learn how our platform connects you with experienced professionals to help you navigate life's challenges.
        </p>
      </div>
      
      <div className="relative aspect-video w-full max-w-4xl mx-auto bg-gray-100 rounded shadow-lg overflow-hidden">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
  );
};
