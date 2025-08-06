
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AgoraCallModal from '@/components/AgoraCallModal';

import { toast } from 'sonner';
import { useAuthRedirectSystem } from '@/hooks/useAuthRedirectSystem';
import { useFetchExpertProfile } from '@/contexts/auth/hooks/useFetchExpertProfile';
import ExpertHeader from '@/components/expert/ExpertHeader';
import ExpertProfile from '@/components/expert/ExpertProfile';
import ExpertDetailTabs from '@/components/expert/ExpertDetailTabs';

const ExpertDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  const { executeIntendedAction, isAuthenticated } = useAuthRedirectSystem();
  
  // Define handler functions early to avoid temporal dead zone errors
  const handleBookClick = () => {
    const tabElement = document.getElementById('booking-tab');
    if (tabElement) {
      tabElement.click();
    }
  };
  
  const handleCallClick = () => {
    // This will be properly defined after expert state is loaded
    const tabElement = document.getElementById('call-action');
    if (tabElement) {
      tabElement.click();
    }
  };
  
  
  useEffect(() => {
    if (searchParams.get('call') === 'true') {
      setIsCallModalOpen(true);
    }
    if (searchParams.get('book') === 'true') {
      // Activate the booking tab automatically
      handleBookClick();
    }
  }, [searchParams]);

  // Check for pending actions after user returns from login
  useEffect(() => {
    if (isAuthenticated) {
      const pendingAction = executeIntendedAction();
      if (pendingAction) {
        console.log('ExpertDetail: Executing pending action:', pendingAction);
        
        // Execute the appropriate action based on the pending action type
        if (pendingAction.action === 'call') {
          setIsCallModalOpen(true);
        } else if (pendingAction.action === 'book') {
          handleBookClick();
        }
      }
    }
  }, [isAuthenticated]);
  
  // Fetch real expert data using the useFetchExpertProfile hook
  const { fetchExpertProfile } = useFetchExpertProfile();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpert = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const expertData = await fetchExpertProfile(id);
        if (expertData) {
          // Transform database expert to component format
          const transformedExpert = {
            id: expertData.id || id,
            name: expertData.name || "Expert",
            experience: parseInt(expertData.experience || "0"),
            specialties: expertData.specialization ? [expertData.specialization] : ["General Counseling"],
            rating: expertData.average_rating || 4.5,
            consultations: 100, // TODO: Get from actual sessions count
            price: 30, // TODO: Get from service pricing
            waitTime: "Available",
            imageUrl: expertData.profile_picture || "",
            online: expertData.status === 'approved',
            languages: ["English"], // TODO: Get from expert profile
            description: expertData.bio || "This expert is available for consultation.",
            education: "Professional Qualifications", // TODO: Get from expert profile
            reviews: [] // TODO: Get from reviews table
          };
          setExpert(transformedExpert);
        }
      } catch (error) {
        console.error('Error loading expert:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExpert();
  }, [id, fetchExpertProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <ExpertHeader />
        <main className="flex-1 py-8">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <ExpertHeader />
        <main className="flex-1 py-8">
          <div className="container">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold mb-4">Expert Not Found</h1>
              <p className="text-gray-600 mb-8">The expert you're looking for doesn't exist or is no longer available.</p>
              <button 
                onClick={() => window.history.back()} 
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Update the handler functions with expert data once loaded
  const handleCallClickWithExpert = () => {
    if (expert?.online && expert?.waitTime === "Available") {
      setIsCallModalOpen(true);
    } else {
      toast.error("Expert Unavailable", {
        description: "This expert is currently offline or busy. Please try again later."
      });
    }
  };
  
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ExpertHeader />
      
      <main className="flex-1 py-8 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Enhanced Header Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-xl border border-primary/20">
              <h1 className="text-3xl font-bold text-primary mb-2">Expert Profile</h1>
              <p className="text-muted-foreground">Connect with {expert.name} for professional guidance and support</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ExpertProfile 
                  expert={expert} 
                  onCallClick={handleCallClickWithExpert}
                  onBookClick={handleBookClick}
                />
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <ExpertDetailTabs expert={expert} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <AgoraCallModal 
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        expert={{
          id: expert.id,
          name: expert.name,
          imageUrl: expert.imageUrl,
          price: expert.price
        }}
      />
      
    </div>
  );
};

export default ExpertDetail;
