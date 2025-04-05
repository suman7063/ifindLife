
// Simple analytics logging utility

/**
 * Log an event to analytics
 * 
 * @param category - The category of the event
 * @param action - The action performed
 * @param data - Additional data for the event
 */
export const logEvent = (category: string, action: string, data?: Record<string, any>): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${category} - ${action}`, data);
    return;
  }

  // In production, this would send data to your analytics service
  // For example, using Google Analytics, Mixpanel, etc.
  try {
    // This is a placeholder for actual analytics implementation
    // Example: analytics.track(category, action, data);
    
    // For now, just log to console in production as well
    console.log(`[Analytics] ${category} - ${action}`, data);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

/**
 * Track a page view
 * 
 * @param pageName - The name or path of the page
 * @param pageData - Additional page data
 */
export const trackPageView = (pageName: string, pageData?: Record<string, any>): void => {
  logEvent('pageview', pageName, pageData);
};

export default {
  logEvent,
  trackPageView
};
