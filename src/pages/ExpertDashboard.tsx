
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Calendar, Users, MessageSquare, Settings, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const [expert, setExpert] = useState<any>(null);
  
  useEffect(() => {
    // Check if expert is logged in
    const storedExpert = localStorage.getItem('ifindlife-expert-auth');
    
    if (!storedExpert) {
      toast.error('You must be logged in to view this page');
      navigate('/expert-login');
      return;
    }
    
    try {
      const expertData = JSON.parse(storedExpert);
      setExpert(expertData);
      
      // Get the full expert data from storage
      const storedExperts = localStorage.getItem('ifindlife-experts');
      if (storedExperts) {
        const experts = JSON.parse(storedExperts);
        const fullExpertData = experts.find((exp: any) => exp.id === expertData.id);
        if (fullExpertData) {
          setExpert({...expertData, ...fullExpertData});
        }
      }
    } catch (e) {
      toast.error('Session error. Please login again');
      navigate('/expert-login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('ifindlife-expert-auth');
    toast.success('Logged out successfully');
    navigate('/expert-login');
  };
  
  if (!expert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Expert Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
        
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-muted">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="rounded-full bg-muted h-20 w-20 flex items-center justify-center">
              <User className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{expert.name}</h2>
              <p className="text-muted-foreground">{expert.specialization}</p>
              <p className="text-sm">{expert.email} • {expert.phone}</p>
              <div className="mt-2">
                <span className="text-xs bg-astro-purple/10 text-astro-purple px-2 py-1 rounded-full">
                  {expert.experience} years experience
                </span>
              </div>
            </div>
            <Button variant="outline" className="hidden md:flex">
              <Settings className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Upcoming Sessions"
            value="0"
            icon={<Calendar className="h-5 w-5 text-astro-purple" />}
          />
          <DashboardCard
            title="Total Clients"
            value="0"
            icon={<Users className="h-5 w-5 text-astro-gold" />}
          />
          <DashboardCard
            title="Session Hours"
            value="0"
            icon={<Clock className="h-5 w-5 text-astro-teal" />}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Services</CardTitle>
            </CardHeader>
            <CardContent>
              {expert.selectedServices && expert.selectedServices.length > 0 ? (
                <div className="space-y-4">
                  {expert.selectedServices.map((serviceId: number) => {
                    // Find the service from stored data
                    const storedContent = localStorage.getItem('ifindlife-content');
                    let serviceName = `Service #${serviceId}`;
                    
                    if (storedContent) {
                      try {
                        const parsedContent = JSON.parse(storedContent);
                        if (parsedContent.categories && parsedContent.categories[serviceId - 1]) {
                          serviceName = parsedContent.categories[serviceId - 1].title;
                        }
                      } catch (e) {
                        console.error("Error parsing content", e);
                      }
                    }
                    
                    return (
                      <div key={serviceId} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>{serviceName}</span>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No services selected yet.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 border border-dashed rounded-lg">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No messages yet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const User = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const DashboardCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="bg-background/80 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ExpertDashboard;
