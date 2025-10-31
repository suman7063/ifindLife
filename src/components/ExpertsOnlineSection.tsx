
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExpertCard from '@/components/expert-card';
import UnifiedExpertConnection from '@/components/expert-connection/UnifiedExpertConnection';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { supabase } from '@/integrations/supabase/client';

const ENABLE_POLLING = (import.meta as any).env?.VITE_PRESENCE_POLLING === 'true';

const ExpertsOnlineSection: React.FC = () => {
  const navigate = useNavigate();
  const { experts: allExperts, loading } = usePublicExpertsData();
  const { bulkCheckPresence, getExpertPresence, version } = useExpertPresence();
  
  const approvedExperts = allExperts.filter(expert => expert.dbStatus === 'approved');

  const { onlineExperts, offlineExperts } = useMemo(() => {
    const online: typeof approvedExperts = [];
    const offline: typeof approvedExperts = [];
    for (const e of approvedExperts) {
      const presence = getExpertPresence(String(e.id));
      const isOnline = presence?.status === 'available' && presence?.acceptingCalls === true;
      if (isOnline) online.push(e); else offline.push(e);
    }
    return { onlineExperts: online, offlineExperts: offline };
  }, [approvedExperts, version, getExpertPresence]);
  
  const displayExperts = [...onlineExperts, ...offlineExperts].slice(0, 3);

  useEffect(() => {
    if (displayExperts.length === 0) return;
    const ids = displayExperts.map(e => String(e.id));
    bulkCheckPresence(ids);
  }, [displayExperts.map(e => e.id).join(','), bulkCheckPresence]);

  useEffect(() => {
    const channel = supabase
      .channel('home-presence-refresh')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expert_presence' }, async () => {
        if (displayExperts.length === 0) return;
        const ids = displayExperts.map(e => String(e.id));
        await bulkCheckPresence(ids);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [displayExperts.map(e => e.id).join(','), bulkCheckPresence]);

  useEffect(() => {
    if (!ENABLE_POLLING) return;
    if (displayExperts.length === 0) return;
    const ids = displayExperts.map(e => String(e.id));

    const onFocus = () => bulkCheckPresence(ids);
    const onVisibility = () => { if (!document.hidden) bulkCheckPresence(ids); };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    const intervalId = setInterval(() => bulkCheckPresence(ids), 5000);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(intervalId);
    };
  }, [displayExperts.map(e => e.id).join(','), bulkCheckPresence]);

  return (
    <UnifiedExpertConnection serviceTitle="Expert Consultation" serviceId="consultation">
      {({ state, handleExpertCardClick, handleConnectNow, handleBookNow, handleChat, handleShowConnectOptions }) => (
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
                      onChat={() => handleChat(expert)}
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
