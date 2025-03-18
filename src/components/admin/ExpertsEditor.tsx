
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Trash2, Plus, Check, X, Edit2 } from 'lucide-react';
import { Expert } from '@/types/expert';
import { toast } from 'sonner';

interface ExpertsEditorProps {
  experts: Expert[];
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
}

const ExpertsEditor: React.FC<ExpertsEditorProps> = ({ experts, setExperts }) => {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<Expert | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (expert: Expert) => {
    setFormData({ ...expert });
    setEditingId(expert.id);
  };

  const handleDelete = (id: string | number) => {
    setExperts(experts.filter(expert => expert.id !== id));
    toast.success("Expert removed successfully");
  };

  const handleSaveEdit = () => {
    if (!formData) return;
    
    setExperts(prevExperts => 
      prevExperts.map(expert => 
        expert.id === editingId ? { ...formData } : expert
      )
    );
    
    setEditingId(null);
    setFormData(null);
    toast.success("Expert updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(null);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setFormData({
      id: Date.now().toString(), // Generate a temporary ID
      name: "",
      experience: "0",
      specialties: [],
      rating: 0,
      consultations: 0,
      price: 0,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-placeholder.jpg",
      online: false,
      email: "", // Required for the Expert type
    });
  };

  const handleSaveNew = () => {
    if (!formData) return;
    
    setExperts(prev => [...prev, formData]);
    setIsAdding(false);
    setFormData(null);
    toast.success("New expert added successfully");
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (!formData) return;
    
    if (name === "specialties") {
      const values = value.split(",").map(v => v.trim());
      setFormData({ ...formData, specialties: values });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else if (name === "experience" || name === "rating" || name === "consultations" || name === "price") {
      // Convert to appropriate types
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Manage Experts</h3>
          <p className="text-muted-foreground">Add, edit, or remove experts from your platform.</p>
        </div>
        <Button 
          onClick={handleAddNew} 
          className="bg-ifind-aqua hover:bg-ifind-teal"
          disabled={isAdding || editingId !== null}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Expert
        </Button>
      </div>

      {isAdding && formData && (
        <Card className="border-2 border-ifind-aqua/50">
          <CardHeader>
            <CardTitle>Add New Expert</CardTitle>
            <CardDescription>Fill in the details for the new expert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  name="name" 
                  value={formData.name || ""} 
                  onChange={handleInputChange} 
                  placeholder="Expert name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  name="email" 
                  value={formData.email || ""} 
                  onChange={handleInputChange} 
                  placeholder="expert@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience (years)</label>
                <Input 
                  name="experience" 
                  value={formData.experience || ""} 
                  onChange={handleInputChange} 
                  placeholder="Years of experience"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialties (comma-separated)</label>
                <Input 
                  name="specialties" 
                  value={formData.specialties?.join(", ") || ""} 
                  onChange={handleInputChange} 
                  placeholder="Anxiety, Depression, CBT"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Price ($)</label>
                <Input 
                  name="price" 
                  value={formData.price?.toString() || ""} 
                  onChange={handleInputChange} 
                  placeholder="35"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Image URL</label>
                <Input 
                  name="imageUrl" 
                  value={formData.imageUrl || ""} 
                  onChange={handleInputChange} 
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Wait Time</label>
                <Input 
                  name="waitTime" 
                  value={formData.waitTime || ""} 
                  onChange={handleInputChange} 
                  placeholder="Available"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="online"
                  name="online"
                  checked={!!formData.online}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="online" className="text-sm font-medium">Available Online</label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancelAdd}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button className="bg-ifind-aqua hover:bg-ifind-teal" onClick={handleSaveNew}>
              <Check className="mr-2 h-4 w-4" /> Save Expert
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map(expert => (
          <Card key={expert.id} className={editingId === expert.id ? "border-2 border-ifind-aqua/50" : ""}>
            <CardHeader className="pb-2">
              <div className="aspect-[4/3] overflow-hidden rounded-md mb-2">
                <img 
                  src={expert.imageUrl} 
                  alt={expert.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {editingId === expert.id && formData ? (
                <Input 
                  name="name" 
                  value={formData.name || ""} 
                  onChange={handleInputChange} 
                  className="font-bold text-lg"
                />
              ) : (
                <CardTitle>{expert.name}</CardTitle>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {editingId === expert.id && formData ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience (years)</label>
                    <Input 
                      name="experience" 
                      value={formData.experience || ""} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specialties (comma-separated)</label>
                    <Input 
                      name="specialties" 
                      value={formData.specialties?.join(", ") || ""} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Session Price ($)</label>
                    <Input 
                      name="price" 
                      value={formData.price?.toString() || ""} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Wait Time</label>
                    <Input 
                      name="waitTime" 
                      value={formData.waitTime || ""} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Profile Image URL</label>
                    <Input 
                      name="imageUrl" 
                      value={formData.imageUrl || ""} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`online-${expert.id}`}
                      name="online"
                      checked={!!formData.online}
                      onChange={handleInputChange}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`online-${expert.id}`} className="text-sm font-medium">Available Online</label>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">{expert.experience} years</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">{expert.rating} ⭐</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Session Price</span>
                    <span className="font-medium">${expert.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Wait Time</span>
                    <span className="font-medium">{expert.waitTime}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground block mb-1">Specialties</span>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialties?.map((specialty, i) => (
                        <span 
                          key={i} 
                          className="inline-block bg-ifind-aqua/10 text-ifind-aqua px-2 py-1 rounded-full text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              {editingId === expert.id ? (
                <div className="flex justify-end space-x-2 w-full">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" className="bg-ifind-aqua hover:bg-ifind-teal" onClick={handleSaveEdit}>
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(expert)}
                    disabled={editingId !== null || isAdding}
                  >
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(expert.id)}
                    disabled={editingId !== null || isAdding}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpertsEditor;
