
import { useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole } from '../types';
import { toast } from 'sonner';

export const useProfileFunctions = (
  user: User | null,
  session: Session | null,
  profile: UserProfile | null,
  role: UserRole
) => {
  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      return { error };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  }, [user]);
  
  // Get displayable user name
  const getUserDisplayName = useCallback(() => {
    if (!user) return '';
    // Try to get name from user metadata
    const userMeta = user.user_metadata;
    if (userMeta && userMeta.name) return userMeta.name;
    // Fall back to email (first part)
    if (user.email) return user.email.split('@')[0];
    // Last resort
    return 'User';
  }, [user]);
  
  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, [user]);
  
  // Update wallet balance
  const updateWalletBalance = useCallback(async (newBalance: number) => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', user.id);
        
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return { error };
    }
  }, [user]);
  
  // Add funds to wallet
  const addFunds = useCallback(async (amount: number) => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      // First get current balance
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const currentBalance = profile?.wallet_balance || 0;
      const newBalance = currentBalance + amount;
      
      // Update the balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Create a transaction record
      const { error: transactionError } = await supabase
        .from('user_transactions')
        .insert({
          user_id: user.id,
          amount,
          currency: 'USD', // Default currency
          description: 'Wallet recharge',
          date: new Date().toISOString(),
          type: 'recharge'
        });
        
      if (transactionError) {
        console.error('Error creating transaction record:', transactionError);
        // Continue anyway, since the wallet was updated
      }
      
      toast.success(`Successfully added $${amount} to your wallet`);
      
      return { error: null };
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error('Failed to add funds to your wallet');
      return { error };
    }
  }, [user]);
  
  return {
    updateProfile,
    getUserDisplayName,
    fetchProfile,
    addFunds,
    updateWalletBalance
  };
};
