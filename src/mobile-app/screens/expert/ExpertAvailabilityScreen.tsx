import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Clock, Plus, Trash2 } from 'lucide-react';

// Mock data
const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

export const ExpertAvailabilityScreen: React.FC = () => {
  const [availability, setAvailability] = useState({
    monday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    friday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] }
  });

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        enabled: !prev[day as keyof typeof prev].enabled
      }
    }));
  };

  return (
    <div className="flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10 p-6 rounded-b-3xl">
        <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
          Availability
        </h1>
        <p className="text-muted-foreground">
          Set your weekly working hours
        </p>
      </div>

      <div className="p-6 space-y-4">
        {daysOfWeek.map((day) => {
          const dayData = availability[day.id as keyof typeof availability];
          return (
            <Card key={day.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor={day.id} className="text-base font-poppins font-medium text-ifind-charcoal">
                    {day.label}
                  </Label>
                  <Switch
                    id={day.id}
                    checked={dayData.enabled}
                    onCheckedChange={() => toggleDay(day.id)}
                  />
                </div>

                {dayData.enabled && (
                  <div className="space-y-2">
                    {dayData.slots.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1 flex items-center space-x-2 p-2 bg-ifind-grey/30 rounded-lg">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{slot.start}</span>
                          <span className="text-muted-foreground">-</span>
                          <span className="text-sm font-medium">{slot.end}</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-ifind-teal border-dashed"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time Slot
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        <Button className="w-full bg-gradient-to-r from-ifind-teal to-ifind-aqua hover:from-ifind-teal/90 hover:to-ifind-aqua/90 mt-6">
          Save Availability
        </Button>
      </div>
    </div>
  );
};
