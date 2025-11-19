import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Clock, 
  Bell, 
  MessageSquare, 
  AlertCircle,
  CheckCircle,
  Calendar,
  Settings,
  PhoneMissed,
  Video,
  Mic,
  MicOff
 } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
// TODO: Re-implement currency hook or remove dependency
// import { useUserCurrency } from '@/hooks/call/useUserCurrency';
import { supabase } from '@/lib/supabase';
import AgoraCallInterface from '@/components/expert-dashboard/call/AgoraCallInterface';
import { acceptCall, declineCall } from '@/services/callService';
import IncomingCallDialog from '@/components/expert-dashboard/call/IncomingCallDialog';
import ExpertInCallModal from '@/components/expert-dashboard/call/ExpertInCallModal';
import { toast } from 'sonner';

interface CallRequest {
  id: string;
  user_id: string;
  expert_id?: string;
  call_type: string;
  estimated_cost_eur?: number;
  estimated_cost_inr?: number;
  estimated_cost_usd?: number; // Keep for backward compatibility
  status: string;
  created_at: string;
  expires_at: string;
  user_metadata?: any;
  channel_name?: string;
  agora_token?: string | null;
  agora_uid?: number | null;
  call_session_id?: string | null;
}

interface OfflineMessage {
  id: string;
  user_id: string;
  message: string;
  sent_at: string;
  is_read: boolean;
  user_metadata?: any;
}

