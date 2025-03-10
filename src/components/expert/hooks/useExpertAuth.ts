
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ExpertFormData, ReportUserType } from '../types';

type ExpertAuthReturnType = {
  expert: ExpertFormData | null;
  loading: boolean;
  reportUser: (report: Omit<ReportUserType, 'id' | 'date' | 'status'>) => void;
};

export const useExpertAuth = (): ExpertAuthReturnType => {
  const [expert, setExpert] = useState<ExpertFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const expertEmail = localStorage.getItem('ifindlife-expert-email');
    if (expertEmail) {
      try {
        const experts = JSON.parse(localStorage.getItem('ifindlife-experts') || '[]');
        const currentExpert = experts.find((e: ExpertFormData) => e.email === expertEmail);
        if (currentExpert) {
          setExpert(currentExpert);
        } else {
          toast.error('Expert data not found. Please login again.');
          localStorage.removeItem('ifindlife-expert-email');
          navigate('/expert-login');
        }
      } catch (error) {
        console.error('Error loading expert data:', error);
        toast.error('Error loading your data. Please login again.');
        localStorage.removeItem('ifindlife-expert-email');
        navigate('/expert-login');
      }
    } else {
      navigate('/expert-login');
    }
    setLoading(false);
  }, [navigate]);

  const reportUser = (reportData: Omit<ReportUserType, 'id' | 'date' | 'status'>) => {
    if (!expert) {
      toast.error('You must be logged in to report a user');
      return;
    }

    const newReport: ReportUserType = {
      id: `report_${Date.now()}`,
      date: new Date().toISOString(),
      status: 'pending',
      ...reportData
    };

    try {
      const experts = JSON.parse(localStorage.getItem('ifindlife-experts') || '[]');
      const updatedExperts = experts.map((e: ExpertFormData) => {
        if (e.id === expert.id) {
          return {
            ...e,
            reportedUsers: [...(e.reportedUsers || []), newReport]
          };
        }
        return e;
      });

      localStorage.setItem('ifindlife-experts', JSON.stringify(updatedExperts));
      
      // Update local state
      setExpert({
        ...expert,
        reportedUsers: [...(expert.reportedUsers || []), newReport]
      });
      
      toast.success('User reported successfully');
    } catch (error) {
      console.error('Error reporting user:', error);
      toast.error('Failed to report user. Please try again.');
    }
  };

  return { expert, loading, reportUser };
};
