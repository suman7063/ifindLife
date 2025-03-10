
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  categoryData,
  therapistData,
  testimonialData,
} from '@/data/homePageData';

const Admin = () => {
  // State for each section
  const [categories, setCategories] = useState(categoryData);
  const [therapists, setTherapists] = useState(therapistData);
  const [testimonials, setTestimonials] = useState(testimonialData);
  const [heroSettings, setHeroSettings] = useState({
    title: "Discover Your",
    subtitle: "Mental Wellness",
    description: "Connect with verified mental health experts for personalized guidance about your emotional well-being, relationships, and personal growth. Get support when you need it most.",
    videoUrl: "https://www.youtube.com/embed/rUJFj6yLWSw?autoplay=0"
  });

  const { currentUser, logout } = useAuth();

  // Load data from localStorage if available
  useEffect(() => {
    const savedContent = localStorage.getItem('ifindlife-content');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.categories) setCategories(parsedContent.categories);
        if (parsedContent.therapists) setTherapists(parsedContent.therapists);
        if (parsedContent.testimonials) setTestimonials(parsedContent.testimonials);
        if (parsedContent.heroSettings) setHeroSettings(parsedContent.heroSettings);
      } catch (e) {
        console.error("Error parsing saved content", e);
      }
    }
  }, []);

  // Handler for saving changes
  const handleSave = () => {
    // In a real application, this would save to a database or localStorage
    localStorage.setItem('ifindlife-content', JSON.stringify({
      categories,
      therapists,
      testimonials,
      heroSettings
    }));
    alert('Changes saved successfully! In a real application, this would update your database.');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-ifind-aqua hover:text-ifind-teal">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {currentUser && (
              <span className="ml-2 text-sm bg-ifind-teal/10 text-ifind-teal px-2 py-1 rounded-full">
                {currentUser.username} ({currentUser.role})
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-ifind-aqua hover:bg-ifind-teal">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <Tabs defaultValue="hero">
            <TabsList className="w-full border-b p-0 rounded-none">
              <TabsTrigger value="hero" className="rounded-none rounded-tl-lg">Hero Section</TabsTrigger>
              <TabsTrigger value="categories" className="rounded-none">Services</TabsTrigger>
              <TabsTrigger value="therapists" className="rounded-none">Therapists</TabsTrigger>
              <TabsTrigger value="testimonials" className="rounded-none">Testimonials</TabsTrigger>
            </TabsList>
            
            {/* Hero Section Editor */}
            <TabsContent value="hero" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    value={heroSettings.title} 
                    onChange={(e) => setHeroSettings({...heroSettings, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle (Gradient Text)</label>
                  <Input 
                    value={heroSettings.subtitle} 
                    onChange={(e) => setHeroSettings({...heroSettings, subtitle: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={4}
                    value={heroSettings.description} 
                    onChange={(e) => setHeroSettings({...heroSettings, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Video URL (YouTube Embed)</label>
                  <Input 
                    value={heroSettings.videoUrl} 
                    onChange={(e) => setHeroSettings({...heroSettings, videoUrl: e.target.value})}
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-2">Preview:</h3>
                  <div className="border p-4 rounded-lg">
                    <h1 className="text-3xl font-bold">
                      <span className="block">{heroSettings.title}</span>
                      <span className="text-gradient">{heroSettings.subtitle}</span>
                    </h1>
                    <p className="text-sm mt-2">{heroSettings.description}</p>
                    <div className="mt-4 bg-black rounded-lg aspect-video w-full max-w-md">
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={heroSettings.videoUrl}
                        title="Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Services/Categories Editor */}
            <TabsContent value="categories" className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Services</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add New Service</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Service</DialogTitle>
                    </DialogHeader>
                    <AddCategoryForm 
                      onAdd={(newCategory) => setCategories([...categories, newCategory])} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center`}>
                        {category.icon}
                      </div>
                      <input
                        className="font-semibold flex-1 border-none focus:outline-none focus:ring-1 focus:ring-ifind-aqua rounded-md px-2"
                        value={category.title}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          newCategories[index].title = e.target.value;
                          setCategories(newCategories);
                        }}
                      />
                    </div>
                    <textarea
                      className="w-full text-sm text-muted-foreground border-none focus:outline-none focus:ring-1 focus:ring-ifind-aqua rounded-md px-2 py-1"
                      value={category.description}
                      onChange={(e) => {
                        const newCategories = [...categories];
                        newCategories[index].description = e.target.value;
                        setCategories(newCategories);
                      }}
                    />
                    <div className="mt-3 flex justify-between">
                      <Input 
                        className="text-xs w-36"
                        value={category.href} 
                        onChange={(e) => {
                          const newCategories = [...categories];
                          newCategories[index].href = e.target.value;
                          setCategories(newCategories);
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newCategories = categories.filter((_, i) => i !== index);
                          setCategories(newCategories);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Therapists Editor */}
            <TabsContent value="therapists" className="p-6">
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
            </TabsContent>

            {/* Testimonials Editor */}
            <TabsContent value="testimonials" className="p-6">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Form Components for Adding New Items
const AddCategoryForm = ({ onAdd }) => {
  const [newCategory, setNewCategory] = useState({
    icon: <span className="text-3xl">🧠</span>,
    title: "",
    description: "",
    href: "/services/new",
    color: "bg-ifind-aqua/10"
  });

  const iconOptions = ["🧠", "💭", "🌱", "✨", "😊", "😴", "🍎", "🏃", "🧘", "🌈", "🔄", "🛌"];
  const colorOptions = [
    { name: "Aqua", value: "bg-ifind-aqua/10" },
    { name: "Purple", value: "bg-ifind-purple/10" },
    { name: "Teal", value: "bg-ifind-teal/10" },
    { name: "Charcoal", value: "bg-ifind-charcoal/10" }
  ];

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">Icon</label>
        <div className="grid grid-cols-6 gap-2">
          {iconOptions.map((icon) => (
            <button
              key={icon}
              type="button"
              className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl
                ${newCategory.icon.props.children === icon ? 'bg-ifind-aqua/20 ring-2 ring-ifind-aqua' : 'bg-gray-100'}`}
              onClick={() => setNewCategory({...newCategory, icon: <span className="text-3xl">{icon}</span>})}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input 
          value={newCategory.title} 
          onChange={(e) => setNewCategory({...newCategory, title: e.target.value})}
          placeholder="Service name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={2}
          value={newCategory.description} 
          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
          placeholder="Short description of the service"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL Path</label>
        <Input 
          value={newCategory.href} 
          onChange={(e) => setNewCategory({...newCategory, href: e.target.value})}
          placeholder="/services/your-service"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              className={`px-3 py-2 rounded-lg text-sm font-medium ${color.value} 
                ${newCategory.color === color.value ? 'ring-2 ring-ifind-aqua' : ''}`}
              onClick={() => setNewCategory({...newCategory, color: color.value})}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button 
          className="bg-ifind-aqua hover:bg-ifind-teal"
          onClick={() => {
            if (newCategory.title && newCategory.description) {
              onAdd(newCategory);
            } else {
              alert("Please fill in all required fields");
            }
          }}
        >
          Add Service
        </Button>
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

export default Admin;
