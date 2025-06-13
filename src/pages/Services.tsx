
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';

const Services = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of wellness services designed to support your mental, emotional, and spiritual well-being.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">Heart2Heart Listening</h3>
              <p className="text-gray-600 mb-4">
                Compassionate listening sessions to help you process your thoughts and feelings.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">Therapy Sessions</h3>
              <p className="text-gray-600 mb-4">
                Professional therapy sessions with licensed mental health professionals.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">Life Coaching</h3>
              <p className="text-gray-600 mb-4">
                Goal-oriented coaching to help you achieve your personal and professional objectives.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">Guided Meditations</h3>
              <p className="text-gray-600 mb-4">
                Structured meditation sessions to promote relaxation and mindfulness.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">Offline Retreats</h3>
              <p className="text-gray-600 mb-4">
                Immersive retreat experiences for deep healing and personal growth.
              </p>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Services;
