
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import ConsultationsSection from './ConsultationsSection';
import FavoritesSection from './FavoritesSection';
import WalletSection from './WalletSection';

interface UserDashboardContentProps {
  currentUser?: any;
  isAuthenticated?: boolean;
  authLoading?: boolean;
  user?: any;
  dashboardLoading?: boolean;
  loadingTimedOut?: boolean;
  isRechargeDialogOpen?: boolean;
  isProcessingPayment?: boolean;
  logout?: () => Promise<boolean>;
  handleOpenRechargeDialog?: () => void;
  handleCloseRechargeDialog?: () => void;
  handlePaymentSuccess?: () => void;
  handlePaymentCancel?: () => void;
  setIsProcessingPayment?: (isProcessing: boolean) => void;
}

const UserDashboardContent: React.FC<UserDashboardContentProps> = ({
  currentUser,
  isAuthenticated,
  authLoading,
  user,
  dashboardLoading,
  loadingTimedOut,
  isRechargeDialogOpen,
  isProcessingPayment,
  logout,
  handleOpenRechargeDialog,
  handleCloseRechargeDialog,
  handlePaymentSuccess,
  handlePaymentCancel,
  setIsProcessingPayment
}) => {
  const [activeTab, setActiveTab] = React.useState('profile');
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  
  const handleLogout = async () => {
    if (!logout) return;
    
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  if (dashboardLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading your dashboard...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center mb-4">
              Please log in to access your dashboard.
            </p>
            <Button variant="default" asChild>
              <a href="/login">Go to Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const userData = currentUser || user;
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out
            </>
          ) : (
            'Logout'
          )}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings user={userData} />
        </TabsContent>
        
        <TabsContent value="consultations" className="mt-6">
          <ConsultationsSection user={userData} />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <FavoritesSection user={userData} />
        </TabsContent>
        
        <TabsContent value="wallet" className="mt-6">
          <WalletSection 
            user={userData}
            isRechargeDialogOpen={isRechargeDialogOpen}
            isProcessingPayment={isProcessingPayment}
            handleOpenRechargeDialog={handleOpenRechargeDialog}
            handleCloseRechargeDialog={handleCloseRechargeDialog}
            handlePaymentSuccess={handlePaymentSuccess}
            handlePaymentCancel={handlePaymentCancel}
            setIsProcessingPayment={setIsProcessingPayment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboardContent;
