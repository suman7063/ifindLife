import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { RefreshCw } from "lucide-react";
import TestimonialFormContent from './TestimonialFormContent';
import TestimonialCard from './TestimonialCard';
import { useTestimonialsData, Testimonial } from '../hooks/testimonials';

interface TestimonialsEditorProps {
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  onRefresh?: () => void;
}

const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ 
  testimonials: initialTestimonials,
  setTestimonials: updateParentTestimonials,
  onRefresh
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    seedDefaultTestimonials
  } = useTestimonialsData(initialTestimonials, updateParentTestimonials);

  useEffect(() => {
    // Initialize testimonials on component mount
    fetchTestimonials();
  }, []);

  // Handle refreshing testimonials
  const handleRefresh = async () => {
    await fetchTestimonials();
    if (onRefresh) onRefresh();
    toast.success('Testimonials refreshed successfully');
  };

  // Handle deleting a testimonial
  const handleDeleteTestimonial = async (id?: string, index?: number) => {
    if (!id) {
      toast.error('Cannot delete testimonial without ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await deleteTestimonial(id);
      toast.success('Testimonial deleted successfully');
    }
  };

  // Handle opening the edit dialog
  const handleEditClick = (testimonial: Testimonial, index: number) => {
    setCurrentTestimonial({...testimonial});
    setCurrentIndex(index);
    setEditDialogOpen(true);
  };

  // Handle saving edited testimonial
  const handleSaveEdit = async (updatedTestimonial: Testimonial) => {
    if (!updatedTestimonial.id) {
      toast.error('Cannot update testimonial without ID');
      return;
    }
    
    await updateTestimonial(updatedTestimonial.id, updatedTestimonial);
    setEditDialogOpen(false);
    toast.success('Testimonial updated successfully');
  };

  // Handle adding a new testimonial
  const handleAddTestimonial = async (newTestimonial: Testimonial) => {
    await addTestimonial(newTestimonial);
    setAddDialogOpen(false);
    toast.success('Testimonial added successfully');
  };

  // Handle seeding default testimonials
  const handleSeedDefaults = async () => {
    await seedDefaultTestimonials();
    toast.success('Default testimonials seeded successfully');
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-semibold text-red-700">Error Loading Testimonials</h3>
        <p className="text-red-600">{error}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={fetchTestimonials}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Testimonials</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSeedDefaults}
            disabled={loading}
          >
            Seed Defaults
          </Button>
          <Button 
            variant="default" 
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
            disabled={loading}
          >
            Add New Testimonial
          </Button>
        </div>
      </div>

      {loading && testimonials.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading testimonials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id || index}
              testimonial={testimonial}
              index={index}
              onEdit={handleEditClick}
              onDelete={() => handleDeleteTestimonial(testimonial.id, index)}
            />
          ))}

          {testimonials.length === 0 && !loading && (
            <div className="col-span-full p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No testimonials found</p>
              <Button onClick={handleSeedDefaults} size="sm">Add Default Testimonials</Button>
            </div>
          )}
        </div>
      )}

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
              isSaving={loading}
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
              isSaving={loading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsEditor;
