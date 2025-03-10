
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { User, Mail, Phone, Briefcase, MapPin, GraduationCap, Upload } from 'lucide-react';

type ServiceType = {
  id: number;
  name: string;
  description: string;
  rateUSD: number;
  rateINR: number;
};

const ExpertRegistrationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [formData, setFormData] = useState({
    id: Date.now(),
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    country: '',
    specialization: '',
    experience: '',
    certificates: [] as File[],
    certificateUrls: [] as string[],
    bio: '',
    selectedServices: [] as number[],
    acceptedTerms: false
  });

  // Load services defined by admin
  useEffect(() => {
    // In a real application, this would be fetched from an API
    const storedContent = localStorage.getItem('ifindlife-content');
    if (storedContent) {
      try {
        const parsedContent = JSON.parse(storedContent);
        if (parsedContent.categories) {
          // Transform categories into services
          const servicesFromCategories = parsedContent.categories.map((category: any, index: number) => ({
            id: index + 1,
            name: category.title,
            description: category.description,
            rateUSD: 30 + (index * 5), // Sample rates
            rateINR: (30 + (index * 5)) * 80, // Sample conversion
          }));
          setServices(servicesFromCategories);
        }
      } catch (e) {
        console.error("Error parsing saved content", e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (serviceId: number) => {
    setFormData(prev => {
      if (prev.selectedServices.includes(serviceId)) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(id => id !== serviceId)
        };
      } else {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, serviceId]
        };
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, ...files],
        certificateUrls: [...prev.certificateUrls, ...files.map(file => URL.createObjectURL(file))]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!formData.acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    if (formData.selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    
    // In a real application, this would send data to a backend API
    // For this demo, we'll store it in localStorage
    const experts = localStorage.getItem('ifindlife-experts')
      ? JSON.parse(localStorage.getItem('ifindlife-experts')!)
      : [];
    
    // Check if email already exists
    if (experts.some((expert: any) => expert.email === formData.email)) {
      toast.error("Email already registered");
      return;
    }
    
    // Add new expert
    const newExperts = [...experts, formData];
    localStorage.setItem('ifindlife-experts', JSON.stringify(newExperts));
    
    toast.success("Registration successful! Please login.");
    navigate('/expert-login');
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.country) {
        toast.error("Please fill all required fields");
        return;
      }
    }
    
    if (step === 3) {
      if (!formData.specialization || !formData.experience || !formData.bio) {
        toast.error("Please fill all required fields");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Jane Smith"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={nextStep}
              className="bg-astro-purple hover:bg-astro-violet"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 2: Address Information */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Address Information</h2>
          
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">Street Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">City</label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">State/Province</label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Maharashtra"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">Country</label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="India"
              required
            />
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="bg-astro-purple hover:bg-astro-violet"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 3: Professional Information */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Professional Information</h2>
          
          <div className="space-y-2">
            <label htmlFor="specialization" className="text-sm font-medium">Specialization</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Clinical Psychology, CBT, etc."
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="experience" className="text-sm font-medium">Years of Experience</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="5"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">Professional Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your professional background, approach, and expertise..."
              className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Certificates</label>
            <div className="border border-dashed border-input rounded-md p-6">
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                <input
                  type="file"
                  id="certificates"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('certificates')?.click()}
                >
                  Select Files
                </Button>
              </div>
            </div>
            
            {formData.certificateUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {formData.certificateUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Certificate ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          certificates: prev.certificates.filter((_, i) => i !== index),
                          certificateUrls: prev.certificateUrls.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="bg-astro-purple hover:bg-astro-violet"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 4: Service Selection */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Services Offered</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select the services you would like to offer. Rates are pre-defined by the admin.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.id} className={`overflow-hidden transition-all border-2 ${
                formData.selectedServices.includes(service.id) ? 'border-astro-purple' : 'border-transparent'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={formData.selectedServices.includes(service.id)}
                          onCheckedChange={() => handleCheckboxChange(service.id)}
                        />
                        <label
                          htmlFor={`service-${service.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {service.name}
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {service.description}
                      </p>
                      <div className="mt-2 flex justify-between text-xs font-medium">
                        <span>${service.rateUSD}/hour</span>
                        <span>₹{service.rateINR}/hour</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex items-start space-x-3 pt-4">
            <Checkbox
              id="terms"
              checked={formData.acceptedTerms}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, acceptedTerms: checked as boolean }))
              }
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p className="text-xs text-muted-foreground">
                By submitting this form, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              type="submit"
              className="bg-astro-purple hover:bg-astro-violet"
            >
              Register as Expert
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ExpertRegistrationForm;
