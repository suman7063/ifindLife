
import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import { Heart, Shield, Zap } from 'lucide-react';

const HomepageIssueSessions = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">IFL Programs for Individuals</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our specialized mental wellness programs designed to support your personal growth and wellbeing journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/programs-for-wellness-seekers#quick-ease" className="block">
            <CategoryCard
              icon={<Heart className="w-8 h-8 text-white" />}
              title="QuickEase Programs"
              description="Fast-acting mental wellness solutions for immediate relief and stress management"
              href="/programs-for-wellness-seekers#quick-ease"
              color="bg-gray-100"
              textColor="text-gray-800"
              cardStyle="program"
            />
          </Link>
          
          <Link to="/programs-for-wellness-seekers#resilience-building" className="block">
            <CategoryCard
              icon={<Shield className="w-8 h-8 text-white" />}
              title="Emotional Resilience"
              description="Build lasting emotional strength and resilience to navigate life's challenges"
              href="/programs-for-wellness-seekers#resilience-building"
              color="bg-gray-100"
              textColor="text-gray-800"
              cardStyle="program"
            />
          </Link>
          
          <Link to="/programs-for-wellness-seekers#super-human" className="block">
            <CategoryCard
              icon={<Zap className="w-8 h-8 text-white" />}
              title="Super Human Life"
              description="Unlock your full potential and achieve peak mental performance and wellbeing"
              href="/programs-for-wellness-seekers#super-human"
              color="bg-gray-100"
              textColor="text-gray-800"
              cardStyle="program"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomepageIssueSessions;
