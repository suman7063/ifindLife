
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserCallInterface from '@/components/call/UserCallInterface';

import { toast } from 'sonner';
import { useAuthRedirectSystem } from '@/hooks/useAuthRedirectSystem';
import { useFetchExpertProfile } from '@/contexts/auth/hooks/useFetchExpertProfile';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import ExpertProfile from '@/components/expert/ExpertProfile';
import ExpertDetailTabs from '@/components/expert/ExpertDetailTabs';

const ExpertDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
  const { checkExpertPresence, getExpertPresence } = useExpertPresence();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expertAuthId, setExpertAuthId] = useState(null);

  useEffect(() => {
    const loadExpert = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const expertData = await fetchExpertProfile(id);
        if (expertData) {
          console.log('Fetching expert profile for user ID:', expertData.auth_id);
          setExpertAuthId(expertData.auth_id);
          
          // Check presence status for this expert
          const presenceData = await checkExpertPresence(expertData.auth_id);
          console.log('Expert presence data:', presenceData);
          
          const isAvailable = presenceData.status === 'available' && presenceData.acceptingCalls;
          
          // Transform database expert to component format with real presence data
          const transformedExpert = {
            id: expertData.id || id,
            auth_id: expertData.auth_id,
            name: expertData.name || "Expert",
            experience: parseInt(expertData.experience || "0"),
            specialties: expertData.specialization ? [expertData.specialization] : ["General Counseling"],
            rating: expertData.average_rating || 4.5,
            consultations: 100, // TODO: Get from actual sessions count
            price: 30, // TODO: Get from service pricing
            waitTime: isAvailable ? 'Available Now' : 
                     presenceData.status === 'away' ? 'Away' : 'Not Available',
            imageUrl: expertData.profile_picture ? `https://jrkjdiefnvgrfpjvnjng.supabase.co/storage/v1/object/public/avatars/${expertData.profile_picture}` : "",
            online: expertData.status === 'approved' && isAvailable,
            languages: expertData.languages || ["English"],
            description: expertData.bio || "This expert is available for consultation.",
            education: "Professional Qualifications", // TODO: Get from expert profile
            reviews: [], // TODO: Get from reviews table
            category: expertData.category
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
  }, [id, fetchExpertProfile, checkExpertPresence]);
  
  // Update expert status when presence changes
  useEffect(() => {
    if (expert && expertAuthId) {
      const presenceData = getExpertPresence(expertAuthId);
      if (presenceData) {
        const isAvailable = presenceData.status === 'available' && presenceData.acceptingCalls;
        setExpert(prev => ({
          ...prev,
          online: prev.online && isAvailable,
          waitTime: isAvailable ? 'Available Now' : 
                   presenceData.status === 'away' ? 'Away' : 'Not Available'
        }));
      }
    }
  }, [expert, expertAuthId, getExpertPresence]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
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
    if (expert?.online && expert?.waitTime === "Available Now") {
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
      
      <main className="flex-1 py-8 bg-ifind-offwhite">
        <div className="container max-w-7xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
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
      
      <UserCallInterface 
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        expertId={expert.id}
        expertAuthId={expert.auth_id || expert.id}
        expertName={expert.name}
        expertAvatar={expert.imageUrl}
        expertPrice={expert.price}
      />
      
    </div>
  );
};

export default ExpertDetail;
