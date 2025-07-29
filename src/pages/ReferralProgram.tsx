import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/contexts/auth/hooks/useUserAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Gift, Users, Star, TrendingUp, BookOpen, Video, Calendar, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { getReferralLink, copyReferralLink, fetchReferralSettings } from '@/utils/referralUtils';
import { ReferralSettings } from '@/types/supabase';

const ReferralProgram = () => {
  const { user } = useUserAuth();
  const [referralSettings, setReferralSettings] = useState<ReferralSettings | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadReferralSettings = async () => {
      const settings = await fetchReferralSettings();
      setReferralSettings(settings);
    };
    loadReferralSettings();
  }, []);

  const handleCopyReferralLink = () => {
    if (!user?.referral_code) {
      toast.error('Please complete your profile to get your referral code');
      return;
    }

    const referralLink = getReferralLink(user.referral_code);
    const success = copyReferralLink(referralLink);
    
    if (success) {
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy referral link');
    }
  };

  const referralLink = user?.referral_code ? getReferralLink(user.referral_code) : '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header Band */}
      <div className="bg-gradient-to-r from-ifind-aqua/20 via-ifind-purple/20 to-ifind-teal/20 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-ifind-aqua via-ifind-purple to-ifind-teal bg-clip-text text-transparent">
            You Care when you Share
          </h1>
        </div>
      </div>
      
      <main className="flex-1 bg-gradient-subtle">
        <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Referral Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share the gift of wellness and earn rewards when your friends join our community
          </p>
        </div>

        {/* How It Works Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Share Your Link</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share your unique referral link with friends and family who could benefit from our wellness services.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>They Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                When someone signs up using your referral link, they become part of our wellness community.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Earn Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Both you and your friend earn reward points that can be used for our wellness services.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Points Benefits Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">What Can You Do With Your Points?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your reward points unlock exclusive wellness experiences and learning opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access premium wellness courses and educational content with your points
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">One-on-One Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Book personalized wellness sessions with our expert practitioners
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Webinar Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Join live webinars and interactive wellness workshops
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-lg">Exclusive Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get invites to exclusive wellness events and community gatherings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rewards Information */}
        {referralSettings && referralSettings.active && (
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Reward Details</CardTitle>
              <CardDescription>Here's what you and your friends can earn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">You Earn</h3>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {referralSettings.referrer_reward} Points
                  </p>
                  <p className="text-sm text-muted-foreground">
                    When someone signs up using your referral code
                  </p>
                </div>
                <div className="text-center p-6 bg-secondary/5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Your Friend Earns</h3>
                  <p className="text-3xl font-bold text-secondary mb-2">
                    {referralSettings.referred_reward} Points
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Welcome bonus for joining our community
                  </p>
                </div>
              </div>
              {referralSettings.description && (
                <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                  <p className="text-center text-muted-foreground">
                    {referralSettings.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Referral Link Section */}
        {user ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this link with friends to start earning rewards together
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.referral_code ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleCopyReferralLink}
                      variant={copied ? "default" : "outline"}
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Your referral code: <span className="font-mono font-semibold">{user.referral_code}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Complete your profile to get your unique referral code
                  </p>
                  <Button asChild>
                    <a href="/user-dashboard/profile">Complete Profile</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Join Our Referral Program</CardTitle>
              <CardDescription>
                Sign up or log in to start sharing and earning rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Create an account to get your unique referral link and start earning reward points for every friend you invite.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="/user-signup">Sign Up</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/user-login">Log In</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Program Inactive Notice */}
        {referralSettings && !referralSettings.active && (
          <Card className="max-w-2xl mx-auto mt-8">
            <CardContent className="text-center py-8">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Referral Program Temporarily Unavailable</h3>
              <p className="text-muted-foreground">
                Our referral program is currently paused. Please check back soon for updates!
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReferralProgram;