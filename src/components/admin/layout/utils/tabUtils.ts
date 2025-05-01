
/**
 * Helper function to get the title based on the active tab
 */
export const getTabTitle = (tab: string): string => {
  const titles: Record<string, string> = {
    overview: 'Dashboard Overview',
    experts: 'Experts Management',
    expertApprovals: 'Expert Approvals',
    services: 'Services Management',
    herosection: 'Hero Section Editor',
    testimonials: 'Testimonials Management',
    programs: 'Programs Management',
    sessions: 'Sessions Management',
    referrals: 'Referrals Management',
    blog: 'Blog Management',
    contact: 'Contact Submissions',
    adminUsers: 'Admin Users Management',
    settings: 'Admin Settings'
  };
  
  return titles[tab] || 'Admin Dashboard';
};
