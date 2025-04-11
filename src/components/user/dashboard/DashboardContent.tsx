
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import WalletSection from './WalletSection';
import UserStatsSummary from './UserStatsSummary';
import { UserTransaction } from '@/types/supabase/transactions';
import { UserProfile } from '@/types/supabase';

interface DashboardContentProps {
  user: UserProfile | null;
  transactions: UserTransaction[];
  isLoading: boolean;
  onRecharge: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  transactions,
  isLoading,
  onRecharge
}) => {
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
            <WalletSection 
              user={user} 
              transactions={transactions} 
              onRecharge={onRecharge} 
            />
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
          <EmptyStateSection 
            title="Your Favorites"
            message="You haven't added any favorites yet."
            description="Find experts and programs you like and add them to favorites."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;

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
