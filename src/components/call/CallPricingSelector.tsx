import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Loader2, Clock, Video, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface CallPricingOption {
  id: string;
  duration_minutes: number;
  price_usd: number;
  price_inr: number;
  tier: string;
  active: boolean;
}

interface CallPricingSelectorProps {
  expertPrice: number;
  callType: 'voice' | 'video';
  onSelectDuration: (duration: number, cost: number) => void;
  currency?: 'USD' | 'INR';
}

const CallPricingSelector: React.FC<CallPricingSelectorProps> = ({
  expertPrice,
  callType,
  onSelectDuration,
  currency = 'INR'
}) => {
  const [pricingOptions, setPricingOptions] = useState<CallPricingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    fetchPricingOptions();
  }, []);

  const fetchPricingOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('call_pricing')
        .select('*')
        .eq('active', true)
        .order('duration_minutes', { ascending: true });

      if (error) throw error;

      setPricingOptions(data || []);
      
      // Auto-select the first option
      if (data && data.length > 0) {
        setSelectedOption(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching pricing options:', error);
      toast.error('Failed to load pricing options');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = (option: CallPricingOption) => {
    const basePrice = currency === 'USD' ? option.price_usd : option.price_inr;
    const expertRate = expertPrice * option.duration_minutes;
    return basePrice + expertRate;
  };

  const handleSelectOption = (option: CallPricingOption) => {
    setSelectedOption(option.id);
    const totalCost = calculateTotalCost(option);
    onSelectDuration(option.duration_minutes, totalCost);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {callType === 'video' ? (
          <Video className="h-5 w-5 text-blue-600" />
        ) : (
          <Phone className="h-5 w-5 text-green-600" />
        )}
        <h3 className="text-lg font-semibold">
          Select {callType === 'video' ? 'Video' : 'Voice'} Call Duration
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricingOptions.map((option) => {
          const totalCost = calculateTotalCost(option);
          const isSelected = selectedOption === option.id;
          const isPremium = option.tier === 'premium';

          return (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
              onClick={() => handleSelectOption(option)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {option.duration_minutes} min
                  </CardTitle>
                  {isPremium && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Premium
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {currency === 'USD' ? '$' : '₹'}{totalCost.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Platform: {currency === 'USD' ? '$' : '₹'}{(currency === 'USD' ? option.price_usd : option.price_inr).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expert: {currency === 'USD' ? '$' : '₹'}{(expertPrice * option.duration_minutes).toFixed(2)}
                  </div>
                  {isPremium && (
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      • Priority connection
                      • HD quality guarantee
                      • Recording available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {pricingOptions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No pricing options available</p>
        </div>
      )}
    </div>
  );
};

export default CallPricingSelector;