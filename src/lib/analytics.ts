
/**
 * Simple analytics logging utility for the application
 */

type EventCategory = 'auth' | 'user' | 'expert' | 'program' | 'service' | 'navigation';
type EventAction = string;
type EventData = Record<string, any>;

/**
 * Log an event with optional data payload
 * 
 * @param category - The event category (e.g., 'auth', 'user')
 * @param action - The specific action being performed
 * @param data - Optional data related to the event
 */
export const logEvent = (
  category: EventCategory,
  action: EventAction,
  data?: EventData
): void => {
  // In development, log to console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics] ${category}:${action}`, data || '');
    return;
  }

  // In production, this would send data to a proper analytics service
  // This is just a placeholder for future implementation
  try {
    // Here you would implement connection to an analytics service
    // Example: sendToAnalyticsService(category, action, data);
  } catch (error) {
    console.error('[Analytics] Error logging event:', error);
  }
};

/**
 * Track page views
 * 
 * @param pageName - The name or path of the page being viewed
 * @param properties - Additional properties to log with the page view
 */
export const trackPageView = (
  pageName: string, 
  properties?: Record<string, any>
): void => {
  logEvent('navigation', 'page_view', {
    page: pageName,
    timestamp: new Date().toISOString(),
    ...properties
  });
};
