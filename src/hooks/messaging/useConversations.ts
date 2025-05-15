
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Conversation, UseConversationsReturn } from './types';

export const useConversations = (): UseConversationsReturn => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Implement actual conversation fetching logic here
      const mockConversations: Conversation[] = [
        // Mock data for now
      ];
      
      setConversations(mockConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      // Create proper Error object
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversation(conversationId);
  }, []);
  
  const setCurrentConversation = useCallback((conversationId: string) => {
    setSelectedConversation(conversationId);
  }, []);

  return {
    conversations,
    loading,
    error,
    selectedConversation,
    selectConversation,
    fetchConversations,
    setCurrentConversation
  };
};
