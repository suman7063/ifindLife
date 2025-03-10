
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExpertProfileEdit from '@/components/expert/ExpertProfileEdit';
import UserReports from '@/components/expert/UserReports';
import { useExpertAuth } from '@/components/expert/hooks/useExpertAuth';
import { User } from '@/contexts/UserAuthContext';

const ExpertDashboard = () => {
  const { expert, loading } = useExpertAuth();
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    // Load users from localStorage for reporting functionality
    const storedUsers = localStorage.getItem('ifindlife-users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.error("Error loading users:", e);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="text-center py-10">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="text-center py-10">
            You are not logged in. Please log in to access the expert dashboard.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedUsers = users.map(user => ({
    id: user.id,
    name: user.name
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">Expert Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Manage your professional profile and client interactions
        </p>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 md:w-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="reports">User Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ExpertProfileEdit />
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
              <p className="text-muted-foreground">
                You have no upcoming appointments.
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="earnings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
              <p className="text-muted-foreground">
                Your earnings information will be displayed here.
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <UserReports users={formattedUsers} />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <p className="text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertDashboard;
