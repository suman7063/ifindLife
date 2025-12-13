import React, { useState } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedAvailabilityForm from './EnhancedAvailabilityForm';
import ExpertAvailabilityList from './ExpertAvailabilityList';

const AvailabilityManagement: React.FC = () => {
  const { expert, userProfile, isLoading } = useSimpleAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Use expert profile if available, otherwise fall back to user profile
  const currentUser = expert || userProfile;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">No user profile found. Please try refreshing the page.</p>
      </div>
    );
  }

  const handleAvailabilityUpdated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <EnhancedAvailabilityForm 
            user={currentUser} 
            onAvailabilityUpdated={handleAvailabilityUpdated}
          />
      {/* <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create New Availability</TabsTrigger>
          <TabsTrigger value="manage">Manage Existing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <EnhancedAvailabilityForm 
            user={currentUser} 
            onAvailabilityUpdated={handleAvailabilityUpdated}
          />
        </TabsContent>
        
        <TabsContent value="manage">
          <ExpertAvailabilityList 
            key={refreshKey}
            user={currentUser} 
          />
        </TabsContent>
      </Tabs> */}
    </div>
  );
};

export default AvailabilityManagement;