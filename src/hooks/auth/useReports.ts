
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ReportUI } from '@/types/supabase';
import { UserProfile } from '@/types/supabase/user';

export const useReports = () => {
  // Add a report to a user
  const addReport = async (user: UserProfile, expertId: string, reason: string, details: string) => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('user_reports')
        .insert({
          user_id: user.id,
          expert_id: parseInt(expertId),
          reason,
          details,
          date: now,
          status: 'pending'
        });
        
      if (error) {
        throw error;
      }
      
      toast.success('Report submitted successfully');
      return { ...user, reports: [...(user.reports || [])] };
    } catch (error: any) {
      toast.error('Failed to submit report: ' + error.message);
      return user;
    }
  };

  // Get all reports by a user
  const getUserReports = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error: any) {
      toast.error('Failed to fetch reports: ' + error.message);
      return [];
    }
  };

  // Submit a report for any content (expert, review, etc.)
  const submitReport = async (
    reporterId: string,
    reporterType: string,
    targetId: string,
    targetType: string,
    reason: string,
    details: string
  ) => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('moderation_reports')
        .insert({
          reporter_id: reporterId,
          reporter_type: reporterType,
          target_id: targetId,
          target_type: targetType,
          reason,
          details,
          created_at: now,
          status: 'pending'
        });
        
      if (error) {
        throw error;
      }
      
      toast.success('Report submitted successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to submit report: ' + error.message);
      return false;
    }
  };

  return { addReport, getUserReports, submitReport };
};
