/**
 * Timezone utility functions for converting times between timezones
 */

/**
 * Convert a time string (HH:MM) from one timezone to another
 * @param timeString - Time in format "HH:MM" (e.g., "09:00")
 * @param fromTimezone - Source timezone (e.g., "Asia/Kolkata")
 * @param toTimezone - Target timezone (e.g., "America/New_York")
 * @param date - Date for the conversion (defaults to today)
 * @returns Converted time string in format "HH:MM"
 */
export function convertTimeBetweenTimezones(
  timeString: string,
  fromTimezone: string,
  toTimezone: string,
  date: Date = new Date()
): string {
  try {
    // Parse the time string
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Create a date object in the source timezone
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const dateTimeStr = `${dateStr}T${timeString}:00`;
    
    // Create date in source timezone
    const sourceDate = new Date(dateTimeStr);
    
    // Get the time in the target timezone
    const targetDate = new Date(
      sourceDate.toLocaleString('en-US', { timeZone: fromTimezone })
    );
    
    // Convert to target timezone
    const targetTimeStr = targetDate.toLocaleString('en-US', {
      timeZone: toTimezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return targetTimeStr;
  } catch (error) {
    console.error('Error converting timezone:', error);
    return timeString; // Return original if conversion fails
  }
}

/**
 * Get user's timezone from browser or default to UTC
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Format time for display with timezone info
 */
export function formatTimeWithTimezone(
  timeString: string,
  timezone: string
): string {
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return timeString;
  }
}

/**
 * Convert expert's availability time to user's timezone
 */
export function convertExpertTimeToUserTimezone(
  timeString: string,
  expertTimezone: string,
  userTimezone: string,
  date: Date = new Date()
): string {
  if (expertTimezone === userTimezone) {
    return timeString;
  }
  
  return convertTimeBetweenTimezones(timeString, expertTimezone, userTimezone, date);
}

