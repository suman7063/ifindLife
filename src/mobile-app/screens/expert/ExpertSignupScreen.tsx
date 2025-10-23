import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Mail, Lock, User, Phone, MapPin, Briefcase, Languages } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const expertCategories = [
  { id: 'listening-volunteer', name: 'Listening Volunteer' },
  { id: 'listening-expert', name: 'Listening Expert' },
  { id: 'mindfulness-coach', name: 'Mindfulness Coach' },
  { id: 'mindfulness-expert', name: 'Mindfulness Expert' },
  { id: 'spiritual-mentor', name: 'Spiritual Mentor' }
];

export const ExpertSignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    title: '',
    experience: '',
    languages: '',
    bio: '',
    expertCategory: 'listening-volunteer',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (formData.bio.length < 50) {
      toast.error('Bio should be at least 50 characters');
      return;
    }

    setIsSubmitting(true);
    
    // Mock signup - simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Registration successful! Your application is pending approval. Please wait for admin approval before logging in.');
      setTimeout(() => {
        navigate('/mobile-app/expert-auth/login');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/mobile-app/expert-auth/login')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-3">Expert Registration</h1>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 pb-10">
          <Card className="border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Become an Expert</CardTitle>
              <CardDescription>Fill in all details to register</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Personal Info */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Dr. Sarah Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="expert@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Address Info */}
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  placeholder="United States"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>

              {/* Professional Info */}
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="title"
                    placeholder="Licensed Therapist"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  placeholder="5"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages *</Label>
                <div className="relative">
                  <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="languages"
                    placeholder="English, Spanish, French"
                    value={formData.languages}
                    onChange={(e) => setFormData({...formData, languages: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (min 50 characters) *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your experience, qualifications, and approach..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length}/50 characters
                </p>
              </div>

              {/* Expert Category */}
              <div className="space-y-2">
                <Label>Expert Category *</Label>
                <RadioGroup
                  value={formData.expertCategory}
                  onValueChange={(value) => setFormData({...formData, expertCategory: value})}
                  className="space-y-2"
                >
                  {expertCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={category.id} id={category.id} />
                      <Label htmlFor={category.id} className="font-normal">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start space-x-2 py-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, termsAccepted: checked as boolean})
                  }
                />
                <Label 
                  htmlFor="terms" 
                  className="text-sm font-normal leading-tight cursor-pointer"
                >
                  I accept the terms and conditions and privacy policy *
                </Label>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-ifind-teal to-ifind-aqua hover:from-ifind-teal/90 hover:to-ifind-aqua/90"
                onClick={handleSignup}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/mobile-app/expert-auth/login')}
                  className="text-ifind-teal font-medium hover:underline"
                >
                  Login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
