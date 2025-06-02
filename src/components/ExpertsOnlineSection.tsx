
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ExpertCard from '@/components/expert-card/ExpertCard';
import { Expert } from '@/types/expert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ExpertsOnlineSection = () => {
  const [onlineExperts, setOnlineExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineExperts = async () => {
      try {
        const { data, error } = await supabase
          .from('experts')
          .select('*')
          .eq('isOnline', true)
          .eq('status', 'approved')
          .limit(3);

        if (error) {
          console.error('Error fetching online experts:', error);
          return;
        }

        setOnlineExperts(data || []);
      } catch (error) {
        console.error('Error fetching experts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineExperts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experts Currently Online</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center">
              Connect instantly with our mental health professionals who are available right now.
            </p>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-teal mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading online experts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (onlineExperts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experts Currently Online</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center">
              Connect instantly with our mental health professionals who are available right now.
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-6">No experts are currently online. Please check back later or browse all our experts.</p>
            <Button asChild className="bg-ifind-teal hover:bg-ifind-teal/90 text-white">
              <Link to="/experts" onClick={() => window.scrollTo(0, 0)}>
                View All Experts
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Experts Currently Online</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center">
            Connect instantly with our mental health professionals who are available right now.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {onlineExperts.map((expert) => (
            <div key={expert.id} className="h-full">
              <ExpertCard expert={expert} />
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild className="bg-ifind-teal hover:bg-ifind-teal/90 text-white">
            <Link to="/experts" onClick={() => window.scrollTo(0, 0)}>
              View All Experts
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExpertsOnlineSection;
