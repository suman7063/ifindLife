import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Shield, HelpCircle, LogOut } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  return (
    <div className="flex flex-col bg-background p-6">
      <div className="space-y-4">
        <Button variant="outline" className="w-full justify-start h-14">
          <Bell className="h-5 w-5 mr-3" />
          Notifications
        </Button>
        <Button variant="outline" className="w-full justify-start h-14">
          <Shield className="h-5 w-5 mr-3" />
          Privacy & Security
        </Button>
        <Button variant="outline" className="w-full justify-start h-14">
          <HelpCircle className="h-5 w-5 mr-3" />
          Help & Support
        </Button>
        <Button variant="outline" className="w-full justify-start h-14 text-red-600 border-red-200">
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};