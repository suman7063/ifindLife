
import { useState, useEffect } from 'react';
import { initialHeroSettings } from '@/data/initialAdminData';
import { toast } from 'sonner';

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
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Add retry functionality
  useEffect(() => {
    if (error && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        console.log(`Attempting to recover from error (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        setRetryCount(prev => prev + 1);
        // Reset error to allow retry
        setError(null);
      }, 2000 * Math.pow(2, retryCount)); // Exponential backoff
      
      return () => clearTimeout(timer);
    } else if (error && retryCount >= MAX_RETRIES) {
      toast.error("Failed to update hero settings after multiple attempts. Using local defaults.");
      console.error("Max retries exceeded for hero settings. Using defaults.", error);
    }
  }, [error, retryCount]);

  // Create a wrapper for setHeroSettings that also validates content and calls the update callback
  const updateHeroSettings = (settings: HeroSettings) => {
    try {
      // Safety check: If someone tries to add an inappropriate video, replace it with default professional video
      if (settings.videoUrl && isInappropriateVideo(settings.videoUrl)) {
        console.warn("Inappropriate video URL detected and blocked");
        settings.videoUrl = "https://www.youtube.com/embed/0J_Vg-uWY-k?autoplay=0";
        toast.warning("Inappropriate content detected and blocked");
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
      
      // Validate title and subtitle to ensure they're not empty or inappropriate
      if (!settings.title || settings.title.trim() === '') {
        settings.title = initialHeroSettings.title;
      }
      
      if (!settings.subtitle || settings.subtitle.trim() === '') {
        settings.subtitle = initialHeroSettings.subtitle;
      }
      
      if (!settings.description || settings.description.trim() === '') {
        settings.description = initialHeroSettings.description;
      }
      
      setHeroSettings(settings);
      updateCallback(settings);
      // Reset retry count on success
      setRetryCount(0);
      setError(null);
    } catch (err) {
      console.error("Error in updateHeroSettings:", err);
      setError(err instanceof Error ? err.message : String(err));
      toast.error("Error updating hero settings");
    }
  };

  return {
    heroSettings,
    setHeroSettings: updateHeroSettings,
    error,
    retryCount
  };
}
