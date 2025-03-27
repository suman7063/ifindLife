
import React from 'react';
import { Card } from '@/components/ui/card';

const SettingsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
      <p className="text-muted-foreground">
        Manage your account settings and preferences.
      </p>
    </Card>
  );
};

export default SettingsTab;
