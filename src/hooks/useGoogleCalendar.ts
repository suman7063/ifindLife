import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleCalendar {
  id: string;
  summary: string;
  primary?: boolean;
  accessRole: string;
}

interface UseGoogleCalendarReturn {
  calendars: GoogleCalendar[];
  loading: boolean;
  error: string | null;
  authorizeGoogle: () => Promise<void>;
  getCalendars: (accessToken: string) => Promise<void>;
  syncAvailability: (accessToken: string, expertId: string, calendarId: string) => Promise<void>;
  createEvent: (accessToken: string, calendarId: string, appointmentDetails: any) => Promise<string>;
}

export const useGoogleCalendar = (): UseGoogleCalendarReturn => {
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authorizeGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would typically use Google OAuth2 flow
      // For now, we'll show how to integrate once credentials are set up
      const clientId = 'your-google-client-id'; // This should come from env/config
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = 'https://www.googleapis.com/auth/calendar';
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;
      
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authorize with Google');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCalendars = useCallback(async (accessToken: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'get-calendars',
          accessToken,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      setCalendars(data.calendars || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendars');
    } finally {
      setLoading(false);
    }
  }, []);

  const syncAvailability = useCallback(async (accessToken: string, expertId: string, calendarId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'sync-availability',
          accessToken,
          expertId,
          calendarId,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      console.log('Availability synced successfully:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync availability');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (accessToken: string, calendarId: string, appointmentDetails: any): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'create-event',
          accessToken,
          calendarId,
          appointmentDetails,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data.eventId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create calendar event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    calendars,
    loading,
    error,
    authorizeGoogle,
    getCalendars,
    syncAvailability,
    createEvent,
  };
};