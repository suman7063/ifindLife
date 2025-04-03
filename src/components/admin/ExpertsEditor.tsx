
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from 'lucide-react';

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
  languages?: string[];
  bio?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  availability?: string;
};

type ExpertsEditorProps = {
  experts: ExpertType[];
  setExperts: React.Dispatch<React.SetStateAction<ExpertType[]>>;
};

const ExpertsEditor: React.FC<ExpertsEditorProps> = ({ experts, setExperts }) => {
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
              onAdd={(newExpert) => setExperts([...experts, newExpert])} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {experts.map((expert, index) => (
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
                    const newExperts = [...experts];
                    newExperts[index].imageUrl = e.target.value;
                    setExperts(newExperts);
                  }}
                />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs font-medium">Name</label>
                  <Input
                    value={expert.name}
                    onChange={(e) => {
                      const newExperts = [...experts];
                      newExperts[index].name = e.target.value;
                      setExperts(newExperts);
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
                        const newExperts = [...experts];
                        newExperts[index].experience = Number(e.target.value);
                        setExperts(newExperts);
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
                        const newExperts = [...experts];
                        newExperts[index].rating = Number(e.target.value);
                        setExperts(newExperts);
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium">Consultations</label>
                    <Input
                      type="number"
                      value={expert.consultations}
                      onChange={(e) => {
                        const newExperts = [...experts];
                        newExperts[index].consultations = Number(e.target.value);
                        setExperts(newExperts);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Price ($/min)</label>
                    <Input
                      type="number"
                      value={expert.price}
                      onChange={(e) => {
                        const newExperts = [...experts];
                        newExperts[index].price = Number(e.target.value);
                        setExperts(newExperts);
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium">Wait Time</label>
                  <Input
                    value={expert.waitTime}
                    onChange={(e) => {
                      const newExperts = [...experts];
                      newExperts[index].waitTime = e.target.value;
                      setExperts(newExperts);
                    }}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium">Specialties (comma separated)</label>
                  <Input
                    value={expert.specialties.join(", ")}
                    onChange={(e) => {
                      const newExperts = [...experts];
                      newExperts[index].specialties = e.target.value.split(",").map(s => s.trim());
                      setExperts(newExperts);
                    }}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium">Languages (comma separated)</label>
                  <Input
                    value={expert.languages?.join(", ") || ""}
                    onChange={(e) => {
                      const newExperts = [...experts];
                      newExperts[index].languages = e.target.value.split(",").map(s => s.trim());
                      setExperts(newExperts);
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">Bio</label>
                  <Textarea
                    value={expert.bio || ""}
                    onChange={(e) => {
                      const newExperts = [...experts];
                      newExperts[index].bio = e.target.value;
                      setExperts(newExperts);
                    }}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">Email</label>
                  <Input
                    type="email"
                    value={expert.email || ""}
                    onChange={(e) => {
                      const newExperts = [...experts];
                      newExperts[index].email = e.target.value;
                      setExperts(newExperts);
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">Phone</label>
                  <Input
                    value={expert.phone || ""}
                    onChange={(e) => {
                      const newExperts = [...experts];
                      newExperts[index].phone = e.target.value;
                      setExperts(newExperts);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium">Address</label>
                    <Input
                      value={expert.address || ""}
                      onChange={(e) => {
                        const newExperts = [...experts];
                        newExperts[index].address = e.target.value;
                        setExperts(newExperts);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">City</label>
                    <Input
                      value={expert.city || ""}
                      onChange={(e) => {
                        const newExperts = [...experts];
                        newExperts[index].city = e.target.value;
                        setExperts(newExperts);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium">State</label>
                    <Input
                      value={expert.state || ""}
                      onChange={(e) => {
                        const newExperts = [...experts];
                        newExperts[index].state = e.target.value;
                        setExperts(newExperts);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Country</label>
                    <Input
                      value={expert.country || ""}
                      onChange={(e) => {
                        const newExperts = [...experts];
                        newExperts[index].country = e.target.value;
                        setExperts(newExperts);
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium">Online Status</label>
                    <Select 
                      value={expert.online ? "true" : "false"}
                      onValueChange={(value) => {
                        const newExperts = [...experts];
                        newExperts[index].online = value === "true";
                        setExperts(newExperts);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Online
                          </div>
                        </SelectItem>
                        <SelectItem value="false">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                            Offline
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Availability</label>
                    <Input
                      value={expert.availability || ""}
                      onChange={(e) => {
                        const newExperts = [...experts];
                        newExperts[index].availability = e.target.value;
                        setExperts(newExperts);
                      }}
                      placeholder="e.g. Available, 5 min wait, etc."
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newExperts = experts.filter((_, i) => i !== index);
                      setExperts(newExperts);
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
    online: true,
    languages: ["English", "Hindi"],
    bio: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    availability: "Available"
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
        <label className="block text-sm font-medium mb-1">Languages (comma separated)</label>
        <Input 
          value={newExpert.languages.join(", ")} 
          onChange={(e) => setNewExpert({...newExpert, languages: e.target.value.split(",").map(s => s.trim())})}
          placeholder="English, Hindi"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <Textarea 
          value={newExpert.bio} 
          onChange={(e) => setNewExpert({...newExpert, bio: e.target.value})}
          placeholder="Professional background and expertise"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input 
          type="email"
          value={newExpert.email} 
          onChange={(e) => setNewExpert({...newExpert, email: e.target.value})}
          placeholder="expert@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <Input 
          value={newExpert.phone} 
          onChange={(e) => setNewExpert({...newExpert, phone: e.target.value})}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Input 
            value={newExpert.address} 
            onChange={(e) => setNewExpert({...newExpert, address: e.target.value})}
            placeholder="123 Main St"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <Input 
            value={newExpert.city} 
            onChange={(e) => setNewExpert({...newExpert, city: e.target.value})}
            placeholder="New Delhi"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <Input 
            value={newExpert.state} 
            onChange={(e) => setNewExpert({...newExpert, state: e.target.value})}
            placeholder="Delhi"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <Input 
            value={newExpert.country} 
            onChange={(e) => setNewExpert({...newExpert, country: e.target.value})}
            placeholder="India"
          />
        </div>
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
      <div>
        <label className="block text-sm font-medium mb-1">Online Status</label>
        <Select 
          value={newExpert.online ? "true" : "false"}
          onValueChange={(value) => setNewExpert({...newExpert, online: value === "true"})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Online
              </div>
            </SelectItem>
            <SelectItem value="false">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                Offline
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
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
