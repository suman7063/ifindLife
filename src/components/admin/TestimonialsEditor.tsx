
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';

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
  const handleSaveEdit = () => {
    if (currentTestimonial && currentIndex >= 0) {
      const newTestimonials = [...testimonials];
      newTestimonials[currentIndex] = currentTestimonial;
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
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={testimonial.imageUrl}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">{testimonial.name}</p>
                <div className="flex items-center gap-1 text-xs">
                  <span>{testimonial.location}</span>
                  <span>•</span>
                  <span>{testimonial.date}</span>
                </div>
              </div>
            </div>
            <p className="text-sm italic mb-3">"{testimonial.text}"</p>
            <div className="flex text-yellow-400 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(testimonial, index)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTestimonial(index)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Testimonial Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          {currentTestimonial && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input 
                  value={currentTestimonial.name} 
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, name: e.target.value})}
                  placeholder="Client name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input 
                    value={currentTestimonial.location} 
                    onChange={(e) => setCurrentTestimonial({...currentTestimonial, location: e.target.value})}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input 
                    value={currentTestimonial.date} 
                    onChange={(e) => setCurrentTestimonial({...currentTestimonial, date: e.target.value})}
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
                  value={currentTestimonial.rating} 
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, rating: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Testimonial</label>
                <textarea 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={3}
                  value={currentTestimonial.text} 
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, text: e.target.value})}
                  placeholder="What the client said..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                <Input 
                  value={currentTestimonial.imageUrl} 
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-ifind-aqua hover:bg-ifind-teal"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Testimonial Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
          </DialogHeader>
          <AddTestimonialForm 
            initialTestimonial={currentTestimonial as TestimonialType}
            onAdd={handleAddTestimonial}
            onCancel={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add Testimonial Form Component
interface AddTestimonialFormProps {
  initialTestimonial: TestimonialType;
  onAdd: (testimonial: TestimonialType) => void;
  onCancel: () => void;
}

const AddTestimonialForm: React.FC<AddTestimonialFormProps> = ({ initialTestimonial, onAdd, onCancel }) => {
  const [newTestimonial, setNewTestimonial] = useState<TestimonialType>(initialTestimonial);

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input 
          value={newTestimonial.name} 
          onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
          placeholder="Client name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Input 
            value={newTestimonial.location} 
            onChange={(e) => setNewTestimonial({...newTestimonial, location: e.target.value})}
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input 
            value={newTestimonial.date} 
            onChange={(e) => setNewTestimonial({...newTestimonial, date: e.target.value})}
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
          value={newTestimonial.rating} 
          onChange={(e) => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Testimonial</label>
        <textarea 
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={3}
          value={newTestimonial.text} 
          onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})}
          placeholder="What the client said..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Profile Image URL</label>
        <Input 
          value={newTestimonial.imageUrl} 
          onChange={(e) => setNewTestimonial({...newTestimonial, imageUrl: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <Button 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="bg-ifind-aqua hover:bg-ifind-teal"
          onClick={() => {
            if (newTestimonial.name && newTestimonial.text) {
              onAdd(newTestimonial);
            } else {
              toast.error("Please fill in all required fields");
            }
          }}
        >
          Add Testimonial
        </Button>
      </div>
    </div>
  );
};

export default TestimonialsEditor;
