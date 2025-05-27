
import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface ProfileSetupPlaceholderProps {
  user: User | null;
  handleLogout: () => Promise<void>;
  isTimedOut?: boolean;
}

const ProfileSetupPlaceholder: React.FC<ProfileSetupPlaceholderProps> = ({ 
  user, 
  handleLogout, 
  isTimedOut = false 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Welcome, {user?.email?.split('@')[0] || 'User'}!</h1>
            <p className="text-gray-600">{isTimedOut ? "We're still retrieving your profile data." : "Your profile is being set up."}</p>
          </div>
          
          <Card className="border-ifind-aqua/10 p-6">
            <CardTitle className="mb-4 flex items-center">
              Setting Up Your Profile
              {!isTimedOut && <Loader2 className="animate-spin ml-2 h-4 w-4" />}
            </CardTitle>
            <CardDescription className="text-base">
              {isTimedOut 
                ? "We're taking a bit longer than expected to load your profile. This could happen when you've just registered or logged in for the first time. You can wait a moment or try refreshing the page."
                : "We're currently setting up your user profile. This may take a moment. If this persists, please try logging out and logging back in."}
            </CardDescription>
            <div className="flex space-x-4 mt-6">
              {isTimedOut ? (
                <>
                  <Button onClick={() => window.location.reload()} className="bg-ifind-aqua hover:bg-ifind-teal transition-colors">
                    Refresh Page
                  </Button>
                  <Button onClick={handleLogout} variant="outline">Logout</Button>
                </>
              ) : (
                <Button onClick={handleLogout} className="mt-6 bg-ifind-aqua hover:bg-ifind-teal transition-colors">Logout</Button>
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSetupPlaceholder;
