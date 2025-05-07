
import React, { useState, useEffect } from 'react';
import ExpertDashboardAnalytics from './Analytics/ExpertDashboardAnalytics';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments } from '@/hooks/useAppointments';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AnalyticsTab: React.FC = () => {
  const { currentUser } = useUserAuth();
  const { fetchAppointments, loading } = useAppointments(currentUser);
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [clients, setClients] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      
      setDataLoading(true);
      try {
        // Fetch appointments
        const appointmentsData = await fetchAppointments();
        setAppointments(appointmentsData || []);
        
        // Extract unique clients from appointments
        const uniqueClients = Array.from(
          new Set(appointmentsData?.map((apt: any) => apt.user_id))
        ).map(userId => {
          const appointment = appointmentsData.find((apt: any) => apt.user_id === userId);
          return {
            id: userId,
            name: appointment?.user_name || 'Client'
          };
        });
        
        setClients(uniqueClients);
        
        // Calculate earnings from appointments
        // In a real app, you would fetch this from a dedicated earnings endpoint
        const calculatedEarnings = appointmentsData
          .filter((apt: any) => apt.status === 'completed')
          .map((apt: any) => ({
            id: apt.id,
            service: apt.service_name || 'Consultation',
            amount: 50, // Placeholder amount
            date: apt.appointment_date,
            user: apt.user_name || 'Client'
          }));
        
        setEarnings(calculatedEarnings);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    loadData();
  }, [currentUser, fetchAppointments]);
  
  if (loading || dataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div>
      {appointments.length > 0 ? (
        <ExpertDashboardAnalytics 
          appointments={appointments} 
          earnings={earnings} 
          clients={clients} 
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-medium mb-2">No Data Available Yet</h3>
            <p className="text-muted-foreground">
              Complete appointments to see analytics about your practice.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsTab;