const CallManagementPage: React.FC = () => {
  const { expert } = useSimpleAuth();
  const { getExpertPresence } = useExpertPresence();
  const location = useLocation();
  // TODO: Re-implement currency logic
  const currency = 'INR'; // Default currency
  const currencySymbol = '₹';
  
  const [autoAcceptCalls, setAutoAcceptCalls] = useState(false);
  const [incomingCalls, setIncomingCalls] = useState<CallRequest[]>([]);
  const [missedCalls, setMissedCalls] = useState<CallRequest[]>([]);
  const [offlineMessages, setOfflineMessages] = useState<OfflineMessage[]>([]);
  const [currentCall, setCurrentCall] = useState<CallRequest | null>(null);
  const [incomingCallDialog, setIncomingCallDialog] = useState<CallRequest | null>(null);
  const [callStats, setCallStats] = useState({
    todaysCalls: 0,
    totalDuration: 0,
    earnings: 0,
    missedCallsCount: 0
  });
  
  // Cache to remember if away_messages table exists (to avoid repeated 404s)
  const awayMessagesTableExistsRef = useRef<boolean | null>(null);

  useEffect(() => {
    // Use auth_id instead of id - call requests use auth_id
    if (expert?.auth_id || expert?.id) {
      loadCallData();
      setupRealtimeSubscriptions();
      
      // Check if we navigated here with an accepted call ID
      const acceptedCallId = (location.state as any)?.acceptedCallId;
      if (acceptedCallId) {
        console.log('📞 Loading accepted call from navigation:', acceptedCallId);
        loadAcceptedCall(acceptedCallId);
        // Clear the state to prevent reloading on re-render
        window.history.replaceState({}, document.title);
      }
    }
  }, [expert?.auth_id, expert?.id, location.state]);

  const loadCallData = async () => {
    // Use auth_id - this is what's stored in incoming_call_requests.expert_id
    const expertAuthId = expert?.auth_id || expert?.id;
    if (!expertAuthId) return;

    try {
      // Load incoming call requests - expert_id in this table references auth_id
      const { data: calls, error: callsError } = await supabase
        .from('incoming_call_requests')
        .select('*')
        .eq('expert_id', expertAuthId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (callsError) throw callsError;
      setIncomingCalls(calls || []);

      // Load missed calls
      const { data: missed, error: missedError } = await supabase
        .from('incoming_call_requests')
        .select('*')
        .eq('expert_id', expertAuthId)
        .eq('status', 'expired')
        .order('created_at', { ascending: false })
        .limit(10);

      if (missedError) throw missedError;
      setMissedCalls(missed || []);

      // Load offline messages (gracefully handle missing table)
      // Skip query if we already know table doesn't exist (to avoid repeated 404s)
      if (awayMessagesTableExistsRef.current === false) {
        // Table doesn't exist, skip query
        setOfflineMessages([]);
      } else {
        try {
          const { data: messages, error: messagesError } = await supabase
            .from('expert_away_messages')
            .select('*')
            .eq('expert_id', expert.auth_id)
            .eq('is_read', false)
            .order('sent_at', { ascending: false });

          if (messagesError) {
            // Table doesn't exist - mark it and skip future queries
            awayMessagesTableExistsRef.current = false;
            setOfflineMessages([]);
          } else {
            // Table exists - mark it and set messages
            awayMessagesTableExistsRef.current = true;
            setOfflineMessages(messages || []);
          }
        } catch (error) {
          // Table doesn't exist - mark it to skip future queries
          awayMessagesTableExistsRef.current = false;
          setOfflineMessages([]);
        }
      }

      // Load call stats (mock data for now)
      setCallStats({
        todaysCalls: 5,
        totalDuration: 240, // minutes
        earnings: 600,
        missedCallsCount: missed?.length || 0
      });

    } catch (error) {
      console.error('Error loading call data:', error);
      toast.error('Failed to load call data');
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Use auth_id - this is what's stored in incoming_call_requests.expert_id
    const expertAuthId = expert?.auth_id || expert?.id;
    if (!expertAuthId) return;

    console.log('🔔 Setting up real-time subscription for expert auth_id:', expertAuthId);

    // Subscribe to incoming call requests - expert_id references auth_id
    const callsSubscription = supabase
      .channel(`incoming_calls_${expertAuthId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'incoming_call_requests',
          filter: `expert_id=eq.${expertAuthId}` // Must match auth_id used in callService.ts
        },
        (payload) => {
          console.log('📞 Real-time call received:', payload);
          const newCall = payload.new as CallRequest;
          
          // Only process pending calls
          if (newCall.status === 'pending') {
            setIncomingCalls(prev => {
              // Avoid duplicates
              if (prev.some(call => call.id === newCall.id)) {
                return prev;
              }
              return [newCall, ...prev];
            });
            
            // Show incoming call dialog popup
            setIncomingCallDialog(newCall);
            
            // Show toast notification as backup
            const userName = newCall.user_metadata?.name || 'A user';
            toast.info(`📞 Incoming ${newCall.call_type} call from ${userName}!`, {
              duration: 5000
            });

            // Request browser notification permission and show native notification
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                const notification = new Notification(`📞 Incoming ${newCall.call_type} Call`, {
                  body: `${userName} wants to have a ${newCall.call_type} call with you`,
                  icon: newCall.user_metadata?.avatar || '/favicon.ico',
                  tag: `call-${newCall.id}`,
                  requireInteraction: true,
                  badge: '/favicon.ico'
                });

                // Handle notification click
                notification.onclick = () => {
                  window.focus();
                  setIncomingCallDialog(newCall);
                  notification.close();
                };
              } catch (err) {
                console.warn('⚠️ Could not show browser notification:', err);
              }
            } else if ('Notification' in window && Notification.permission === 'default') {
              // Request permission
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  try {
                    const notification = new Notification(`📞 Incoming ${newCall.call_type} Call`, {
                      body: `${userName} wants to have a ${newCall.call_type} call with you`,
                      icon: newCall.user_metadata?.avatar || '/favicon.ico',
                      tag: `call-${newCall.id}`,
                      requireInteraction: true
                    });

                    notification.onclick = () => {
                      window.focus();
                      setIncomingCallDialog(newCall);
                      notification.close();
                    };
                  } catch (err) {
                    console.warn('⚠️ Could not show browser notification:', err);
                  }
                }
              });
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to incoming calls');
        }
      });

    // Subscribe to offline messages (gracefully handle if table doesn't exist)
    let messagesSubscription: any = null;
    try {
      messagesSubscription = supabase
        .channel('away_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'expert_away_messages',
            filter: `expert_id=eq.${expert.auth_id}`
          },
          (payload) => {
            const newMessage = payload.new as OfflineMessage;
            setOfflineMessages(prev => [newMessage, ...prev]);
            
            toast.info('New offline message received');
          }
        )
        .subscribe((status, err) => {
          if (err) {
            // Table might not exist - silently ignore
            console.log('ℹ️ Could not subscribe to away messages (table may not exist)');
          }
        });
    } catch (error) {
      console.log('ℹ️ Could not subscribe to away messages (table may not exist):', error);
    }

    return () => {
      callsSubscription.unsubscribe();
      if (messagesSubscription) {
        messagesSubscription.unsubscribe();
      }
    };
  };


  const loadAcceptedCall = async (callId: string) => {
    try {
      // Fetch full call request with channel details and call session metadata
      const { data: fullCall, error: fetchError } = await supabase
        .from('incoming_call_requests')
        .select(`
          *,
          call_sessions (
            id,
            channel_name,
            agora_channel_name,
            call_metadata,
            status
          )
        `)
        .eq('id', callId)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching accepted call details:', fetchError);
        toast.error('Failed to load call details');
        return;
      }

      if (fullCall && fullCall.status === 'accepted') {
        // Extract expert token and UID from call_session metadata
        const callSession = (fullCall as any).call_sessions;
        const metadata = callSession?.call_metadata || {};
        const expertToken = metadata.expert_token || null;
        const expertUid = metadata.expert_uid || null;
        const channelName = callSession?.agora_channel_name || callSession?.channel_name || (fullCall as any).channel_name;
        
        // Create call request object with all necessary data
        const callRequestData: CallRequest = {
          ...fullCall,
          channel_name: channelName,
          agora_token: expertToken,
          agora_uid: expertUid,
          call_session_id: callSession?.id || (fullCall as any).call_session_id,
          status: 'accepted'
        } as CallRequest;

        setCurrentCall(callRequestData);
        toast.success('Call accepted - connecting...');
      }
    } catch (error) {
      console.error('Error loading accepted call:', error);
      toast.error('Failed to load call');
    }
  };

  const handleAcceptCall = async (callId: string) => {
    try {
      const success = await acceptCall(callId);
      
      if (!success) {
        toast.error('Failed to accept call');
        return;
      }

      // Load the accepted call
      await loadAcceptedCall(callId);
      
      // Remove from incoming calls list
      setIncomingCalls(prev => prev.filter(c => c.id !== callId));
      setIncomingCallDialog(null); // Close dialog
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  };

  const handleDeclineCall = async (callId: string) => {
    try {
      const success = await declineCall(callId);
      
      if (!success) {
        toast.error('Failed to decline call');
        return;
      }

      setIncomingCalls(prev => prev.filter(c => c.id !== callId));
      setIncomingCallDialog(null); // Close dialog
      toast.info('Call declined');
    } catch (error) {
      console.error('Error declining call:', error);
      toast.error('Failed to decline call');
    }
  };

  const handleCallBack = async (callId: string) => {
    try {
      // Create a new outgoing call request
      const missedCall = missedCalls.find(c => c.id === callId);
      if (!missedCall) return;

      // In a real implementation, this would initiate an outgoing call
      toast.success('Calling back user...');
      
      // Send auto-message to user about callback
      await supabase
        .from('messages')
        .insert({
          sender_id: expert.auth_id,
          receiver_id: missedCall.user_id,
          content: `Hi! I noticed you tried to call me earlier. I'm calling you back now.`
        });

    } catch (error) {
      console.error('Error calling back:', error);
      toast.error('Failed to initiate callback');
    }
  };

  const handleMarkMessageRead = async (messageId: string) => {
    try {
      await supabase.rpc('mark_away_message_read', { message_id: messageId });
      setOfflineMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Call Management</h1>
          <p className="text-muted-foreground">
            Manage your live calls, availability, and communication
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {(() => {
            if (!expert?.auth_id) return null;
            const presence = getExpertPresence(expert.auth_id);
            const status = presence?.status || 'offline';
            const isAvailable = presence?.isAvailable || false;
            
            return (
              <>
                <Badge variant={status === 'available' ? 'default' : 'secondary'}>
                  {status === 'available' ? 'Available' : 
                   status === 'busy' ? 'Busy' :
                   status === 'away' ? 'Away' : 'Offline'}
                </Badge>
                <Badge variant={isAvailable ? 'default' : 'outline'}>
                  {isAvailable ? 'Accepting Calls' : 'Not Accepting Calls'}
                </Badge>
              </>
            );
          })()}
          <div className="text-sm text-muted-foreground">
            Use the Online Status control to manage call availability
          </div>
        </div>
      </div>

      {/* Call Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Calls</p>
                <p className="text-3xl font-bold">{callStats.todaysCalls}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Duration</p>
                <p className="text-3xl font-bold">{formatDuration(callStats.totalDuration)}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                <p className="text-3xl font-bold">{currencySymbol}{callStats.earnings}</p>
              </div>
              <Badge className="h-8 w-8 p-0 text-purple-500" variant="outline">{currencySymbol}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Missed Calls</p>
                <p className="text-3xl font-bold">{callStats.missedCallsCount}</p>
              </div>
              <PhoneMissed className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="incoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incoming">
            Incoming Calls
            {incomingCalls.length > 0 && (
              <Badge variant="destructive" className="ml-2">{incomingCalls.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="missed">
            Missed Calls
            {missedCalls.length > 0 && (
              <Badge variant="secondary" className="ml-2">{missedCalls.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages">
            Offline Messages
            {offlineMessages.length > 0 && (
              <Badge variant="default" className="ml-2">{offlineMessages.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Incoming Calls */}
        <TabsContent value="incoming">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Call Requests</CardTitle>
              <CardDescription>
                Live call requests waiting for your response
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incomingCalls.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No incoming calls</p>
                  <p className="text-sm">New call requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingCalls.map((call) => (
                    <div key={call.id} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {call.call_type === 'video' ? (
                            <Video className="h-8 w-8 text-blue-500" />
                          ) : (
                            <Phone className="h-8 w-8 text-green-500" />
                          )}
                          <div>
                            <h3 className="font-semibold">
                              {call.user_metadata?.name || 'Anonymous User'}
                            </h3>
                             <p className="text-sm text-gray-600">
                               {call.call_type} call • {call.estimated_cost_inr ? `₹${call.estimated_cost_inr}` : call.estimated_cost_eur ? `€${call.estimated_cost_eur}` : `$${call.estimated_cost_usd || 0}`}
                             </p>
                            <p className="text-xs text-gray-500">
                              Requested at {formatTime(call.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineCall(call.id)}
                          >
                            <PhoneOff className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleAcceptCall(call.id)}
                          >
                            <PhoneCall className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Missed Calls */}
        <TabsContent value="missed">
          <Card>
            <CardHeader>
              <CardTitle>Missed Calls</CardTitle>
              <CardDescription>
                Calls you missed - you can call back these users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {missedCalls.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No missed calls</p>
                  <p className="text-sm">Great job staying available!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {missedCalls.map((call) => (
                    <div key={call.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <PhoneMissed className="h-8 w-8 text-orange-500" />
                          <div>
                            <h3 className="font-semibold">
                              {call.user_metadata?.name || 'Anonymous User'}
                            </h3>
                             <p className="text-sm text-gray-600">
                               {call.call_type} call • {call.estimated_cost_inr ? `₹${call.estimated_cost_inr}` : call.estimated_cost_eur ? `€${call.estimated_cost_eur}` : `$${call.estimated_cost_usd || 0}`}
                             </p>
                            <p className="text-xs text-gray-500">
                              Missed at {formatTime(call.created_at)}
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleCallBack(call.id)}
                        >
                          <PhoneCall className="h-4 w-4 mr-1" />
                          Call Back
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offline Messages */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Offline Messages</CardTitle>
              <CardDescription>
                Messages from users when you were unavailable
              </CardDescription>
            </CardHeader>
            <CardContent>
              {offlineMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No offline messages</p>
                  <p className="text-sm">Messages from unavailable periods will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {offlineMessages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {message.user_metadata?.name || 'Anonymous User'}
                          </h3>
                          <p className="text-sm text-gray-700 mt-1">
                            {message.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Sent at {formatTime(message.sent_at)}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkMessageRead(message.id)}
                        >
                          Mark Read
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Preferences</CardTitle>
                <CardDescription>Configure your call settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-accept calls</h3>
                    <p className="text-sm text-gray-600">Automatically accept incoming calls</p>
                  </div>
                  <Switch 
                    checked={autoAcceptCalls} 
                    onCheckedChange={setAutoAcceptCalls}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sound notifications</h3>
                    <p className="text-sm text-gray-600">Play sound for incoming calls</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email notifications</h3>
                    <p className="text-sm text-gray-600">Receive email for missed calls</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability Schedule</CardTitle>
                <CardDescription>Set your default availability hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Availability schedule</p>
                    <p className="text-sm">Configure your weekly availability</p>
                    <Button variant="outline" className="mt-4">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Current Call Interface - Show in Modal */}
      {currentCall && currentCall.status === 'accepted' && (
        <ExpertInCallModal
          isOpen={true}
          onClose={() => {
            setCurrentCall(null);
            toast.info('Call ended');
          }}
          callRequest={{
            id: currentCall.id,
            user_id: currentCall.user_id,
            call_type: currentCall.call_type as 'audio' | 'video',
            channel_name: currentCall.channel_name || '',
            agora_token: currentCall.agora_token || null,
            agora_uid: currentCall.agora_uid || null,
            user_metadata: currentCall.user_metadata || {},
            call_session_id: currentCall.call_session_id || null
          }}
          onCallEnd={() => {
            setCurrentCall(null);
            toast.info('Call ended');
          }}
        />
      )}

      {/* Incoming Call Dialog */}
      <IncomingCallDialog
        callRequest={incomingCallDialog}
        isOpen={!!incomingCallDialog}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        onClose={() => setIncomingCallDialog(null)}
      />
    </div>
  );
};

export default CallManagementPage;