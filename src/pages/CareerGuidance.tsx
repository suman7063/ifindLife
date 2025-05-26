
import React from 'react';
import NewNavbar from '@/components/NewNavbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/common/PageHeader';

const CareerGuidance = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NewNavbar />
      <PageHeader 
        title="Career Guidance" 
        subtitle="Navigate work stress, career transitions, and professional development"
      />

      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">How Career Counseling Can Help</h2>
            <p className="mb-6 text-gray-700">
              Career guidance can help you navigate work-related challenges, make informed decisions about 
              your professional path, and develop strategies for career advancement. Our experts provide 
              personalized support for various career-related issues:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Work Stress Management</h3>
                <p className="text-gray-600">Learn effective techniques to manage workplace stress, prevent burnout, and maintain work-life balance.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Career Transitions</h3>
                <p className="text-gray-600">Get support for changing careers, returning to work after a break, or adapting to new work environments.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Professional Development</h3>
                <p className="text-gray-600">Create actionable plans for skill development, advancement opportunities, and long-term career growth.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Workplace Relationships</h3>
                <p className="text-gray-600">Improve communication with colleagues, manage difficult workplace dynamics, and build a supportive network.</p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-lg mb-2">Ready to take the next step in your career?</h3>
              <p className="mb-4">Connect with one of our career guidance experts for personalized support.</p>
              <a href="/experts" className="inline-block px-4 py-2 bg-ifind-aqua text-white rounded hover:bg-ifind-aqua/90 transition-colors">
                Find an Expert
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CareerGuidance;
