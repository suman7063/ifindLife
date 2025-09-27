import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Calendar, Heart, CreditCard } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  return (
    <div className="flex flex-col bg-background p-6">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">SU</span>
        </div>
        <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal">Sarah User</h1>
        <p className="text-muted-foreground">sarah.user@email.com</p>
      </div>

      <div className="space-y-4">
        <Button variant="outline" className="w-full justify-start h-14">
          <Calendar className="h-5 w-5 mr-3" />
          My Sessions
        </Button>
        <Button variant="outline" className="w-full justify-start h-14">
          <Heart className="h-5 w-5 mr-3" />
          Favorite Experts
        </Button>
        <Button variant="outline" className="w-full justify-start h-14">
          <CreditCard className="h-5 w-5 mr-3" />
          Payment Methods
        </Button>
        <Button variant="outline" className="w-full justify-start h-14">
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  );
};