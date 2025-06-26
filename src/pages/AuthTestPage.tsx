
import React from 'react';
import { Container } from '@/components/ui/container';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthTestSuite from '@/components/auth/AuthTestSuite';
import { Helmet } from 'react-helmet-async';

const AuthTestPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Authentication Test Suite | iFindLife</title>
      </Helmet>
      
      <Navbar />
      
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Authentication System Test Suite</h1>
            <p className="text-gray-600">
              Comprehensive testing interface for the simplified authentication system.
            </p>
          </div>
          
          <AuthTestSuite />
        </div>
      </Container>
      
      <Footer />
    </>
  );
};

export default AuthTestPage;
