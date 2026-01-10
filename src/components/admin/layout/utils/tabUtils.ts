
/**
 * Helper function to get the title based on the active tab
 */
export const getTabTitle = (tab: string): string => {
  const titles: Record<string, string> = {
    overview: 'Dashboard Overview',
    experts: 'Experts Management',
    expertApprovals: 'Expert Approvals',
    'experts-list': 'Expert Management',
    'expert-categories': 'Expert Categories',
    'expert-services': 'Expert Services',
    services: 'Services Management',
    testimonials: 'Testimonials Management',
    programs: 'Programs Management',
    sessions: 'Sessions Management',
    referrals: 'Referrals Management',
    'programs-inquiry': 'Programs Inquiry',
    blog: 'Blog Management',
    contact: 'Contact Submissions',
    adminUsers: 'Admin Users Management',
    settings: 'Admin Settings'
  };
  
  return titles[tab] || 'Admin Dashboard';
};
