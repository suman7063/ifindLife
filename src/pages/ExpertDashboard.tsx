
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LogOut, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  Clock, 
  DollarSign, 
  ChevronDown,
  BarChart,
  FileText,
  ArrowUpDown
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

// Mock data - in a real app this would come from a database
const mockClients = [
  { id: 1, name: "Jane Smith", service: 1, sessionDate: "2023-07-15", earnings: 1200, duration: 60 },
  { id: 2, name: "John Doe", service: 2, sessionDate: "2023-07-18", earnings: 1500, duration: 90 },
  { id: 3, name: "Alex Johnson", service: 1, sessionDate: "2023-07-20", earnings: 1200, duration: 60 },
  { id: 4, name: "Maria Garcia", service: 3, sessionDate: "2023-07-22", earnings: 1800, duration: 120 },
  { id: 5, name: "Jane Smith", service: 2, sessionDate: "2023-08-05", earnings: 1500, duration: 90 },
  { id: 6, name: "John Doe", service: 1, sessionDate: "2023-08-10", earnings: 1200, duration: 60 },
];

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const [expert, setExpert] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [sortField, setSortField] = useState<'name' | 'service' | 'earnings'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [revenuePercentage, setRevenuePercentage] = useState<number>(70); // Expert's share percentage
  
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

      // Load admin settings (including revenue percentage)
      const adminSettings = localStorage.getItem('ifindlife-admin-settings');
      if (adminSettings) {
        const settings = JSON.parse(adminSettings);
        if (settings.expertRevenuePercentage) {
          setRevenuePercentage(settings.expertRevenuePercentage);
        }
      }

      // In a real app, we would fetch the clients from the server
      // For now, use mock data
      setClients(mockClients);
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

  const handleSort = (field: 'name' | 'service' | 'earnings') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === 'service') {
      return sortDirection === 'asc' 
        ? a.service - b.service 
        : b.service - a.service;
    } else { // earnings
      return sortDirection === 'asc' 
        ? a.earnings - b.earnings 
        : b.earnings - a.earnings;
    }
  });

  // Filter clients based on the selected time period
  const filteredClients = sortedClients.filter(client => {
    const sessionDate = new Date(client.sessionDate);
    const today = new Date();
    
    if (timeFilter === 'daily') {
      return sessionDate.toDateString() === today.toDateString();
    } else if (timeFilter === 'weekly') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      return sessionDate >= weekStart;
    } else if (timeFilter === 'monthly') {
      return sessionDate.getMonth() === today.getMonth() && 
             sessionDate.getFullYear() === today.getFullYear();
    } else if (timeFilter === 'yearly') {
      return sessionDate.getFullYear() === today.getFullYear();
    }
    return true;
  });

  // Calculate total earnings for the selected time period
  const totalEarnings = filteredClients.reduce((sum, client) => sum + client.earnings, 0);
  
  // Calculate expert's share based on the percentage
  const expertShare = (totalEarnings * revenuePercentage) / 100;

  // Service-wise earnings breakdown
  const serviceEarnings = filteredClients.reduce((acc: any, client) => {
    if (!acc[client.service]) {
      acc[client.service] = 0;
    }
    acc[client.service] += client.earnings;
    return acc;
  }, {});

  // Count unique clients
  const uniqueClientCount = new Set(filteredClients.map(client => client.name)).size;
  
  // Total session hours
  const totalHours = filteredClients.reduce((sum, client) => sum + client.duration, 0) / 60;
  
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
        
        {/* Time filter for earnings */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Earnings Dashboard</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Time Period:</span>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="bg-background border border-input rounded-md p-2 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Earnings"
            value={`₹${totalEarnings.toLocaleString()}`}
            description={`Your Share: ₹${expertShare.toLocaleString()} (${revenuePercentage}%)`}
            icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          />
          <DashboardCard
            title="Clients"
            value={uniqueClientCount.toString()}
            description={`Total Sessions: ${filteredClients.length}`}
            icon={<Users className="h-5 w-5 text-astro-gold" />}
          />
          <DashboardCard
            title="Session Hours"
            value={totalHours.toFixed(1)}
            description={`Avg: ${filteredClients.length ? (totalHours / filteredClients.length).toFixed(1) : 0} hrs/session`}
            icon={<Clock className="h-5 w-5 text-astro-teal" />}
          />
        </div>
        
        <Tabs defaultValue="clients" className="mb-8">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients" className="border rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Client Sessions</h3>
              <div className="text-sm text-muted-foreground">
                Showing {filteredClients.length} sessions
              </div>
            </div>
            
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Client Name
                        {sortField === 'name' && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer"
                      onClick={() => handleSort('service')}
                    >
                      <div className="flex items-center">
                        Service
                        {sortField === 'service' && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                    <th className="py-3 px-4 text-left font-medium">Duration</th>
                    <th 
                      className="py-3 px-4 text-right font-medium cursor-pointer"
                      onClick={() => handleSort('earnings')}
                    >
                      <div className="flex items-center justify-end">
                        Earnings
                        {sortField === 'earnings' && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client, index) => {
                      // Find the service name from stored data
                      const storedContent = localStorage.getItem('ifindlife-content');
                      let serviceName = `Service #${client.service}`;
                      
                      if (storedContent) {
                        try {
                          const parsedContent = JSON.parse(storedContent);
                          if (parsedContent.categories && parsedContent.categories[client.service - 1]) {
                            serviceName = parsedContent.categories[client.service - 1].title;
                          }
                        } catch (e) {
                          console.error("Error parsing content", e);
                        }
                      }
                      
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                          <td className="py-3 px-4">{client.name}</td>
                          <td className="py-3 px-4">{serviceName}</td>
                          <td className="py-3 px-4">{new Date(client.sessionDate).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{client.duration} min</td>
                          <td className="py-3 px-4 text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>₹{client.earnings.toLocaleString()}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Your share: ₹{((client.earnings * revenuePercentage) / 100).toLocaleString()} ({revenuePercentage}%)</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        No client sessions found for the selected period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="border rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Service-wise Earnings</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {expert.selectedServices && expert.selectedServices.length > 0 ? (
                expert.selectedServices.map((serviceId: number) => {
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
                  
                  const serviceEarning = serviceEarnings[serviceId] || 0;
                  const serviceShare = (serviceEarning * revenuePercentage) / 100;
                  
                  return (
                    <Card key={serviceId}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{serviceName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {filteredClients.filter(c => c.service === serviceId).length} sessions
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{serviceEarning.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              Your share: ₹{serviceShare.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-2 py-6 text-center text-muted-foreground">
                  No services selected yet.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="messages" className="border rounded-lg p-4 mt-4">
            <div className="flex items-center justify-center h-32 border border-dashed rounded-lg">
              <div className="text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No messages yet</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
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

const DashboardCard = ({ 
  title, 
  value, 
  description,
  icon 
}: { 
  title: string, 
  value: string, 
  description?: string,
  icon: React.ReactNode 
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="bg-background/80 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ExpertDashboard;
