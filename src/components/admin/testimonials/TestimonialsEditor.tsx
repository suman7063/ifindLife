
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { RefreshCw } from "lucide-react";
import TestimonialFormContent from './TestimonialFormContent';
import TestimonialCard from './TestimonialCard';

type TestimonialType = {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  imageUrl: string;
};

type TestimonialsEditorProps = {
  testimonials: TestimonialType[];
  setTestimonials: React.Dispatch<React.SetStateAction<TestimonialType[]>>;
};

const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ testimonials, setTestimonials }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<TestimonialType | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Handle deleting a testimonial
  const handleDeleteTestimonial = (index: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      const newTestimonials = [...testimonials];
      newTestimonials.splice(index, 1);
      setTestimonials(newTestimonials);
      toast.success('Testimonial deleted successfully');
    }
  };

  // Handle opening the edit dialog
  const handleEditClick = (testimonial: TestimonialType, index: number) => {
    setCurrentTestimonial({...testimonial});
    setCurrentIndex(index);
    setEditDialogOpen(true);
  };

  // Handle saving edited testimonial
  const handleSaveEdit = (updatedTestimonial: TestimonialType) => {
    if (currentIndex >= 0) {
      const newTestimonials = [...testimonials];
      newTestimonials[currentIndex] = updatedTestimonial;
      setTestimonials(newTestimonials);
      setEditDialogOpen(false);
      toast.success('Testimonial updated successfully');
    }
  };

  // Handle adding a new testimonial
  const handleAddTestimonial = (newTestimonial: TestimonialType) => {
    setTestimonials([...testimonials, newTestimonial]);
    setAddDialogOpen(false);
    toast.success('Testimonial added successfully');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Testimonials</h2>
        <Button 
          variant="outline" 
          onClick={() => {
            setCurrentTestimonial({
              name: "",
              location: "",
              rating: 5,
              text: "",
              date: "Just now",
              imageUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop"
            });
            setAddDialogOpen(true);
          }}
        >
          Add New Testimonial
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            testimonial={testimonial}
            index={index}
            onEdit={handleEditClick}
            onDelete={handleDeleteTestimonial}
          />
        ))}
      </div>

      {/* Edit Testimonial Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          {currentTestimonial && (
            <TestimonialFormContent
              initialTestimonial={currentTestimonial}
              onSave={handleSaveEdit}
              onCancel={() => setEditDialogOpen(false)}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Testimonial Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
          </DialogHeader>
          {currentTestimonial && (
            <TestimonialFormContent
              initialTestimonial={currentTestimonial}
              onSave={handleAddTestimonial}
              onCancel={() => setAddDialogOpen(false)}
              isEdit={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsEditor;
