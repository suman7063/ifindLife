
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';

const Blog = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/lovable-uploads/35d6ff96-c06b-4787-84bc-64318cfa9fb0.png)' }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mental Health Blog</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover insights, tips, and stories about mental wellness from our experts
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <Container className="py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Coming Soon</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're working on bringing you valuable content about mental health and wellness. 
            Stay tuned for expert articles, tips, and insights.
          </p>
          <p className="text-gray-500">
            In the meantime, feel free to explore our services and connect with our experts.
          </p>
        </div>
      </Container>

      <Footer />
    </>
  );
};

export default Blog;
