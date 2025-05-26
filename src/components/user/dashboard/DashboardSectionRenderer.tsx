
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import DashboardHome from './DashboardHome';
import ProfileSection from './sections/ProfileSection';
import WalletSection from './sections/WalletSection';
import ConsultationsSection from './sections/ConsultationsSection';
import BookingHistorySection from './sections/BookingHistorySection';
import ProgressTrackingSection from './sections/ProgressTrackingSection';
import FavoritesSection from './sections/FavoritesSection';
import ProgramsSection from './sections/ProgramsSection';
import MessagesSection from './sections/MessagesSection';
import SecuritySection from './sections/SecuritySection';
import SettingsSection from './sections/SettingsSection';
import SupportSection from './sections/SupportSection';

interface DashboardSectionRendererProps {
  currentSection: string;
  user: UserProfile | null;
}

const DashboardSectionRenderer: React.FC<DashboardSectionRendererProps> = ({ currentSection, user }) => {
  if (!user) return null;
  
  console.log('DashboardSectionRenderer: Rendering section:', currentSection);
  
  switch(currentSection) {
    case 'profile':
      return <ProfileSection user={user} />;
    case 'wallet':
      return <WalletSection user={user} />;
    case 'appointments':
    case 'consultations':
      return <ConsultationsSection user={user} />;
    case 'booking-history':
      return <BookingHistorySection user={user} />;
    case 'progress':
      return <ProgressTrackingSection user={user} />;
    case 'favorites':
      return <FavoritesSection user={user} />;
    case 'programs':
      return <ProgramsSection user={user} />;
    case 'messages':
      return <MessagesSection user={user} />;
    case 'security':
      return <SecuritySection />;
    case 'settings':
      return <SettingsSection user={user} />;
    case 'support':
    case 'help':
      return <SupportSection />;
    case 'overview':
    default:
      console.log('DashboardSectionRenderer: Rendering default overview section for:', currentSection);
      return <DashboardHome user={user} />;
  }
};

export default DashboardSectionRenderer;
