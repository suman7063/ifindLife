
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import WalletSection from './WalletSection';
import UserStatsSummary from './UserStatsSummary';
import FavoritesList from './FavoritesList';
import { UserProfile } from '@/types/supabase';

interface DashboardContentProps {
  user: UserProfile | null;
  isLoading: boolean;
  onRecharge: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  isLoading,
  onRecharge
}) => {
  console.log('Rendering DashboardContent with user:', user?.id, 'isLoading:', isLoading);

  return (
    <div className="mt-6">
      <UserStatsSummary user={user} />
      
      <Tabs defaultValue="wallet" className="mt-6">
        <TabsList>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="purchases">Your Purchases</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallet" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <WalletSection user={user} onRecharge={onRecharge} />
          )}
        </TabsContent>
        
        <TabsContent value="purchases" className="mt-6">
          <EmptyStateSection 
            title="Your Purchases"
            message="You haven't made any purchases yet."
            description="Explore our services and programs to get started."
          />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Your Favorite Experts</h2>
            <FavoritesList type="experts" />
            
            <h2 className="text-xl font-bold mt-8">Your Favorite Programs</h2>
            <FavoritesList type="programs" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface EmptyStateSectionProps {
  title: string;
  message: string;
  description: string;
}

const EmptyStateSection: React.FC<EmptyStateSectionProps> = ({ title, message, description }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      
      <div className="bg-muted p-8 rounded-md text-center">
        <p>{message}</p>
        <p className="text-muted-foreground mt-2">
          {description}
        </p>
      </div>
    </div>
  );
};

export default DashboardContent;
