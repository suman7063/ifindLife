
import { supabase } from '@/lib/supabase';
import { TimeSlot } from '@/types/supabase/appointments';

export async function fetchExpertAvailability(expertId: string, date: string): Promise<TimeSlot[]> {
  try {
    const { data, error } = await supabase
      .from('expert_availability')
      .select()
      .eq('expert_id', expertId)
      .eq('date', date);
    
    if (error) {
      throw error;
    }
    
    // Map the data to TimeSlot format
    const slots: TimeSlot[] = data ? data.map(slot => ({
      id: String(slot.id),
      expertId: slot.expert_id,
      date: slot.date,
      startTime: slot.start_time,
      endTime: slot.end_time,
      isAvailable: slot.is_available
    })) : [];
    
    return slots;
  } catch (error) {
    return [];
  }
}

export async function updateExpertAvailability(
  slotId: string, 
  isAvailable: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('expert_availability')
      .update({ is_available: isAvailable })
      .eq('id', slotId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
}

export async function createExpertAvailability(
  expertId: string,
  date: string,
  startTime: string,
  endTime: string,
  isAvailable: boolean
): Promise<TimeSlot | null> {
  try {
    const newSlot = {
      expert_id: expertId,
      date: date,
      start_time: startTime,
      end_time: endTime,
      is_available: isAvailable
    };
    
    const { data, error } = await supabase
      .from('expert_availability')
      .insert(newSlot)
      .select();
      
    if (error) throw error;
    
    if (data && data[0]) {
      return {
        id: String(data[0].id),
        expertId: data[0].expert_id,
        date: data[0].date,
        startTime: data[0].start_time,
        endTime: data[0].end_time,
        isAvailable: data[0].is_available
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function deleteExpertAvailability(slotId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('expert_availability')
      .delete()
      .eq('id', slotId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
}
