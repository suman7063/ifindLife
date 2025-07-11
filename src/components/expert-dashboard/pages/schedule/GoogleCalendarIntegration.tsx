import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, RefreshCw, Link, CheckCircle } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

const GoogleCalendarIntegration: React.FC = () => {
  const { expert } = useSimpleAuth();
  const { calendars, loading, error, authorizeGoogle, getCalendars, syncAvailability } = useGoogleCalendar();
  const [selectedCalendar, setSelectedCalendar] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    try {
      await authorizeGoogle();
      toast.success('Redirecting to Google for authorization...');
    } catch (err) {
      toast.error('Failed to connect to Google Calendar');
    }
  };

  const handleSyncAvailability = async () => {
    if (!accessToken || !selectedCalendar || !expert?.id) {
      toast.error('Please connect your calendar and select a calendar first');
      return;
    }

    try {
      await syncAvailability(accessToken, expert.id, selectedCalendar);
      toast.success('Availability synced successfully with Google Calendar');
    } catch (err) {
      toast.error('Failed to sync availability');
    }
  };

  const handleRefreshCalendars = async () => {
    if (!accessToken) {
      toast.error('Please connect your Google account first');
      return;
    }

    try {
      await getCalendars(accessToken);
      toast.success('Calendars refreshed successfully');
    } catch (err) {
      toast.error('Failed to refresh calendars');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar Integration
          {isConnected && <Badge variant="default" className="ml-2">Connected</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {!isConnected ? (
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Connect Your Google Calendar</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sync your availability and automatically create events for booked appointments.
            </p>
            <Button onClick={handleConnect} disabled={loading} className="gap-2">
              <Link className="h-4 w-4" />
              {loading ? 'Connecting...' : 'Connect Google Calendar'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">Google Calendar connected successfully</span>
            </div>

            {/* Calendar Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Calendar</label>
              <div className="flex gap-2">
                <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose a calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map(calendar => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        <div className="flex items-center gap-2">
                          <span>{calendar.summary}</span>
                          {calendar.primary && (
                            <Badge variant="secondary" className="text-xs">Primary</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleRefreshCalendars}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Sync Controls */}
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleSyncAvailability}
                disabled={!selectedCalendar || loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Sync Availability Now
              </Button>
              
              <p className="text-xs text-muted-foreground">
                This will update your availability based on your Google Calendar events.
                Busy times will be marked as unavailable.
              </p>
            </div>

            {/* Features Info */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">What happens when connected:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Busy times are automatically marked as unavailable</li>
                <li>• New appointments create Google Calendar events</li>
                <li>• Changes sync both ways for real-time updates</li>
                <li>• Automatic reminders and notifications</li>
              </ul>
            </div>
          </div>
        )}

        {/* Development Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            <strong>Setup Required:</strong> To use Google Calendar integration, add your Google OAuth credentials 
            in the Supabase secrets: GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarIntegration;