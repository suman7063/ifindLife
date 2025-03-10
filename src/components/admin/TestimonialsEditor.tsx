
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Testimonials</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Testimonial</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
            </DialogHeader>
            <AddTestimonialForm 
              onAdd={(newTestimonial) => setTestimonials([...testimonials, newTestimonial])} 
            />
          </DialogContent>
        </Dialog>
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
                <Input
                  className="font-medium text-sm border-none p-0 h-auto"
                  value={testimonial.name}
                  onChange={(e) => {
                    const newTestimonials = [...testimonials];
                    newTestimonials[index].name = e.target.value;
                    setTestimonials(newTestimonials);
                  }}
                />
                <div className="flex items-center gap-1 text-xs">
                  <Input
                    className="w-24 border-none p-0 h-auto"
                    value={testimonial.location}
                    onChange={(e) => {
                      const newTestimonials = [...testimonials];
                      newTestimonials[index].location = e.target.value;
                      setTestimonials(newTestimonials);
                    }}
                  />
                  <span>•</span>
                  <Input
                    className="w-24 border-none p-0 h-auto"
                    value={testimonial.date}
                    onChange={(e) => {
                      const newTestimonials = [...testimonials];
                      newTestimonials[index].date = e.target.value;
                      setTestimonials(newTestimonials);
                    }}
                  />
                </div>
              </div>
            </div>
            <textarea
              className="w-full text-sm italic border-none focus:outline-none focus:ring-1 focus:ring-ifind-aqua rounded-md px-2 py-1"
              rows={4}
              value={testimonial.text}
              onChange={(e) => {
                const newTestimonials = [...testimonials];
                newTestimonials[index].text = e.target.value;
                setTestimonials(newTestimonials);
              }}
            />
            <div className="mt-3 flex justify-between items-center">
              <Input
                className="text-xs w-full"
                placeholder="Image URL"
                value={testimonial.imageUrl}
                onChange={(e) => {
                  const newTestimonials = [...testimonials];
                  newTestimonials[index].imageUrl = e.target.value;
                  setTestimonials(newTestimonials);
                }}
              />
              <Button
                variant="destructive"
                size="sm"
                className="ml-2 shrink-0"
                onClick={() => {
                  const newTestimonials = testimonials.filter((_, i) => i !== index);
                  setTestimonials(newTestimonials);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddTestimonialForm = ({ onAdd }) => {
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    location: "",
    rating: 5,
    text: "",
    date: "Just now",
    imageUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop"
  });

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
      <div className="flex justify-end mt-4">
        <Button 
          className="bg-ifind-aqua hover:bg-ifind-teal"
          onClick={() => {
            if (newTestimonial.name && newTestimonial.text) {
              onAdd(newTestimonial);
            } else {
              alert("Please fill in all required fields");
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
