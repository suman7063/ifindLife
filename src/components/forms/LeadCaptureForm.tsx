
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface LeadCaptureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  type: 'business' | 'academic';
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  open,
  onOpenChange,
  title,
  type
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    organizationType: '',
    teamSize: '',
    requirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Insert lead data into database
      // Note: 'leads' table type will be available after running migration and regenerating types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          designation: formData.designation,
          organization_type: formData.organizationType || null,
          team_size: formData.teamSize || null,
          requirements: formData.requirements || null,
          type: type,
          status: 'new'
        });

      if (error) {
        console.error('Error saving lead:', error);
        toast.error('Failed to submit inquiry. Please try again.');
        return;
      }

      console.log('Lead form submitted and saved:', formData);
      toast.success('Thank you for your inquiry! We will contact you soon.');
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        designation: '',
        organizationType: '',
        teamSize: '',
        requirements: ''
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-visible" hideCloseButton>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-[-16px] top-[-16px] z-[101] flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Please fill in your details and we'll get back to you within 24 hours.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organization">
              {type === 'business' ? 'Company Name' : 'Institution Name'} *
            </Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              required
            />
          </div>

          {type === 'business' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizationType">Industry Type</Label>
                <Select 
                  value={formData.organizationType || ''} 
                  onValueChange={(value) => handleSelectChange('organizationType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
                    <SelectItem value="technology">Technology & IT</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail & E-commerce</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Select 
                  value={formData.teamSize || ''} 
                  onValueChange={(value) => handleSelectChange('teamSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {type === 'academic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizationType">Institution Type</Label>
                <Select 
                  value={formData.organizationType || ''} 
                  onValueChange={(value) => handleSelectChange('organizationType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="training">Training Institute</SelectItem>
                    <SelectItem value="online">Online Learning Platform</SelectItem>
                    <SelectItem value="vocational">Vocational Institute</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamSize">Student Population</Label>
                <Select 
                  value={formData.teamSize || ''} 
                  onValueChange={(value) => handleSelectChange('teamSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
                    <SelectItem value="1-100">1-100 students</SelectItem>
                    <SelectItem value="101-500">101-500 students</SelectItem>
                    <SelectItem value="501-1000">501-1000 students</SelectItem>
                    <SelectItem value="1001-5000">1001-5000 students</SelectItem>
                    <SelectItem value="5001-10000">5001-10000 students</SelectItem>
                    <SelectItem value="10000+">10000+ students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="requirements">Specific Requirements (Optional)</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="Tell us about your specific needs and goals..."
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
            Submit Inquiry
          </Button>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureForm;
