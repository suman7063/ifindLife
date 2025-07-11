import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PricingSetupStepProps {
  expertAccount: any;
  onComplete: () => void;
}

export const PricingSetupStep: React.FC<PricingSetupStepProps> = ({
  expertAccount,
  onComplete
}) => {
  const [pricing, setPricing] = useState({
    session_30_usd: 0,
    session_30_inr: 0,
    session_30_eur: 0,
    session_60_usd: 0,
    session_60_inr: 0,
    session_60_eur: 0
  });
  const [loading, setLoading] = useState(false);
  const [basePricing, setBasePricing] = useState<any>(null);

  useEffect(() => {
    fetchBasePricing();
    fetchExistingPricing();
  }, [expertAccount]);

  const fetchBasePricing = async () => {
    if (!expertAccount?.category) return;

    try {
      const { data, error } = await supabase
        .from('expert_categories')
        .select('*')
        .eq('id', expertAccount.category)
        .single();

      if (error) throw error;
      setBasePricing(data);

      // Set default pricing based on category (fixed session pricing)
      setPricing({
        session_30_usd: data.base_price_usd * 30,
        session_30_inr: data.base_price_inr * 30,
        session_30_eur: data.base_price_eur * 30,
        session_60_usd: data.base_price_usd * 60,
        session_60_inr: data.base_price_inr * 60,
        session_60_eur: data.base_price_eur * 60
      });
    } catch (error) {
      console.error('Error fetching base pricing:', error);
    }
  };

  const fetchExistingPricing = async () => {
    try {
      const { data, error } = await supabase
        .from('expert_pricing_tiers')
        .select('*')
        .eq('expert_id', expertAccount.id)
        .eq('category', expertAccount.category)
        .single();

      if (!error && data) {
        setPricing({
          session_30_usd: data.session_30_usd || data.price_per_min_usd * 30 || 0,
          session_30_inr: data.session_30_inr || data.price_per_min_inr * 30 || 0,
          session_30_eur: data.session_30_eur || data.price_per_min_eur * 30 || 0,
          session_60_usd: data.session_60_usd || data.price_per_min_usd * 60 || 0,
          session_60_inr: data.session_60_inr || data.price_per_min_inr * 60 || 0,
          session_60_eur: data.session_60_eur || data.price_per_min_eur * 60 || 0
        });
      }
    } catch (error) {
      console.error('Error fetching existing pricing:', error);
    }
  };

  const handleSavePricing = async () => {
    setLoading(true);
    
    try {
      // Upsert pricing tiers
      const { error } = await supabase
        .from('expert_pricing_tiers')
        .upsert({
          expert_id: expertAccount.id,
          category: expertAccount.category,
          ...pricing
        }, {
          onConflict: 'expert_id,category'
        });

      if (error) throw error;

      toast.success('Pricing saved successfully!');
      onComplete();
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Failed to save pricing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Category: {expertAccount.category}</h3>
        <p className="text-muted-foreground mb-4">
          Set your rates for consultations. You can adjust these based on your experience and market demand.
        </p>
      </div>

      {basePricing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Recommended Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-blue-700">USD (30 min)</Label>
                <p className="font-medium">${(basePricing.base_price_usd * 30).toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-blue-700">INR (30 min)</Label>
                <p className="font-medium">₹{(basePricing.base_price_inr * 30).toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-blue-700">EUR (30 min)</Label>
                <p className="font-medium">€{(basePricing.base_price_eur * 30).toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-blue-700">USD (60 min)</Label>
                <p className="font-medium">${(basePricing.base_price_usd * 60).toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-blue-700">INR (60 min)</Label>
                <p className="font-medium">₹{(basePricing.base_price_inr * 60).toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-blue-700">EUR (60 min)</Label>
                <p className="font-medium">€{(basePricing.base_price_eur * 60).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h4 className="font-medium">30-Minute Session Rates</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="session_30_usd">USD (30 min session)</Label>
            <Input
              id="session_30_usd"
              type="number"
              step="0.01"
              value={pricing.session_30_usd}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                session_30_usd: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
          <div>
            <Label htmlFor="session_30_inr">INR (30 min session)</Label>
            <Input
              id="session_30_inr"
              type="number"
              step="0.01"
              value={pricing.session_30_inr}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                session_30_inr: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
          <div>
            <Label htmlFor="session_30_eur">EUR (30 min session)</Label>
            <Input
              id="session_30_eur"
              type="number"
              step="0.01"
              value={pricing.session_30_eur}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                session_30_eur: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">60-Minute Session Rates</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="session_60_usd">USD (60 min session)</Label>
            <Input
              id="session_60_usd"
              type="number"
              step="0.01"
              value={pricing.session_60_usd}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                session_60_usd: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
          <div>
            <Label htmlFor="session_60_inr">INR (60 min session)</Label>
            <Input
              id="session_60_inr"
              type="number"
              step="0.01"
              value={pricing.session_60_inr}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                session_60_inr: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
          <div>
            <Label htmlFor="session_60_eur">EUR (60 min session)</Label>
            <Input
              id="session_60_eur"
              type="number"
              step="0.01"
              value={pricing.session_60_eur}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                session_60_eur: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSavePricing}
          disabled={loading}
          className="px-8"
        >
          {loading ? 'Saving...' : 'Save Pricing'}
        </Button>
      </div>
    </div>
  );
};