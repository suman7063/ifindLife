import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, Calendar, Heart, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock wallet balance for demo
const MOCK_WALLET_BALANCE = 2500;

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();

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
        <Button 
          variant="outline" 
          className="w-full justify-between h-14"
          onClick={() => navigate('/mobile-app/app/wallet')}
        >
          <div className="flex items-center">
            <Wallet className="h-5 w-5 mr-3" />
            Wallet
          </div>
          <Badge variant="secondary" className="bg-ifind-aqua/10 text-ifind-aqua font-semibold">
            ₹{MOCK_WALLET_BALANCE.toLocaleString()}
          </Badge>
        </Button>
        <Button variant="outline" className="w-full justify-start h-14">
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  );
};