
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type TherapistType = {
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

type TherapistsEditorProps = {
  therapists: TherapistType[];
  setTherapists: React.Dispatch<React.SetStateAction<TherapistType[]>>;
};

const TherapistsEditor: React.FC<TherapistsEditorProps> = ({ therapists, setTherapists }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Therapists</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Therapist</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Therapist</DialogTitle>
            </DialogHeader>
            <AddTherapistForm 
              onAdd={(newTherapist) => setTherapists([...therapists, newTherapist])} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {therapists.map((therapist, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <div className="w-full md:w-1/4">
                <img 
                  src={therapist.imageUrl} 
                  alt={therapist.name}
                  className="aspect-square w-full object-cover rounded-lg" 
                />
                <Input
                  className="mt-2 text-xs"
                  placeholder="Image URL"
                  value={therapist.imageUrl}
                  onChange={(e) => {
                    const newTherapists = [...therapists];
                    newTherapists[index].imageUrl = e.target.value;
                    setTherapists(newTherapists);
                  }}
                />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs font-medium">Name</label>
                  <Input
                    value={therapist.name}
                    onChange={(e) => {
                      const newTherapists = [...therapists];
                      newTherapists[index].name = e.target.value;
                      setTherapists(newTherapists);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium">Experience (years)</label>
                    <Input
                      type="number"
                      value={therapist.experience}
                      onChange={(e) => {
                        const newTherapists = [...therapists];
                        newTherapists[index].experience = Number(e.target.value);
                        setTherapists(newTherapists);
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
                      value={therapist.rating}
                      onChange={(e) => {
                        const newTherapists = [...therapists];
                        newTherapists[index].rating = Number(e.target.value);
                        setTherapists(newTherapists);
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newTherapists = therapists.filter((_, i) => i !== index);
                      setTherapists(newTherapists);
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

const AddTherapistForm = ({ onAdd }) => {
  const [newTherapist, setNewTherapist] = useState({
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
          value={newTherapist.name} 
          onChange={(e) => setNewTherapist({...newTherapist, name: e.target.value})}
          placeholder="Therapist name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Experience (years)</label>
          <Input 
            type="number"
            value={newTherapist.experience} 
            onChange={(e) => setNewTherapist({...newTherapist, experience: Number(e.target.value)})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <Input 
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={newTherapist.rating} 
            onChange={(e) => setNewTherapist({...newTherapist, rating: Number(e.target.value)})}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Specialties (comma separated)</label>
        <Input 
          value={newTherapist.specialties.join(", ")} 
          onChange={(e) => setNewTherapist({...newTherapist, specialties: e.target.value.split(",").map(s => s.trim())})}
          placeholder="Anxiety, Depression, CBT"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Profile Image URL</label>
        <Input 
          value={newTherapist.imageUrl} 
          onChange={(e) => setNewTherapist({...newTherapist, imageUrl: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price ($/min)</label>
          <Input 
            type="number"
            value={newTherapist.price} 
            onChange={(e) => setNewTherapist({...newTherapist, price: Number(e.target.value)})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Wait Time</label>
          <Input 
            value={newTherapist.waitTime} 
            onChange={(e) => setNewTherapist({...newTherapist, waitTime: e.target.value})}
            placeholder="Available or wait time"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button 
          className="bg-ifind-aqua hover:bg-ifind-teal"
          onClick={() => {
            if (newTherapist.name && newTherapist.imageUrl) {
              onAdd(newTherapist);
            } else {
              alert("Please fill in all required fields");
            }
          }}
        >
          Add Therapist
        </Button>
      </div>
    </div>
  );
};

export default TherapistsEditor;
