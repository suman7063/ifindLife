
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { HeroSettings } from './hooks/useHeroSettings';
import { toast } from 'sonner';

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

type HeroSettingsProps = {
  heroSettings: HeroSettings;
  setHeroSettings: React.Dispatch<React.SetStateAction<HeroSettings>>;
};

const HeroSectionEditor: React.FC<HeroSettingsProps> = ({ 
  heroSettings, 
  setHeroSettings 
}) => {
  // Function to handle video URL changes and ensure autoplay is disabled
  const handleVideoUrlChange = (url: string) => {
    // Check if URL is inappropriate
    if (isInappropriateVideo(url)) {
      toast.error("Inappropriate content detected and blocked");
      return;
    }
    
    // Clean the URL to remove existing autoplay parameter if present
    let cleanUrl = url.replace(/([?&])autoplay=1/g, '$1autoplay=0').replace(/\?$/, '');
    
    // Add autoplay=0 parameter
    if (cleanUrl) {
      cleanUrl = cleanUrl.includes('?') 
        ? `${cleanUrl}&autoplay=0` 
        : `${cleanUrl}?autoplay=0`;
    }
    
    setHeroSettings({...heroSettings, videoUrl: cleanUrl});
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Hero Section</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input 
            value={heroSettings.title} 
            onChange={(e) => setHeroSettings({...heroSettings, title: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle (Gradient Text)</label>
          <Input 
            value={heroSettings.subtitle} 
            onChange={(e) => setHeroSettings({...heroSettings, subtitle: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            rows={4}
            value={heroSettings.description} 
            onChange={(e) => setHeroSettings({...heroSettings, description: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Text</label>
          <Input 
            value={heroSettings.ctaText || ''} 
            onChange={(e) => setHeroSettings({...heroSettings, ctaText: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Link</label>
          <Input 
            value={heroSettings.ctaLink || ''} 
            onChange={(e) => setHeroSettings({...heroSettings, ctaLink: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Video URL (YouTube Embed)</label>
          <div className="flex gap-2">
            <Input 
              value={heroSettings.videoUrl?.replace(/([?&])autoplay=[01]/g, '').replace(/\?$/, '') || ''}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
            />
            <Button 
              variant="outline" 
              type="button"
              className="flex-shrink-0 bg-ifind-offwhite"
              onClick={() => {
                // Professional mental health video for testing
                handleVideoUrlChange("https://www.youtube.com/embed/0J_Vg-uWY-k");
              }}
            >
              <Video className="h-4 w-4 mr-2" />
              Test
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Note: Use embed URLs (e.g., https://www.youtube.com/embed/VIDEO_ID). The video will not autoplay to improve user experience.
          </p>
        </div>
        <div className="mt-2">
          <h3 className="text-sm font-medium mb-2">Preview:</h3>
          <div className="border p-4 rounded-lg">
            <h1 className="text-3xl font-bold">
              <span className="block">{heroSettings.title}</span>
              <span className="text-gradient">{heroSettings.subtitle}</span>
            </h1>
            <p className="text-sm mt-2">{heroSettings.description}</p>
            {heroSettings.videoUrl && !isInappropriateVideo(heroSettings.videoUrl) && (
              <div className="mt-4 bg-black rounded-lg aspect-video w-full max-w-md">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={heroSettings.videoUrl}
                  title="Preview"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionEditor;
