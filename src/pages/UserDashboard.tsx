
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import WalletSummary from '@/components/dashboard/WalletSummary';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useUserDataFetcher } from '@/hooks/user-auth/useUserDataFetcher';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { 
    userProfile,
    appointments,
    transactions,
    favorites,
    enrolledCourses,
    loading: dataLoading
  } = useUserDataFetcher();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/user-login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Container className="py-8 flex-1">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Container className="py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Welcome, {userProfile?.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <UpcomingAppointments 
              appointments={appointments || []} 
              loading={dataLoading} 
              limit={3}
            />
          </div>
          
          <div>
            <WalletSummary showTransactions={true} />
          </div>
        </div>
        
        <Tabs defaultValue="appointments">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <UpcomingAppointments 
                  appointments={appointments || []} 
                  loading={dataLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Experts</CardTitle>
              </CardHeader>
              <CardContent>
                {favorites && favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Favorite Experts would be displayed here */}
                    {favorites.map(expert => (
                      <div key={expert.id} className="border rounded p-4">
                        <p className="font-medium">{expert.name}</p>
                        <p className="text-sm text-muted-foreground">{expert.specialization}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>You haven't added any experts to favorites yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {enrolledCourses && enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Enrolled courses would be displayed here */}
                    {enrolledCourses.map(course => (
                      <div key={course.id} className="border rounded p-4">
                        <p className="font-medium">{course.title}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-right mt-1">{course.progress}% complete</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>You haven't enrolled in any courses yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions && transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Description</th>
                          <th className="text-left py-2">Type</th>
                          <th className="text-right py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(transaction => (
                          <tr key={transaction.id} className="border-b">
                            <td className="py-2">{transaction.date}</td>
                            <td className="py-2">{transaction.description}</td>
                            <td className="py-2">{transaction.type}</td>
                            <td className={`py-2 text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount} {transaction.currency}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No transaction history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
      <Footer />
    </div>
  );
};

export default UserDashboard;
