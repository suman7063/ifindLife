
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ExpertType = {
  id: number;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime: string;
  imageUrl: string;
  online: boolean;
};

type ExpertsEditorProps = {
  therapists: ExpertType[];
  setTherapists: React.Dispatch<React.SetStateAction<ExpertType[]>>;
};

const ExpertsEditor: React.FC<ExpertsEditorProps> = ({ therapists, setTherapists }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Experts</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Expert</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Expert</DialogTitle>
            </DialogHeader>
            <AddExpertForm 
              onAdd={(newExpert) => setTherapists([...therapists, newExpert])} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {therapists.map((expert, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <div className="w-full md:w-1/4">
                <img 
                  src={expert.imageUrl} 
                  alt={expert.name}
                  className="aspect-square w-full object-cover rounded-lg" 
                />
                <Input
                  className="mt-2 text-xs"
                  placeholder="Image URL"
                  value={expert.imageUrl}
                  onChange={(e) => {
                    const newExperts = [...therapists];
                    newExperts[index].imageUrl = e.target.value;
                    setTherapists(newExperts);
                  }}
                />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs font-medium">Name</label>
                  <Input
                    value={expert.name}
                    onChange={(e) => {
                      const newExperts = [...therapists];
                      newExperts[index].name = e.target.value;
                      setTherapists(newExperts);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium">Experience (years)</label>
                    <Input
                      type="number"
                      value={expert.experience}
                      onChange={(e) => {
                        const newExperts = [...therapists];
                        newExperts[index].experience = Number(e.target.value);
                        setTherapists(newExperts);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Rating</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={expert.rating}
                      onChange={(e) => {
                        const newExperts = [...therapists];
                        newExperts[index].rating = Number(e.target.value);
                        setTherapists(newExperts);
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newExperts = therapists.filter((_, i) => i !== index);
                      setTherapists(newExperts);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddExpertForm = ({ onAdd }) => {
  const [newExpert, setNewExpert] = useState({
    id: Date.now(),
    name: "",
    experience: 5,
    specialties: [""],
    rating: 4.5,
    consultations: 1000,
    price: 30,
    waitTime: "Available",
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    online: true
  });

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input 
          value={newExpert.name} 
          onChange={(e) => setNewExpert({...newExpert, name: e.target.value})}
          placeholder="Expert name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Experience (years)</label>
          <Input 
            type="number"
            value={newExpert.experience} 
            onChange={(e) => setNewExpert({...newExpert, experience: Number(e.target.value)})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <Input 
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={newExpert.rating} 
            onChange={(e) => setNewExpert({...newExpert, rating: Number(e.target.value)})}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Specialties (comma separated)</label>
        <Input 
          value={newExpert.specialties.join(", ")} 
          onChange={(e) => setNewExpert({...newExpert, specialties: e.target.value.split(",").map(s => s.trim())})}
          placeholder="Anxiety, Depression, CBT"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Profile Image URL</label>
        <Input 
          value={newExpert.imageUrl} 
          onChange={(e) => setNewExpert({...newExpert, imageUrl: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price ($/min)</label>
          <Input 
            type="number"
            value={newExpert.price} 
            onChange={(e) => setNewExpert({...newExpert, price: Number(e.target.value)})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Wait Time</label>
          <Input 
            value={newExpert.waitTime} 
            onChange={(e) => setNewExpert({...newExpert, waitTime: e.target.value})}
            placeholder="Available or wait time"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button 
          className="bg-ifind-aqua hover:bg-ifind-teal"
          onClick={() => {
            if (newExpert.name && newExpert.imageUrl) {
              onAdd(newExpert);
            } else {
              alert("Please fill in all required fields");
            }
          }}
        >
          Add Expert
        </Button>
      </div>
    </div>
  );
};

export default ExpertsEditor;
