import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import { ExpertCardData } from '@/components/expert-card/types';
import { Loader2 } from 'lucide-react';

const LifeCoachPage = () => {
  const { experts, loading, error } = usePublicExpertsData();

  // Filter experts by category
  const categoryExperts = experts.filter((expert: ExpertCardData) => 
    expert.category === 'life-coach'
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading experts: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
              Life Coaches
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our certified life coaches empower you to unlock your potential and achieve your goals. Whether you're navigating career transitions, 
              relationship challenges, or personal growth, our coaches provide the tools and support you need to create meaningful change.
            </p>
          </div>

          {/* What They Offer Section */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 mb-12 border">
            <h2 className="text-2xl font-semibold mb-6 text-center">What Life Coaches Offer</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-medium mb-2">Goal Achievement</h3>
                <p className="text-sm text-muted-foreground">Strategic planning and support to reach your personal and professional goals</p>
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2">Personal Development</h3>
                <p className="text-sm text-muted-foreground">Unlock your potential and develop new skills for success</p>
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2">Life Balance</h3>
                <p className="text-sm text-muted-foreground">Create harmony between work, relationships, and personal fulfillment</p>
              </div>
            </div>
          </div>

          {/* Experts Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-8 text-center">Available Life Coaches</h2>
            {categoryExperts.length > 0 ? (
              <ExpertsGrid experts={categoryExperts} loading={false} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No life coaches are currently available. Please check back soon or explore other expert categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LifeCoachPage;