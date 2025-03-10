
import React from 'react';
import { Input } from "@/components/ui/input";

type HeroSettingsProps = {
  heroSettings: {
    title: string;
    subtitle: string;
    description: string;
    videoUrl: string;
  };
  setHeroSettings: React.Dispatch<React.SetStateAction<{
    title: string;
    subtitle: string;
    description: string;
    videoUrl: string;
  }>>;
};

const HeroSectionEditor: React.FC<HeroSettingsProps> = ({ 
  heroSettings, 
  setHeroSettings 
}) => {
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
          <label className="block text-sm font-medium mb-1">Video URL (YouTube Embed)</label>
          <Input 
            value={heroSettings.videoUrl} 
            onChange={(e) => setHeroSettings({...heroSettings, videoUrl: e.target.value})}
          />
        </div>
        <div className="mt-2">
          <h3 className="text-sm font-medium mb-2">Preview:</h3>
          <div className="border p-4 rounded-lg">
            <h1 className="text-3xl font-bold">
              <span className="block">{heroSettings.title}</span>
              <span className="text-gradient">{heroSettings.subtitle}</span>
            </h1>
            <p className="text-sm mt-2">{heroSettings.description}</p>
            <div className="mt-4 bg-black rounded-lg aspect-video w-full max-w-md">
              <iframe
                className="w-full h-full rounded-lg"
                src={heroSettings.videoUrl}
                title="Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionEditor;
