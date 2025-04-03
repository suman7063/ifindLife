
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

type TestimonialType = {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  imageUrl: string;
};

interface TestimonialFormContentProps {
  initialTestimonial: TestimonialType;
  onSave: (testimonial: TestimonialType) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const TestimonialFormContent: React.FC<TestimonialFormContentProps> = ({ 
  initialTestimonial, 
  onSave, 
  onCancel,
  isEdit = false
}) => {
  const [testimonial, setTestimonial] = useState<TestimonialType>(initialTestimonial);

  const handleSubmit = () => {
    if (!testimonial.name || !testimonial.text) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSave(testimonial);
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input 
          value={testimonial.name} 
          onChange={(e) => setTestimonial({...testimonial, name: e.target.value})}
          placeholder="Client name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Input 
            value={testimonial.location} 
            onChange={(e) => setTestimonial({...testimonial, location: e.target.value})}
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input 
            value={testimonial.date} 
            onChange={(e) => setTestimonial({...testimonial, date: e.target.value})}
            placeholder="1 week ago"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
        <Input 
          type="number"
          min="1" 
          max="5"
          value={testimonial.rating} 
          onChange={(e) => setTestimonial({...testimonial, rating: parseInt(e.target.value)})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Testimonial</label>
        <textarea 
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={3}
          value={testimonial.text} 
          onChange={(e) => setTestimonial({...testimonial, text: e.target.value})}
          placeholder="What the client said..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Profile Image URL</label>
        <Input 
          value={testimonial.imageUrl} 
          onChange={(e) => setTestimonial({...testimonial, imageUrl: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="bg-ifind-aqua hover:bg-ifind-teal"
          onClick={handleSubmit}
        >
          {isEdit ? 'Save Changes' : 'Add Testimonial'}
        </Button>
      </div>
    </div>
  );
};

export default TestimonialFormContent;
