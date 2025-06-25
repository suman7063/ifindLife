
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Programs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Wellness Programs</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Structured programs designed for different audiences and needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Wellness Seekers</h3>
              <p className="text-gray-600 mb-6">
                Personal wellness programs for individuals seeking mental health support.
              </p>
              <Button asChild className="w-full">
                <Link to="/programs-for-wellness-seekers">Learn More</Link>
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Academic Institutes</h3>
              <p className="text-gray-600 mb-6">
                Tailored programs for educational institutions and students.
              </p>
              <Button asChild className="w-full">
                <Link to="/programs-for-academic-institutes">Learn More</Link>
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Business</h3>
              <p className="text-gray-600 mb-6">
                Corporate wellness programs for employee mental health.
              </p>
              <Button asChild className="w-full">
                <Link to="/programs-for-business">Learn More</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Programs;
