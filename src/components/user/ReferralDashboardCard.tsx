
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ReferralSettingsUI, convertReferralSettingsToUI } from '@/types/supabase/referrals';

const ReferralDashboardCard: React.FC = () => {
  const [settings, setSettings] = useState<ReferralSettingsUI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferralSettings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('referral_settings')
          .select('*')
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Convert snake_case properties to camelCase using the conversion function
          setSettings(convertReferralSettingsToUI(data));
        }
      } catch (error) {
        console.error("Error fetching referral settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReferralSettings();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Referral Program</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-t-ifind-teal rounded-full"></div>
          </div>
        ) : settings ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              {settings.description || 'Invite friends to iFind Life and earn rewards!'}
            </p>
            
            <div className="bg-gray-50 rounded-md p-3 text-center">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">You earn</p>
                  <p className="font-semibold text-ifind-teal">${settings.referrerReward.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Your friend gets</p>
                  <p className="font-semibold text-ifind-teal">${settings.referredReward.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="default" 
              className="w-full bg-ifind-teal hover:bg-ifind-teal/90"
              onClick={() => navigate('/user/referrals')}
            >
              View My Referrals
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-4">
            Referral program is not available at this time.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralDashboardCard;
