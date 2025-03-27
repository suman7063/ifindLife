
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { ReferralUI, ReferralSettings } from '@/types/supabase';
import { fetchReferralSettings, fetchUserReferrals } from '@/utils/referralUtils';
import ReferralCard from '@/components/user/ReferralCard';
import ReferralsList from '@/components/user/ReferralsList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const UserReferrals: React.FC = () => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const [referrals, setReferrals] = useState<ReferralUI[]>([]);
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadReferrals = async () => {
      if (currentUser?.id) {
        setIsLoading(true);
        try {
          const data = await fetchUserReferrals(currentUser.id);
          setReferrals(data);
        } catch (error) {
          console.error("Error loading referrals:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const loadSettings = async () => {
      try {
        const data = await fetchReferralSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error loading referral settings:", error);
      }
    };

    loadReferrals();
    loadSettings();
  }, [currentUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <Link to="/user-dashboard">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gradient mb-2">Your Referral Program</h1>
            <p className="text-gray-600">
              Invite friends to iFindLife and earn rewards when they make their first purchase.
            </p>
          </div>

          {currentUser && <ReferralCard userProfile={currentUser} settings={settings} />}
          
          <div className="mt-8">
            <ReferralsList referrals={referrals} isLoading={isLoading} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserReferrals;
