
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

export function useHeroSettings(
  initialSettings: HeroSettings = {
    ...initialHeroSettings
  },
  updateCallback: (settings: HeroSettings) => void = () => {}
) {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(initialSettings);

  // Create a wrapper for setHeroSettings that also calls the update callback
  const updateHeroSettings = (settings: HeroSettings) => {
    setHeroSettings(settings);
    updateCallback(settings);
  };

  return {
    heroSettings,
    setHeroSettings: updateHeroSettings
  };
}
