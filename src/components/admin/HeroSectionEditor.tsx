
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';

interface HeroSectionEditorProps {
  heroSettings: any;
  setHeroSettings: React.Dispatch<React.SetStateAction<any>>;
}

const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ heroSettings, setHeroSettings }) => {
  const [localSettings, setLocalSettings] = useState(heroSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    try {
      setHeroSettings(localSettings);
      // Save to localStorage for persistence
      localStorage.setItem('ifindlife-content', JSON.stringify({
        ...JSON.parse(localStorage.getItem('ifindlife-content') || '{}'),
        heroSettings: localSettings
      }));
      toast.success("Hero section settings saved successfully");
    } catch (error) {
      toast.error("Failed to save hero section settings");
      console.error("Error saving hero settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hero Section Settings</h1>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Main Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Heading</label>
            <input
              type="text"
              name="heading"
              value={localSettings?.heading || "Find Your Inner Peace"}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Subheading</label>
            <input
              type="text"
              name="subheading"
              value={localSettings?.subheading || "Professional mental health support when you need it most"}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Button Text</label>
            <input
              type="text"
              name="ctaText"
              value={localSettings?.ctaText || "Get Started"}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Button URL</label>
            <input
              type="text"
              name="ctaUrl"
              value={localSettings?.ctaUrl || "/assessment"}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Visual Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Background Image URL</label>
            <input
              type="text"
              name="backgroundImage"
              value={localSettings?.backgroundImage || "/stars-bg.png"}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Image URL</label>
            <input
              type="text"
              name="heroImage"
              value={localSettings?.heroImage || "/public/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png"}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSectionEditor;
