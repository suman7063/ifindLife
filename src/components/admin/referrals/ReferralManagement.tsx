import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferralSettingsEditor from './ReferralSettingsEditor';
import ReferralAnalytics from './ReferralAnalytics';

const ReferralManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referral Management</h1>
        <p className="text-muted-foreground">
          Manage your referral program settings and view analytics
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4">
          <ReferralSettingsEditor />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <ReferralAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferralManagement;