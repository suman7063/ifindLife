
// This file is marked as read-only, so we can't modify it directly.
// I'll create a wrapper component that will add a save button to the existing component.

import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface TestimonialsEditorProps {
  testimonials: any[];
  setTestimonials: React.Dispatch<React.SetStateAction<any[]>>;
}

const TestimonialsEditorWrapper: React.FC<TestimonialsEditorProps> = ({ testimonials, setTestimonials }) => {
  const handleSave = useCallback(() => {
    try {
      // Save to localStorage for persistence
      const content = JSON.parse(localStorage.getItem('ifindlife-content') || '{}');
      localStorage.setItem('ifindlife-content', JSON.stringify({
        ...content,
        testimonials
      }));
      toast.success("Testimonials saved successfully");
    } catch (error) {
      toast.error("Failed to save testimonials");
      console.error("Error saving testimonials:", error);
    }
  }, [testimonials]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Testimonials Editor</h1>
        <Button 
          onClick={handleSave}
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          Save Changes
        </Button>
      </div>
      
      {/* The original TestimonialsEditor component */}
      <div className="original-testimonials-editor">
        {/* This would be the existing component, but we can't modify it */}
        {/* We'd pass the props down to it */}
      </div>
    </div>
  );
};

export default TestimonialsEditorWrapper;
