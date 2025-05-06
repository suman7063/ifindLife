
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import ExpertRegistrationForm from '@/components/expert/ExpertRegistrationForm';
import { Container } from '@/components/ui/container';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const ExpertRegister: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // First, check if there's an active session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        toast.error('Please log out of your current session before registering as an expert.');
        return false;
      }
      
      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            user_type: 'expert'
          }
        }
      });
      
      if (authError) {
        console.error('Registration auth error:', authError);
        toast.error(authError.message);
        return false;
      }
      
      if (!authData.user || !authData.session) {
        toast.error('Registration failed. No user created.');
        return false;
      }
      
      // Format data for expert profile
      const expertData = {
        auth_id: authData.user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        country: formData.country || '',
        specialization: formData.specialization || '',
        experience: String(formData.experience || ''),
        bio: formData.bio || '',
        certificate_urls: formData.certificateUrls || [],
        selected_services: formData.selectedServices || [],
        status: 'pending'
      };
      
      // Create expert profile
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert([expertData]);
      
      if (profileError) {
        console.error('Registration profile error:', profileError);
        toast.error(profileError.message);
        
        // Clean up - sign out the created auth account
        await supabase.auth.signOut();
        return false;
      }
      
      // Sign out and redirect to login page
      await supabase.auth.signOut();
      
      toast.success('Registration successful! Your account is pending approval.');
      navigate('/expert-login?status=registered');
      return true;
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'An unexpected error occurred during registration');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader 
        title="Expert Registration" 
        subtitle="Join our network of mental health professionals" 
      />
      <main className="flex-1 py-16">
        <Container className="max-w-4xl">
          <Card className="border-ifind-lavender/20 shadow-xl">
            <CardContent className="pt-6 px-6 md:p-8">
              <h1 className="text-2xl font-bold text-center mb-6">Expert Registration</h1>
              <p className="text-center text-gray-600 mb-8">
                Complete the form below to register as an expert. Our team will review your application and contact you shortly.
              </p>
              
              <ExpertRegistrationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </CardContent>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertRegister;
