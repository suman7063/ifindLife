import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
      
      // Query database for category pricing
      const { data, error } = await supabase
        .from('expert_categories')
        .select('*')
        .eq('id', expertAccount.category)
        .single();

      console.log('🔍 Query by id result:', data, 'Error:', error);

      if (error) {
        console.error('Database query error:', error);
        // If category not found, set basePricing to null but keep pricing at 0
        setBasePricing(null);
        return;
      }

      if (data) {
        console.log('✅ Found category data:', data);
        setBasePricing(data);
      } else {
        console.log('⚠️ No category data found in database');
        setBasePricing(null);
      }
    } catch (error) {
      console.error('Error fetching base pricing:', error);
      setBasePricing(null);
    }
  };

  const fetchExistingPricing = async () => {
    // Check if pricing is already set for this expert
    // This is just for checking completion status, not for editing
    try {
      console.log('🔍 Checking existing pricing for expert:', expertAccount.auth_id, 'category:', expertAccount.category);
      
      const { data, error } = await supabase
        .from('expert_pricing_tiers')
        .select('*')
        .eq('expert_id', expertAccount.auth_id)
        .eq('category', expertAccount.category);

      if (error) {
        console.error('Error fetching existing pricing:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ Found existing pricing:', data[0]);
      } else {
        console.log('ℹ️ No existing pricing found');
      }
    } catch (error) {
      console.error('Error fetching existing pricing:', error);
    }
  };

  const handleConfirmPricing = async () => {
    if (!basePricing) {
      toast.error('Pricing information not available');
      return;
    }

    setLoading(true);
    
    try {
      console.log('💾 Confirming predefined pricing for expert:', expertAccount.auth_id, 'category:', expertAccount.category);
      
      // Save the predefined pricing from admin (basePricing) to expert_pricing_tiers
      const pricingData = {
        expert_id: expertAccount.auth_id,
        category: expertAccount.category,
        session_30_inr: Number(basePricing.base_price_30_inr) || 0,
        session_30_eur: Number(basePricing.base_price_30_eur) || 0,
        session_60_inr: Number(basePricing.base_price_60_inr) || 0,
        session_60_eur: Number(basePricing.base_price_60_eur) || 0
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
      // Check services from expert_service_specializations table
      const { data: specializationsCheck } = await supabase
        .from('expert_service_specializations')
        .select('id')
        .eq('expert_id', expertAccount.auth_id)
        .limit(1);

      const { data: eaFlags } = await supabase
        .from('expert_accounts')
        .select('pricing_set, availability_set, onboarding_completed')
        .eq('auth_id', expertAccount.auth_id)
        .single();

      const hasServices = (specializationsCheck?.length || 0) > 0;
      const hasPricing = !!eaFlags?.pricing_set;
      const hasAvailability = !!eaFlags?.availability_set;

      if (hasServices && hasPricing && hasAvailability && !eaFlags?.onboarding_completed) {
        console.log('🎉 All steps complete, marking expert_accounts.onboarding_completed = true');
        await supabase
          .from('expert_accounts')
          .update({ onboarding_completed: true })
          .eq('auth_id', expertAccount.auth_id);

        // Send welcome email when onboarding is auto-completed
        try {
          console.log('📧 Sending welcome email to expert:', expertAccount.email);
          const { error: emailError } = await supabase.functions.invoke('send-expert-email-welcome-status', {
            body: {
              expertName: expertAccount.name,
              expertEmail: expertAccount.email,
            },
          });

          if (emailError) {
            console.warn('⚠️ Failed to send welcome email (non-critical):', emailError);
          } else {
            console.log('✅ Welcome email sent successfully');
          }
        } catch (emailErr) {
          console.warn('⚠️ Error sending welcome email (non-critical):', emailErr);
        }
      }

      console.log('✅ Pricing confirmed successfully');
      toast.success('Pricing confirmed successfully!');
      onComplete();
    } catch (error) {
      console.error('Error confirming pricing:', error);
      toast.error('Failed to confirm pricing');
    } finally {
      setLoading(false);
    }
  };

  // Always show 60-minute pricing - read from database
  // No conditional check needed - always display the fields

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Category: {expertAccount.category}</h3>
        <p className="text-muted-foreground mb-4">
          Your consultation rates are predefined by the admin based on your category. Please review and confirm.
        </p>
      </div>

      {basePricing ? (
        <>
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Predefined Rates for {expertAccount.category}</CardTitle>
              <p className="text-sm text-blue-600 mt-1">These rates are set by the admin and cannot be changed</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <Label className="text-blue-700 font-semibold">30 min session</Label>
                    <p className="text-lg font-bold mt-1">₹{Number(basePricing.base_price_30_inr) || 0} / €{Number(basePricing.base_price_30_eur) || 0}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <Label className="text-blue-700 font-semibold">60 min session</Label>
                    <p className="text-lg font-bold mt-1">₹{Number(basePricing.base_price_60_inr) || 0} / €{Number(basePricing.base_price_60_eur) || 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleConfirmPricing}
              disabled={loading}
              className="px-8"
            >
              {loading ? 'Confirming...' : 'Confirm Pricing'}
            </Button>
          </div>
        </>
      ) : (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <p className="text-yellow-800">
              Pricing information is not available for your category. Please contact the admin.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};