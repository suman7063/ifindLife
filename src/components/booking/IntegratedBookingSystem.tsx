import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ModernBookingInterface from './ModernBookingInterface';
import EnhancedAgoraCallModal from '../call/modals/EnhancedAgoraCallModal';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { Calendar, Phone, Video, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Expert {
  id: string;
  name: string;
  profile_picture?: string;
  specialization?: string;
  price?: number;
}

interface IntegratedBookingSystemProps {
  expert: Expert;
  onClose?: () => void;
}

const IntegratedBookingSystem: React.FC<IntegratedBookingSystemProps> = ({
  expert,
  onClose
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'schedule' | 'instant'>('instant');
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [isBooking, setIsBooking] = useState(false);
  const { processPayment } = useRazorpayPayment();

  const { getExpertPresence } = useExpertPresence();
  
  const expertPresence = getExpertPresence(expert.id);
  const expertAvailability = expertPresence?.status === 'online' ? 'available' : 
                            expertPresence?.status === 'away' ? 'away' : 'offline';
  const online = expertPresence?.isAvailable || false;
  const lastSeen = expertPresence?.lastActivity ? 
    new Date(expertPresence.lastActivity).toLocaleString() : 'Unknown';

  const handleInstantCall = (type: 'voice' | 'video') => {
    if (!isAuthenticated) {
      toast.error('Please log in to start a call');
      navigate('/user-login');
      return;
    }

    if (!online || expertAvailability === 'offline') {
      toast.error('Expert is currently offline');
      return;
    }

    // Note: 'busy' status removed from simplified system

    setCallType(type);
    setIsCallModalOpen(true);
  };

  const handleScheduledBooking = async (slotIds: string[], date: string, startTime: string, endTime: string, totalPrice: number) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to book an appointment');
      navigate('/user-login');
      return;
    }

    try {
      setIsBooking(true);

      // Calculate duration in minutes
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

      // Process payment first using Razorpay
      await processPayment(
        {
          amount: Math.round(totalPrice * 100), // Convert to paise
          currency: 'INR',
          description: `Appointment with ${expert.name} - ${slotIds.length} slots`,
          expertId: expert.id,
        },
        async (paymentId: string, orderId: string) => {
          // Payment successful, create appointment
          try {
            // Generate channel name for Agora call
            const channelName = `appointment_${Date.now()}_${user.id}`;
            
            // Generate Agora token for the appointment
            const { data: tokenData, error: tokenError } = await supabase.functions.invoke('generate-agora-token', {
              body: {
                channelName,
                uid: Math.floor(Math.random() * 1000000),
                role: 1,
                expireTime: 3600 // 1 hour token validity
              }
            });

            if (tokenError) {
              console.error('Failed to generate Agora token:', tokenError);
            }

            // Create appointment in database
            const { data: appointment, error } = await supabase
              .from('appointments')
              .insert({
                user_id: user.id,
                expert_id: expert.id,
                expert_name: expert.name,
                appointment_date: date,
                start_time: startTime,
                end_time: endTime,
                status: 'confirmed', // Since payment was processed
                time_slot_id: slotIds[0], // Use first slot ID for reference
                duration: durationMinutes,
                notes: `Scheduled consultation with ${expert.name} - ${slotIds.length} slots booked`,
                channel_name: channelName,
                token: tokenData?.token || null
              })
              .select()
              .single();

            if (error) throw error;

            // Mark the time slots as booked
            if (slotIds.length > 0) {
              const baseSlotIds = slotIds.map(id => id.split('-')[0]).filter((value, index, self) => self.indexOf(value) === index);
              
              await supabase
                .from('expert_time_slots')
                .update({ is_booked: true })
                .in('id', baseSlotIds);
            }

            // Record transaction with correct currency
            await supabase
              .from('user_transactions')
              .insert({
                user_id: user.id,
                amount: totalPrice,
                date: new Date().toISOString(),
                type: 'appointment_payment',
                currency: 'INR', // Match the payment currency
                description: `Appointment with ${expert.name} on ${date} - Payment ID: ${paymentId}`
              });

            // Send confirmation notification
            await supabase.functions.invoke('send-appointment-notification', {
              body: {
                appointmentId: appointment.id,
                type: 'confirmation'
              }
            });

            toast.success('Appointment booked and payment processed successfully!');
            
            if (onClose) onClose();
          } catch (appointmentError: any) {
            console.error('Error creating appointment after payment:', appointmentError);
            toast.error('Payment successful but failed to create appointment. Please contact support.');
          }
        },
        (error: any) => {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
          setIsBooking(false);
        }
      );

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
      setIsBooking(false);
    }
  };

  const getAvailabilityBadge = () => {
    if (!online) return <Badge variant="secondary">Offline</Badge>;
    
    switch (expertAvailability) {
      case 'available':
        return <Badge variant="default" className="bg-green-500">Available</Badge>;
      case 'away':
        return <Badge variant="secondary">Away</Badge>;
      default:
        return <Badge variant="secondary">Offline</Badge>;
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                {expert.profile_picture ? (
                  <img 
                    src={expert.profile_picture} 
                    alt={expert.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                    {expert.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-xl">{expert.name}</CardTitle>
                <p className="text-muted-foreground">{expert.specialization}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getAvailabilityBadge()}
                  <span className="text-sm text-muted-foreground">
                    Last seen: {lastSeen}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${expert.price || 30}/hr</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'schedule' | 'instant')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="instant" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Instant Call
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Appointment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="instant" className="space-y-4">
              <div className="text-center py-6">
                <h3 className="text-lg font-semibold mb-2">Connect Instantly</h3>
                <p className="text-muted-foreground mb-6">
                  Start a conversation right now if the expert is available
                </p>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button
                    onClick={() => handleInstantCall('voice')}
                    disabled={!online || expertAvailability !== 'available'}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Phone className="h-4 w-4" />
                    Voice Call
                  </Button>
                  <Button
                    onClick={() => handleInstantCall('video')}
                    disabled={!online || expertAvailability !== 'available'}
                    className="flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Video Call
                  </Button>
                </div>

                {(!online || expertAvailability !== 'available') && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {!online 
                        ? 'Expert is currently offline. Try scheduling an appointment instead.' 
                        : 'Expert is away. Try scheduling an appointment or check back later.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <ModernBookingInterface
                expertId={expert.id}
                expertName={expert.name}
                expertAvatar={expert.profile_picture}
                onBookingConfirm={handleScheduledBooking}
              />
              {isBooking && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Booking appointment...</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Call Modal */}
      <EnhancedAgoraCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        expert={{
          id: parseInt(expert.id),
          name: expert.name,
          imageUrl: expert.profile_picture || '',
          price: expert.price || 30
        }}
      />
    </>
  );
};

export default IntegratedBookingSystem;