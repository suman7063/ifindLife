import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import { ExpertCardData } from '@/components/expert-card/types';
import { Loader2 } from 'lucide-react';

const SpiritualMentorPage = () => {
  const { experts, loading, error } = usePublicExpertsData();

  // Filter experts by category
  const categoryExperts = experts.filter((expert: ExpertCardData) => 
    expert.category === 'spiritual-mentor'
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Spiritual Mentors
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experienced spiritual guides who support your journey of inner growth and self-discovery. 
            They offer wisdom from various spiritual traditions to help you find meaning, purpose, and connection in your life.
          </p>
        </div>

        {/* What They Offer Section */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 mb-12 border">
          <h2 className="text-2xl font-semibold mb-6 text-center">What Spiritual Mentors Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-medium mb-2">Spiritual Guidance</h3>
              <p className="text-sm text-muted-foreground">Wisdom and insights from diverse spiritual traditions and practices</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-2">Purpose & Meaning</h3>
              <p className="text-sm text-muted-foreground">Support in discovering your life's purpose and deeper meaning</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-2">Inner Growth</h3>
              <p className="text-sm text-muted-foreground">Guidance for personal transformation and spiritual development</p>
            </div>
          </div>
        </div>

        {/* Experts Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">Available Spiritual Mentors</h2>
          {categoryExperts.length > 0 ? (
            <ExpertsGrid experts={categoryExperts} loading={false} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No spiritual mentors are currently available. Please check back soon or explore other expert categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpiritualMentorPage;