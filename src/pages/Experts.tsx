
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import SearchSort from '@/components/experts/SearchSort';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';

const Experts = () => {
  const { experts, loading, error } = usePublicExpertsData();

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
              <ExpertsGrid experts={experts} loading={loading} />
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Experts;
