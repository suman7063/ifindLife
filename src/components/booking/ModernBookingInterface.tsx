import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { useExpertAvailability } from '@/hooks/useExpertAvailability';
import { useExpertPricing } from '@/hooks/useExpertPricing';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  User,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, startOfToday } from 'date-fns';

interface ModernBookingInterfaceProps {
  expertId: string;
  expertName: string;
  expertAvatar?: string;
  onBookingConfirm: (slotIds: string[], date: string, startTime: string, endTime: string, totalPrice: number) => void;
}

type BookingStep = 'date' | 'time' | 'payment' | 'confirm';

const ModernBookingInterface: React.FC<ModernBookingInterfaceProps> = ({
  expertId,
  expertName,
  expertAvatar,
  onBookingConfirm
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  const { 
    loading, 
    error, 
    generate30MinuteSlots, 
    getAvailabilityCalendar,
    availabilities
  } = useExpertAvailability(expertId);

  const {
    loading: pricingLoading,
    getSlotPrice,
    calculateTotalPrice,
    formatPrice
  } = useExpertPricing(expertId);

  const selectedDateString = selectedDate?.toISOString().split('T')[0] || '';
  const availableSlots = selectedDate ? generate30MinuteSlots(selectedDateString) : [];
  const availabilityCalendar = getAvailabilityCalendar();
  
  // Calculate selected slots info
  const totalSelectedSlots = selectedSlots.length;
  const totalPrice = calculateTotalPrice(totalSelectedSlots);
  const slotPrice = getSlotPrice();

  // Check if expert has any availability set
  const hasAvailability = availabilities && availabilities.length > 0;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return availabilityCalendar[dateString] || false;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlots([]);
    if (date && isDateAvailable(date)) {
      setCurrentStep('time');
    }
  };

  const handleSlotToggle = (slotId: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        return [...prev, slotId].sort();
      }
    });
  };

  const handleContinueToPayment = () => {
    if (selectedSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }
    setCurrentStep('payment');
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || selectedSlots.length === 0) {
      toast.error('Please select a date and time slots');
      return;
    }

    const firstSlot = availableSlots.find(s => s.id === selectedSlots[0]);
    const lastSlot = availableSlots.find(s => s.id === selectedSlots[selectedSlots.length - 1]);
    
    if (!firstSlot || !lastSlot) {
      toast.error('Selected time slots are no longer available');
      return;
    }

    onBookingConfirm(selectedSlots, selectedDateString, firstSlot.start_time, lastSlot.end_time, totalPrice);
  };

  const goBack = () => {
    if (currentStep === 'time') {
      setCurrentStep('date');
      setSelectedSlots([]);
    } else if (currentStep === 'payment') {
      setCurrentStep('time');
    } else if (currentStep === 'confirm') {
      setCurrentStep('payment');
    }
  };

  if (loading || pricingLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Loading availability</h3>
              <p className="text-muted-foreground">Please wait while we fetch available time slots...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-destructive">Error loading availability</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasAvailability) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">No availability set</h3>
              <p className="text-muted-foreground">
                The expert has not shared the availability slots yet. Please check back later or contact the expert directly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-0">
        {/* Header with expert info */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-4">
            {expertAvatar ? (
              <img 
                src={expertAvatar} 
                alt={expertName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">Book with {expertName}</h2>
              <p className="text-muted-foreground">Choose your preferred time slot</p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep === 'date' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'date' ? 'border-primary bg-primary text-primary-foreground' : 
                selectedDate ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
              }`}>
                {selectedDate ? <CheckCircle2 className="h-4 w-4" /> : '1'}
              </div>
              <span className="font-medium">Select Date</span>
            </div>
            
            <div className={`h-px flex-1 ${selectedDate ? 'bg-primary' : 'bg-muted'}`} />
            
            <div className={`flex items-center gap-2 ${currentStep === 'time' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'time' ? 'border-primary bg-primary text-primary-foreground' : 
                selectedSlots.length > 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
              }`}>
                {selectedSlots.length > 0 ? <CheckCircle2 className="h-4 w-4" /> : '2'}
              </div>
              <span className="font-medium">Choose Time</span>
            </div>
            
            <div className={`h-px flex-1 ${selectedSlots.length > 0 ? 'bg-primary' : 'bg-muted'}`} />
            
            <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'payment' ? 'border-primary bg-primary text-primary-foreground' : 
                currentStep === 'confirm' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
              }`}>
                {currentStep === 'confirm' ? <CheckCircle2 className="h-4 w-4" /> : '3'}
              </div>
              <span className="font-medium">Payment</span>
            </div>

            <div className={`h-px flex-1 ${currentStep === 'confirm' ? 'bg-primary' : 'bg-muted'}`} />
            
            <div className={`flex items-center gap-2 ${currentStep === 'confirm' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'confirm' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
              }`}>
                4
              </div>
              <span className="font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6">
          {currentStep === 'date' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">When would you like to meet?</h3>
                <p className="text-muted-foreground">Select an available date from the calendar below</p>
              </div>
              
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    const today = startOfToday();
                    return date < today || !isDateAvailable(date);
                  }}
                  fromDate={startOfToday()}
                  toDate={addDays(startOfToday(), 90)}
                  className="rounded-md border shadow-sm"
                  classNames={{
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                  }}
                />
              </div>
            </div>
          )}

          {currentStep === 'time' && selectedDate && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="sm" onClick={goBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="text-lg font-semibold">Available times</h3>
                  <p className="text-muted-foreground">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              {availableSlots.length === 0 ? (
                <div className="text-center py-8 bg-muted/50 rounded-lg">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No available time slots for this date</p>
                  <Button variant="outline" onClick={goBack} className="mt-4">
                    Choose Different Date
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Rate per 30-min slot:</span>
                      <span className="font-semibold">{formatPrice(slotPrice)}</span>
                    </div>
                    {selectedSlots.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected:
                        </span>
                        <span className="font-bold text-primary">{formatPrice(totalPrice)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlots.includes(slot.id);
                      return (
                        <Button
                          key={slot.id}
                          variant={isSelected ? "default" : "outline"}
                          className={`h-auto p-4 ${
                            isSelected 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:border-primary hover:bg-primary/5'
                          }`}
                          onClick={() => handleSlotToggle(slot.id)}
                        >
                          <div className="text-center">
                            <div className="font-medium">
                              {formatTime(slot.start_time)}
                            </div>
                            <div className="text-xs mt-1 opacity-75">
                              {formatTime(slot.end_time)}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                  
                  {selectedSlots.length > 0 && (
                    <Button onClick={handleContinueToPayment} className="w-full">
                      Continue to Payment ({formatPrice(totalPrice)})
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 'payment' && selectedDate && selectedSlots.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="sm" onClick={goBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="text-lg font-semibold">Payment Details</h3>
                  <p className="text-muted-foreground">Review and confirm your booking</p>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expert</span>
                  <span className="font-medium">{expertName}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Slots ({selectedSlots.length})</span>
                  <div className="text-right">
                    {(() => {
                      const firstSlot = availableSlots.find(s => s.id === selectedSlots[0]);
                      const lastSlot = availableSlots.find(s => s.id === selectedSlots[selectedSlots.length - 1]);
                      return firstSlot && lastSlot ? (
                        <span className="font-medium">
                          {formatTime(firstSlot.start_time)} - {formatTime(lastSlot.end_time)}
                        </span>
                      ) : '';
                    })()}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rate per slot</span>
                  <span className="font-medium">{formatPrice(slotPrice)}</span>
                </div>
                
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setCurrentStep('confirm')} className="flex-1">
                  Process Payment
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'confirm' && selectedDate && selectedSlots.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="sm" onClick={goBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="text-lg font-semibold">Confirm your booking</h3>
                  <p className="text-muted-foreground">Please review your selection</p>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expert</span>
                  <span className="font-medium">{expertName}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Slots</span>
                  <span className="font-medium">
                    {(() => {
                      const firstSlot = availableSlots.find(s => s.id === selectedSlots[0]);
                      const lastSlot = availableSlots.find(s => s.id === selectedSlots[selectedSlots.length - 1]);
                      return firstSlot && lastSlot ? `${formatTime(firstSlot.start_time)} - ${formatTime(lastSlot.end_time)}` : '';
                    })()}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Amount Paid</span>
                  <span className="font-medium text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirmBooking} className="flex-1">
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernBookingInterface;