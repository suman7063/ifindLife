import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import { ExpertCardData } from '@/components/expert-card/types';
import { Loader2 } from 'lucide-react';

const ListeningVolunteerPage = () => {
  const { experts, loading, error } = usePublicExpertsData();

  // Filter experts by category
  const categoryExperts = experts.filter((expert: ExpertCardData) => 
    expert.category === 'listening-volunteer'
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
            Listening Volunteers
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our compassionate listening volunteers provide a safe, non-judgmental space for you to share your thoughts and feelings. 
            They are trained to offer emotional support through active listening, helping you process your experiences and find clarity.
          </p>
        </div>

        {/* What They Offer Section */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 mb-12 border">
          <h2 className="text-2xl font-semibold mb-6 text-center">What Listening Volunteers Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-medium mb-2">Emotional Support</h3>
              <p className="text-sm text-muted-foreground">A caring ear when you need someone to listen without judgment</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-2">Safe Space</h3>
              <p className="text-sm text-muted-foreground">Confidential conversations in a supportive environment</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-2">Active Listening</h3>
              <p className="text-sm text-muted-foreground">Trained volunteers who focus entirely on understanding your perspective</p>
            </div>
          </div>
        </div>

        {/* Experts Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">Available Listening Volunteers</h2>
          {categoryExperts.length > 0 ? (
            <ExpertsGrid experts={categoryExperts} loading={false} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No listening volunteers are currently available. Please check back soon or explore other expert categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeningVolunteerPage;