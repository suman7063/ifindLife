/**
 * Availability validation utilities to prevent overlapping slots and ensure data integrity
 */

export interface TimeSlot {
  start_time: string;
  end_time: string;
  day_of_week?: number;
  specific_date?: string | null;
  timezone?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate that a time slot doesn't overlap with existing slots
 */
export const validateTimeSlotOverlap = (
  newSlot: TimeSlot,
  existingSlots: TimeSlot[]
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Convert time strings to minutes for easier comparison
  const timeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const newStart = timeToMinutes(newSlot.start_time);
  const newEnd = timeToMinutes(newSlot.end_time);

  // Basic validation
  if (newStart >= newEnd) {
    errors.push('End time must be after start time');
  }

  if (newEnd - newStart < 30) {
    warnings.push('Time slots shorter than 30 minutes may not be bookable');
  }

  // Check for overlaps with existing slots
  const relevantSlots = existingSlots.filter(slot => {
    // For recurring slots, match by day_of_week
    if (newSlot.day_of_week && slot.day_of_week) {
      return slot.day_of_week === newSlot.day_of_week;
    }
    // For specific date slots, match by date
    if (newSlot.specific_date && slot.specific_date) {
      return slot.specific_date === newSlot.specific_date;
    }
    return false;
  });

  for (const existingSlot of relevantSlots) {
    const existingStart = timeToMinutes(existingSlot.start_time);
    const existingEnd = timeToMinutes(existingSlot.end_time);

    // Check for overlap: slots overlap if one starts before the other ends
    const hasOverlap = (
      (newStart < existingEnd && newEnd > existingStart) ||
      (existingStart < newEnd && existingEnd > newStart)
    );

    if (hasOverlap) {
      errors.push(
        `Time slot ${newSlot.start_time}-${newSlot.end_time} overlaps with existing slot ${existingSlot.start_time}-${existingSlot.end_time}`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate timezone format
 */
export const validateTimezone = (timezone: string): boolean => {
  try {
    // Try to create a date in the timezone to validate it
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate that a date range is valid
 */
export const validateDateRange = (startDate: string, endDate: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to beginning of day

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    errors.push('Invalid date format');
  } else {
    if (start >= end) {
      errors.push('End date must be after start date');
    }

    if (start < today) {
      warnings.push('Start date is in the past');
    }

    const daysDifference = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference > 365) {
      warnings.push('Availability period longer than 1 year may affect performance');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate that time slots are properly formatted and logical
 */
export const validateTimeSlots = (slots: TimeSlot[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (slots.length === 0) {
    errors.push('At least one time slot is required');
    return { isValid: false, errors, warnings };
  }

  // Check for duplicate slots
  const slotKeys = new Set<string>();
  for (const slot of slots) {
    const key = `${slot.start_time}-${slot.end_time}-${slot.day_of_week || 'none'}-${slot.specific_date || 'none'}`;
    if (slotKeys.has(key)) {
      errors.push(`Duplicate time slot found: ${slot.start_time}-${slot.end_time}`);
    }
    slotKeys.add(key);

    // Validate individual slot
    const slotValidation = validateTimeSlotOverlap(slot, []);
    errors.push(...slotValidation.errors);
    warnings.push(...slotValidation.warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Normalize expert ID to ensure consistency
 */
export const normalizeExpertId = (expert: any): string => {
  // Always prefer auth_id over id for consistency
  return expert?.auth_id || '';
};

/**
 * Generate a unique key for a time slot to prevent duplicates
 */
export const generateSlotKey = (slot: TimeSlot): string => {
  return `${slot.start_time}-${slot.end_time}-${slot.day_of_week || 'none'}-${slot.specific_date || 'none'}-${slot.timezone || 'UTC'}`;
};