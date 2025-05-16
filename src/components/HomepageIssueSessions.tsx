
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomepageIssueSessions: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Issue sessions matching the screenshot
  const sessions = [
    {
      id: '1',
      title: 'Depression',
      description: 'Support for managing depression symptoms and improving mood',
      icon: '😔',
      color: 'bg-blue-100',
      iconColor: 'text-blue-400',
      href: '/mental-health/depression'
    },
    {
      id: '2',
      title: 'Anxiety',
      description: 'Tools and techniques to help manage anxiety and worry',
      icon: '😰',
      color: 'bg-green-100',
      iconColor: 'text-green-400',
      href: '/mental-health/anxiety'
    },
    {
      id: '3',
      title: 'Stress Management',
      description: 'Effective strategies to cope with and reduce stress',
      icon: '🧠',
      color: 'bg-purple-100',
      iconColor: 'text-purple-400',
      href: '/mental-health/stress'
    },
    {
      id: '4',
      title: 'Sleep Issues',
      description: 'Help with improving sleep quality and addressing insomnia',
      icon: '😴',
      color: 'bg-indigo-100',
      iconColor: 'text-indigo-400',
      href: '/mental-health/sleep'
    },
    {
      id: '5',
      title: 'Relationships',
      description: 'Guidance for building healthy and fulfilling relationships',
      icon: '❤️',
      color: 'bg-red-100',
      iconColor: 'text-red-400',
      href: '/mental-health/relationships'
    },
    {
      id: '6',
      title: 'Trauma & PTSD',
      description: 'Support for healing from trauma and managing PTSD symptoms',
      icon: '🛡️',
      color: 'bg-orange-100',
      iconColor: 'text-orange-400',
      href: '/mental-health/trauma'
    },
    {
      id: '7',
      title: 'Grief & Loss',
      description: 'Compassionate support for navigating grief and loss',
      icon: '💔',
      color: 'bg-pink-100',
      iconColor: 'text-pink-400',
      href: '/mental-health/grief'
    },
    {
      id: '8',
      title: 'Self-Esteem',
      description: 'Help with building confidence and improving self-image',
      icon: '✨',
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      href: '/mental-health/self-esteem'
    }
  ];

  const handleOpenSession = (session: any) => {
    setSelectedSession(session);
    setIsDialogOpen(true);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">How Can We Help You Today?</h2>
          <p className="text-gray-600">Select an issue to connect with a specialist who can assist you</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleOpenSession(session)}
              role="button"
              tabIndex={0}
              aria-label={`View details about ${session.title}`}
            >
              <div className={`w-12 h-12 ${session.color} rounded-full flex items-center justify-center mb-3`}>
                <span className="text-xl">{session.icon}</span>
              </div>
              <h3 className="font-medium mb-1">{session.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{session.description}</p>
            </div>
          ))}
        </div>
        
        {/* Session Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedSession && (
                  <>
                    <span className={`w-8 h-8 ${selectedSession.color} rounded-full flex items-center justify-center`}>
                      {selectedSession?.icon}
                    </span>
                    {selectedSession.title}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <p className="text-muted-foreground mb-6">{selectedSession?.description}</p>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                
                <Button asChild className="bg-ifind-teal hover:bg-ifind-teal/90">
                  <Link to={selectedSession?.href || "/experts"}>
                    Find Specialist <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default HomepageIssueSessions;
