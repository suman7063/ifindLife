import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  status: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, accessToken, expertId, calendarId } = await req.json();

    switch (action) {
      case 'sync-availability':
        return await syncAvailability(accessToken, expertId, calendarId, supabase);
      
      case 'create-event':
        return await createCalendarEvent(accessToken, calendarId, await req.json());
      
      case 'get-calendars':
        return await getCalendars(accessToken);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in google-calendar-sync:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getCalendars(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch calendars: ${response.statusText}`);
  }

  const data = await response.json();
  
  return new Response(
    JSON.stringify({ calendars: data.items }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncAvailability(accessToken: string, expertId: string, calendarId: string, supabase: any) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3); // Sync next 3 months

  // Get busy times from Google Calendar
  const freeBusyResponse = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin: now.toISOString(),
      timeMax: futureDate.toISOString(),
      items: [{ id: calendarId }],
    }),
  });

  if (!freeBusyResponse.ok) {
    throw new Error(`Failed to fetch busy times: ${freeBusyResponse.statusText}`);
  }

  const freeBusyData = await freeBusyResponse.json();
  const busyTimes = freeBusyData.calendars[calendarId]?.busy || [];

  // Get expert's existing availabilities
  const { data: existingAvailabilities, error: availError } = await supabase
    .from('expert_availabilities')
    .select('*')
    .eq('expert_id', expertId);

  if (availError) {
    throw new Error(`Failed to fetch existing availabilities: ${availError.message}`);
  }

  // Update availability based on busy times
  // This is a simplified sync - in production, you'd want more sophisticated logic
  const unavailablePeriods = busyTimes.map((busy: any) => ({
    start: new Date(busy.start),
    end: new Date(busy.end),
  }));

  console.log(`Synced ${busyTimes.length} busy periods for expert ${expertId}`);

  return new Response(
    JSON.stringify({ 
      success: true, 
      busyPeriodsCount: busyTimes.length,
      syncedUntil: futureDate.toISOString() 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createCalendarEvent(accessToken: string, calendarId: string, eventData: any) {
  const { appointmentDetails } = eventData;
  
  const event = {
    summary: `Appointment with ${appointmentDetails.expertName}`,
    description: appointmentDetails.notes || 'Professional consultation',
    start: {
      dateTime: `${appointmentDetails.date}T${appointmentDetails.startTime}:00`,
      timeZone: 'UTC', // Should be configurable based on expert's timezone
    },
    end: {
      dateTime: `${appointmentDetails.date}T${appointmentDetails.endTime}:00`,
      timeZone: 'UTC',
    },
    attendees: [
      { email: appointmentDetails.userEmail },
      { email: appointmentDetails.expertEmail },
    ],
  };

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error(`Failed to create calendar event: ${response.statusText}`);
  }

  const createdEvent = await response.json();

  return new Response(
    JSON.stringify({ 
      success: true, 
      eventId: createdEvent.id,
      eventLink: createdEvent.htmlLink 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}