
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import SearchSort from '@/components/experts/SearchSort';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';

const Experts = () => {
  const { experts, loading, error } = usePublicExpertsData();
  const [sortedExperts, setSortedExperts] = React.useState(experts);

  React.useEffect(() => {
    setSortedExperts(experts);
  }, [experts]);

  const handleSortChange = (sortBy: string) => {
    const sorted = [...experts].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'reviews':
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        default:
          return 0;
      }
    });
    setSortedExperts(sorted);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Experts</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with qualified professionals who are here to support your wellness journey.
            </p>
          </div>
          
          {error && (
            <div className="text-center mb-8">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
            </div>
          )}
          
          {experts.length === 0 && !loading && !error && (
            <div className="text-center">
              <p className="text-gray-600 mb-8">
                No experts are currently available. Please check back soon to browse and connect with our qualified professionals.
              </p>
            </div>
          )}
          
          {loading && (
            <div className="text-center">
              <p className="text-gray-600">Loading experts...</p>
            </div>
          )}
          
          {experts.length > 0 && (
            <div className="space-y-6">
              <SearchSort 
                expertCount={experts.length} 
                onToggleFilters={() => {}} 
                showFilters={false} 
                onSortChange={handleSortChange}
              />
              <ExpertsGrid experts={sortedExperts} loading={loading} />
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Experts;
