
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExpertCard from '@/components/expert-card';
import UnifiedExpertConnection from '@/components/expert-connection/UnifiedExpertConnection';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';

const ExpertsOnlineSection: React.FC = () => {
  const navigate = useNavigate();
  const { experts: allExperts, loading } = usePublicExpertsData();
  const { getExpertPresence } = useExpertPresence();
  
  // Presence checking is now handled by useOptimizedExpertData

  // Show online experts first, then last online experts, ensuring 3 experts total
  const approvedExperts = allExperts.filter(expert => expert.dbStatus === 'approved');
  
  // Separate online and offline experts
  const onlineExperts = approvedExperts.filter(expert => {
    const presence = getExpertPresence(expert.auth_id || expert.id);
    return presence?.isAvailable;
  });
  
  const offlineExperts = approvedExperts.filter(expert => {
    const presence = getExpertPresence(expert.auth_id || expert.id);
    return !presence?.isAvailable;
  });
  
  // Sort offline experts by last seen (most recent first)
  const sortedOfflineExperts = offlineExperts.sort((a, b) => {
    const presenceA = getExpertPresence(a.auth_id || a.id);
    const presenceB = getExpertPresence(b.auth_id || b.id);
    return new Date(presenceB?.lastActivity || 0).getTime() - new Date(presenceA?.lastActivity || 0).getTime();
  });
  
  // Combine online first, then offline (last seen), and take first 3
  const displayExperts = [...onlineExperts, ...sortedOfflineExperts].slice(0, 3);

  return (
    <UnifiedExpertConnection serviceTitle="Expert Consultation" serviceId="consultation">
      {({ state, handleExpertCardClick, handleConnectNow, handleBookNow, handleShowConnectOptions }) => (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 sm:px-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-center">Experts Currently Online</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-center">
                Connect instantly with our available experts for immediate guidance and support
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-md p-4 h-64 animate-pulse flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="ml-3 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-end">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayExperts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayExperts.map(expert => (
                  <div key={expert.id} className="flex">
                    <ExpertCard
                      expert={expert}
                      onClick={() => handleExpertCardClick(expert)}
                      onConnectNow={(type) => handleConnectNow(expert, type)}
                      onBookNow={() => handleBookNow(expert)}
                      showConnectOptions={state.expertConnectOptions[expert.id.toString()] || false}
                      onShowConnectOptions={(show) => handleShowConnectOptions(expert.id.toString(), show)}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-8">
                  No experts are currently online. Please check back later or browse all experts.
                </p>
              </div>
            )}
            
            <div className="text-center mt-8">
              <Button onClick={() => navigate("/experts")} className="bg-ifind-teal hover:bg-ifind-teal/90 text-white">
                View All Experts
              </Button>
            </div>
          </div>
        </section>
      )}
    </UnifiedExpertConnection>
  );
};

export default ExpertsOnlineSection;
