
import { useState } from 'react';
import { initialHeroSettings } from '@/data/initialAdminData';

export interface HeroSettings {
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
}

// Function to check if a video URL is inappropriate
const isInappropriateVideo = (url: string): boolean => {
  const inappropriatePatterns = [
    'dQw4w9WgXcQ', // Rick Astley Never Gonna Give You Up video ID
    'rick astley',
    'rickroll',
    'never gonna give you up'
  ];
  
  const lowercaseUrl = url.toLowerCase();
  return inappropriatePatterns.some(pattern => lowercaseUrl.includes(pattern.toLowerCase()));
};

export function useHeroSettings(
  initialSettings: HeroSettings = {
    ...initialHeroSettings
  },
  updateCallback: (settings: HeroSettings) => void = () => {}
) {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(initialSettings);

  // Create a wrapper for setHeroSettings that also validates content and calls the update callback
  const updateHeroSettings = (settings: HeroSettings) => {
    // Safety check: If someone tries to add an inappropriate video, replace it with default professional video
    if (settings.videoUrl && isInappropriateVideo(settings.videoUrl)) {
      console.warn("Inappropriate video URL detected and blocked");
      settings.videoUrl = "https://www.youtube.com/embed/0J_Vg-uWY-k?autoplay=0";
    }
    
    // Always ensure autoplay is disabled for better user experience
    if (settings.videoUrl) {
      settings.videoUrl = settings.videoUrl
        .replace(/([?&])autoplay=1/g, '$1autoplay=0')
        .replace(/\?$/, '');
        
      if (!settings.videoUrl.includes('autoplay=')) {
        settings.videoUrl = settings.videoUrl.includes('?') 
          ? `${settings.videoUrl}&autoplay=0` 
          : `${settings.videoUrl}?autoplay=0`;
      }
    }
    
    setHeroSettings(settings);
    updateCallback(settings);
  };

  return {
    heroSettings,
    setHeroSettings: updateHeroSettings
  };
}
