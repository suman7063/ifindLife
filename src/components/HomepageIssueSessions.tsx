import React from 'react';
import { ArrowRight, Brain, Heart, Clock, Cloud, ShieldAlert, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProgramDetailModal } from '@/hooks/useProgramDetailModal';
import ProgramDetailModal from '@/components/programs/detail/ProgramDetailModal';
const HomepageIssueSessions: React.FC = () => {
  const {
    modalState,
    openModal,
    closeModal,
    switchTab
  } = useProgramDetailModal();

  // Issue sessions matching the screenshot with proper icons instead of emojis
  const sessions = [{
    id: 'depression',
    title: 'Depression',
    description: 'Support for managing depression symptoms and improving mood',
    icon: <Cloud className="h-5 w-5 text-blue-500" />,
    color: 'bg-blue-100',
    iconColor: 'text-blue-500',
    href: '/programs-for-wellness-seekers#issue-based'
  }, {
    id: 'anxiety',
    title: 'Anxiety',
    description: 'Tools and techniques to help manage anxiety and worry',
    icon: <Brain className="h-5 w-5 text-green-500" />,
    color: 'bg-green-100',
    iconColor: 'text-green-500',
    href: '/programs-for-wellness-seekers#issue-based'
  }, {
    id: 'stress',
    title: 'Stress Management',
    description: 'Effective strategies to cope with and reduce stress',
    icon: <Clock className="h-5 w-5 text-purple-500" />,
    color: 'bg-purple-100',
    iconColor: 'text-purple-500',
    href: '/programs-for-wellness-seekers#issue-based'
  }, {
    id: 'sleep',
    title: 'Sleep Issues',
    description: 'Help with improving sleep quality and addressing insomnia',
    icon: <Cloud className="h-5 w-5 text-indigo-500" />,
    color: 'bg-indigo-100',
    iconColor: 'text-indigo-500',
    href: '/programs-for-wellness-seekers#issue-based'
  }, {
    id: 'relationships',
    title: 'Relationships',
    description: 'Guidance for building healthy and fulfilling relationships',
    icon: <Heart className="h-5 w-5 text-red-500" />,
    color: 'bg-red-100',
    iconColor: 'text-red-500',
    href: '/programs-for-wellness-seekers#issue-based'
  }, {
    id: 'trauma',
    title: 'Trauma & PTSD',
    description: 'Support for healing from trauma and managing PTSD symptoms',
    icon: <ShieldAlert className="h-5 w-5 text-orange-500" />,
    color: 'bg-orange-100',
    iconColor: 'text-orange-500',
    href: '/programs-for-wellness-seekers#issue-based'
  }, {
    id: 'grief',
    title: 'Grief & Loss',
    description: 'Compassionate support for navigating grief and loss',
    icon: <Heart className="h-5 w-5 text-pink-500" />,
    color: 'bg-pink-100',
    iconColor: 'text-pink-500',
    href: '/programs-for-wellness-seekers#issue-based'
  }, {
    id: 'self-esteem',
    title: 'Self-Esteem',
    description: 'Help with building confidence and improving self-image',
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    href: '/programs-for-wellness-seekers#issue-based'
  }];
  const handleSessionClick = (sessionId: string) => {
    // Only open modal for sessions that have detailed data (depression, anxiety, stress)
    if (['depression', 'anxiety', 'stress'].includes(sessionId)) {
      openModal(sessionId);
    }
  };
  return <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">How Can We Help You Today?</h2>
          <p className="text-gray-600 text-center">Select an issue to connect with a specialist who can assist you</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sessions.map(session => <div key={session.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSessionClick(session.id)}>
              <div className={`w-12 h-12 ${session.color} rounded-full flex items-center justify-center mb-3`}>
                {session.icon}
              </div>
              <h3 className="font-medium mb-1">{session.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{session.description}</p>
            </div>)}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/programs-for-wellness-seekers#issue-based">
            <Button className="bg-ifind-teal hover:bg-ifind-teal/90 text-white">
              View All Sessions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {/* Program Detail Modal */}
        <ProgramDetailModal isOpen={modalState.isOpen} onClose={closeModal} programData={modalState.programData} activeTab={modalState.activeTab} onTabChange={switchTab} loading={modalState.loading} error={modalState.error} />
      </div>
    </section>;
};
export default HomepageIssueSessions;