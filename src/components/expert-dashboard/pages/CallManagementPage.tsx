import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CallRequest {
  id: string;
  user_id: string;
  call_type: string;
  estimated_cost_usd: number;
  estimated_cost_inr: number;
  status: string;
  created_at: string;
  expires_at: string;
  user_metadata?: any;
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
  
  const [autoAcceptCalls, setAutoAcceptCalls] = useState(false);
  const [incomingCalls, setIncomingCalls] = useState<CallRequest[]>([]);
  const [missedCalls, setMissedCalls] = useState<CallRequest[]>([]);
  const [offlineMessages, setOfflineMessages] = useState<OfflineMessage[]>([]);
  const [currentCall, setCurrentCall] = useState<CallRequest | null>(null);
  const [callStats, setCallStats] = useState({
    todaysCalls: 0,
    totalDuration: 0,
    earnings: 0,
    missedCallsCount: 0
  });

  useEffect(() => {
    if (expert?.id) {
      loadCallData();
      setupRealtimeSubscriptions();
    }
  }, [expert?.id]);

  const loadCallData = async () => {
    if (!expert?.id) return;

    try {
      // Load incoming call requests
      const { data: calls, error: callsError } = await supabase
        .from('incoming_call_requests')
        .select('*')
        .eq('expert_id', expert.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (callsError) throw callsError;
      setIncomingCalls(calls || []);

      // Load missed calls
      const { data: missed, error: missedError } = await supabase
        .from('incoming_call_requests')
        .select('*')
        .eq('expert_id', expert.id)
        .eq('status', 'expired')
        .order('created_at', { ascending: false })
        .limit(10);

      if (missedError) throw missedError;
      setMissedCalls(missed || []);

      // Load offline messages
      const { data: messages, error: messagesError } = await supabase
        .from('expert_away_messages')
        .select('*')
        .eq('expert_id', expert.id)
        .eq('is_read', false)
        .order('sent_at', { ascending: false });

      if (messagesError) throw messagesError;
      setOfflineMessages(messages || []);

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
    if (!expert?.id) return;

    // Subscribe to incoming call requests
    const callsSubscription = supabase
      .channel('incoming_calls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'incoming_call_requests',
          filter: `expert_id=eq.${expert.id}`
        },
        (payload) => {
          const newCall = payload.new as CallRequest;
          setIncomingCalls(prev => [newCall, ...prev]);
          
          // Show notification
          toast.info(`Incoming ${newCall.call_type} call!`, {
            action: {
              label: 'Answer',
              onClick: () => handleAcceptCall(newCall.id)
            }
          });
        }
      )
      .subscribe();

    // Subscribe to offline messages
    const messagesSubscription = supabase
      .channel('away_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'expert_away_messages',
          filter: `expert_id=eq.${expert.id}`
        },
        (payload) => {
          const newMessage = payload.new as OfflineMessage;
          setOfflineMessages(prev => [newMessage, ...prev]);
          
          toast.info('New offline message received');
        }
      )
      .subscribe();

    return () => {
      callsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  };


  const handleAcceptCall = async (callId: string) => {
    try {
      const { error } = await supabase
        .from('incoming_call_requests')
        .update({ status: 'accepted' })
        .eq('id', callId);

      if (error) throw error;

      const call = incomingCalls.find(c => c.id === callId);
      if (call) {
        setCurrentCall(call);
        setIncomingCalls(prev => prev.filter(c => c.id !== callId));
        toast.success('Call accepted - connecting...');
      }
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  };

  const handleDeclineCall = async (callId: string) => {
    try {
      const { error } = await supabase
        .from('incoming_call_requests')
        .update({ status: 'declined' })
        .eq('id', callId);

      if (error) throw error;

      setIncomingCalls(prev => prev.filter(c => c.id !== callId));
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
          sender_id: expert.id,
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
                <Badge variant={status === 'online' ? 'default' : 'secondary'}>
                  {status === 'online' ? 'Available' : 
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
                <p className="text-3xl font-bold">${callStats.earnings}</p>
              </div>
              <Badge className="h-8 w-8 p-0 text-purple-500" variant="outline">$</Badge>
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
                              {call.call_type} call • ${call.estimated_cost_usd}
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
                              {call.call_type} call • ${call.estimated_cost_usd}
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

      {/* Current Call Interface */}
      {currentCall && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Active Call</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {currentCall.user_metadata?.name || 'Anonymous User'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentCall.call_type} call in progress
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <MicOff className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => setCurrentCall(null)}
                >
                  <PhoneOff className="h-4 w-4 mr-1" />
                  End Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CallManagementPage;