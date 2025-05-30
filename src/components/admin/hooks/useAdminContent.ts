
import { useState, useEffect } from 'react';
import { Expert } from '@/components/admin/experts/types';

export const useAdminContentData = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRefresh = () => {
    console.log('Admin content refresh requested');
    // This would typically fetch fresh data from your API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Admin content refreshed');
    }, 1000);
  };

  return {
    experts,
    setExperts,
    services,
    setServices,
    testimonials,
    setTestimonials,
    loading,
    error,
    onRefresh
  };
};
