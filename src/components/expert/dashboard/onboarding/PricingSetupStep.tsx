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
    price_per_min_usd: 0,
    price_per_min_inr: 0,
    price_per_min_eur: 0,
    consultation_fee_usd: 0,
    consultation_fee_inr: 0,
    consultation_fee_eur: 0
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

      // Set default pricing based on category
      setPricing({
        price_per_min_usd: data.base_price_usd,
        price_per_min_inr: data.base_price_inr,
        price_per_min_eur: data.base_price_eur,
        consultation_fee_usd: data.base_price_usd * 15, // 15 min consultation
        consultation_fee_inr: data.base_price_inr * 15,
        consultation_fee_eur: data.base_price_eur * 15
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
          price_per_min_usd: data.price_per_min_usd,
          price_per_min_inr: data.price_per_min_inr,
          price_per_min_eur: data.price_per_min_eur,
          consultation_fee_usd: data.consultation_fee_usd,
          consultation_fee_inr: data.consultation_fee_inr,
          consultation_fee_eur: data.consultation_fee_eur
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
                <Label className="text-blue-700">USD</Label>
                <p className="font-medium">${basePricing.base_price_usd}/min</p>
              </div>
              <div>
                <Label className="text-blue-700">INR</Label>
                <p className="font-medium">₹{basePricing.base_price_inr}/min</p>
              </div>
              <div>
                <Label className="text-blue-700">EUR</Label>
                <p className="font-medium">€{basePricing.base_price_eur}/min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h4 className="font-medium">Per-Minute Rates</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price_usd">USD Rate (per minute)</Label>
            <Input
              id="price_usd"
              type="number"
              step="0.01"
              value={pricing.price_per_min_usd}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                price_per_min_usd: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
          <div>
            <Label htmlFor="price_inr">INR Rate (per minute)</Label>
            <Input
              id="price_inr"
              type="number"
              step="0.01"
              value={pricing.price_per_min_inr}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                price_per_min_inr: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
          <div>
            <Label htmlFor="price_eur">EUR Rate (per minute)</Label>
            <Input
              id="price_eur"
              type="number"
              step="0.01"
              value={pricing.price_per_min_eur}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                price_per_min_eur: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Consultation Fees (15 minutes)</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="consultation_usd">USD Consultation</Label>
            <Input
              id="consultation_usd"
              type="number"
              step="0.01"
              value={pricing.consultation_fee_usd}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                consultation_fee_usd: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
          <div>
            <Label htmlFor="consultation_inr">INR Consultation</Label>
            <Input
              id="consultation_inr"
              type="number"
              step="0.01"
              value={pricing.consultation_fee_inr}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                consultation_fee_inr: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
          <div>
            <Label htmlFor="consultation_eur">EUR Consultation</Label>
            <Input
              id="consultation_eur"
              type="number"
              step="0.01"
              value={pricing.consultation_fee_eur}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                consultation_fee_eur: parseFloat(e.target.value) || 0
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