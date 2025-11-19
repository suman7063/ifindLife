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
    session_30_inr: 0,
    session_30_eur: 0,
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
      console.log('🔍 Fetching base pricing for category:', expertAccount.category);
      
      // Try to query by id first (which should match the category format)
      const { data, error } = await supabase
        .from('expert_categories')
        .select('*')
        .eq('id', expertAccount.category);

      console.log('🔍 Query by id result:', data, 'Error:', error);

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('✅ Found category data:', data[0]);
        setBasePricing(data[0]);
        
        // Set pricing based on database data
        const categoryData = data[0];
        setPricing({
          session_30_inr: Number(categoryData.base_price_30_inr) || 0,
          session_30_eur: Number(categoryData.base_price_30_eur) || 0,
          session_60_inr: Number(categoryData.base_price_60_inr) || 0,
          session_60_eur: Number(categoryData.base_price_60_eur) || 0,
        });
      } else {
        console.log('⚠️ No data found, using fallback pricing');
        // Fallback to hardcoded pricing
        const categoryName = expertAccount.category
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        const categoryPricing = getCategoryPricing(categoryName);
        setPricing(categoryPricing);
      }
    } catch (error) {
      console.error('Error fetching base pricing:', error);
      // Fallback to hardcoded pricing if database lookup fails
      const categoryName = expertAccount.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const categoryPricing = getCategoryPricing(categoryName);
      setPricing(categoryPricing);
    }
  };

  const getCategoryPricing = (category: string) => {
    switch (category) {
      case 'Listening Volunteer':
        return { session_30_inr: 200, session_30_eur: 10, session_60_inr: 0, session_60_eur: 0 };
      case 'Listening Expert':
        return { session_30_inr: 400, session_30_eur: 20, session_60_inr: 0, session_60_eur: 0 };
      case 'Mindfulness Expert':
        return { session_30_inr: 600, session_30_eur: 50, session_60_inr: 1000, session_60_eur: 30 };
      case 'Mindfulness Coach':
        return { session_30_inr: 1200, session_30_eur: 50, session_60_inr: 2000, session_60_eur: 80 };
      case 'Spiritual Mentor':
        return { session_30_inr: 1800, session_30_eur: 80, session_60_inr: 3000, session_60_eur: 150 };
      default:
        return { session_30_inr: 0, session_30_eur: 0, session_60_inr: 0, session_60_eur: 0 };
    }
  };

  const fetchExistingPricing = async () => {
    try {
      console.log('🔍 Fetching existing pricing for expert:', expertAccount.auth_id, 'category:', expertAccount.category);
      
      const { data, error } = await supabase
        .from('expert_pricing_tiers')
        .select('*')
        .eq('expert_id', expertAccount.auth_id)
        .eq('category', expertAccount.category);

      console.log('🔍 Existing pricing query result:', data, 'Error:', error);

      if (error) {
        console.error('Error fetching existing pricing:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ Found existing pricing:', data[0]);
        setPricing({
          session_30_inr: data[0].session_30_inr || 0,
          session_30_eur: data[0].session_30_eur || 0,
          session_60_inr: data[0].session_60_inr || 0,
          session_60_eur: data[0].session_60_eur || 0
        });
      } else {
        console.log('ℹ️ No existing pricing found, using base pricing');
      }

      
      // Presence of existing pricing will be treated by parent for completion UI
    } catch (error) {
      console.error('Error fetching existing pricing:', error);
    }
  };

  const handleSavePricing = async () => {
    setLoading(true);
    
    try {
      console.log('💾 Saving pricing for expert:', expertAccount.auth_id, 'category:', expertAccount.category);
      console.log('💾 Pricing data to save:', pricing);
      
      // Upsert pricing tiers
      const pricingData = {
        expert_id: expertAccount.auth_id,
        category: expertAccount.category,
        session_30_inr: pricing.session_30_inr,
        session_30_eur: pricing.session_30_eur,
        session_60_inr: pricing.session_60_inr,
        session_60_eur: pricing.session_60_eur
      };
      
      console.log('💾 Final pricing data:', pricingData);
      
      const { error } = await supabase
        .from('expert_pricing_tiers')
        .upsert(pricingData, {
          onConflict: 'expert_id,category'
        });

      if (error) {
        console.error('Error saving pricing:', error);
        throw error;
      }

      // Update flags on expert_accounts as the single source of truth
      console.log('💾 Updating expert_accounts.pricing_set flag...');
      const { error: eaUpdateError } = await supabase
        .from('expert_accounts')
        .update({ pricing_set: true })
        .eq('auth_id', expertAccount.auth_id);

      if (eaUpdateError) {
        console.error('Error updating expert_accounts.pricing_set:', eaUpdateError);
      }

      // If all flags are true, set onboarding_completed on expert_accounts as well
      const { data: eaFlags } = await supabase
        .from('expert_accounts')
        .select('selected_services, pricing_set, availability_set, onboarding_completed')
        .eq('auth_id', expertAccount.auth_id)
        .single();

      const hasServices = Array.isArray(eaFlags?.selected_services) && eaFlags!.selected_services.length > 0;
      const hasPricing = !!eaFlags?.pricing_set;
      const hasAvailability = !!eaFlags?.availability_set;

      if (hasServices && hasPricing && hasAvailability && !eaFlags?.onboarding_completed) {
        console.log('🎉 All steps complete, marking expert_accounts.onboarding_completed = true');
        await supabase
          .from('expert_accounts')
          .update({ onboarding_completed: true })
          .eq('auth_id', expertAccount.auth_id);
      }

      console.log('✅ Pricing saved successfully');
      toast.success('Pricing saved successfully!');
      onComplete();
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Failed to save pricing');
    } finally {
      setLoading(false);
    }
  };

  const supports60Minutes = ['Mindfulness Expert', 'Mindfulness Coach', 'Spiritual Mentor'].includes(expertAccount.category);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Category: {expertAccount.category}</h3>
        <p className="text-muted-foreground mb-4">
          Set your rates for consultations. Pricing is based on your category and market standards.
        </p>
      </div>

      {basePricing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Standard Rates for {expertAccount.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-blue-700">30 min session</Label>
                <p className="font-medium">₹{pricing.session_30_inr} / €{pricing.session_30_eur}</p>
              </div>
              {supports60Minutes && (
                <div>
                  <Label className="text-blue-700">60 min session</Label>
                  <p className="font-medium">₹{pricing.session_60_inr} / €{pricing.session_60_eur}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h4 className="font-medium">30-Minute Session Rates</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="session_30_inr">INR (30 min session)</Label>
            <Input
              id="session_30_inr"
              type="number"
              step="1"
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
              step="1"
              value={pricing.session_30_eur}
              onChange={(e) => setPricing(prev => ({
                ...prev,
                session_30_eur: parseFloat(e.target.value) || 0
              }))}
            />
          </div>
        </div>
      </div>

      {supports60Minutes && (
        <div className="space-y-4">
          <h4 className="font-medium">60-Minute Session Rates</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="session_60_inr">INR (60 min session)</Label>
              <Input
                id="session_60_inr"
                type="number"
                step="1"
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
                step="1"
                value={pricing.session_60_eur}
                onChange={(e) => setPricing(prev => ({
                  ...prev,
                  session_60_eur: parseFloat(e.target.value) || 0
                }))}
              />
            </div>
          </div>
        </div>
      )}

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