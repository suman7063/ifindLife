import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments } from '@/hooks/useAppointments';
import { Appointment } from '@/types/appointments';
import ExpertDashboardAnalytics from './Analytics/ExpertDashboardAnalytics';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AnalyticsTab = () => {
  const { currentUser } = useUserAuth();
  const { appointments, fetchAppointments, loading } = useAppointments(currentUser);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    completedAppointments: 0,
    uniqueClients: 0
  });

  useEffect(() => {
    const loadAppointments = async () => {
      await fetchAppointments();
    };

    if (currentUser) {
      loadAppointments();
    }
  }, [currentUser, fetchAppointments]);

  useEffect(() => {
    if (appointments) {
      const uniqueClientIds = new Set(appointments.map(apt => apt.user_id));
      
      setStats({
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
        confirmedAppointments: appointments.filter(apt => apt.status === 'confirmed').length,
        cancelledAppointments: appointments.filter(apt => apt.status === 'cancelled').length,
        completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
        uniqueClients: uniqueClientIds.size
      });
    }
  }, [appointments]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ExpertDashboardAnalytics label="Total Appointments" value={stats.totalAppointments} />
            <ExpertDashboardAnalytics label="Pending Appointments" value={stats.pendingAppointments} />
            <ExpertDashboardAnalytics label="Confirmed Appointments" value={stats.confirmedAppointments} />
            <ExpertDashboardAnalytics label="Cancelled Appointments" value={stats.cancelledAppointments} />
            <ExpertDashboardAnalytics label="Completed Appointments" value={stats.completedAppointments} />
             <ExpertDashboardAnalytics label="Unique Clients" value={stats.uniqueClients} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading appointment trends...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appointments} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis dataKey="appointment_date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="status" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
