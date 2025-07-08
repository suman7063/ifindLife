import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import ProductionTestingSuite from '@/components/testing/ProductionTestingSuite';
import ProductionErrorBoundary from '@/components/common/ProductionErrorBoundary';

const ProductionDashboard: React.FC = () => {
  return (
    <ProductionErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-20">
          <Container>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Production Dashboard
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive testing and monitoring for the integrated booking and calling system
              </p>
            </div>
            <ProductionTestingSuite />
          </Container>
        </div>
        <Footer />
      </div>
    </ProductionErrorBoundary>
  );
};

export default ProductionDashboard;