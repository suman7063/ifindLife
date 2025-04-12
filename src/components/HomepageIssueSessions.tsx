
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import { Session } from '@/components/admin/sessions/types';
import { renderIcon } from '@/components/admin/sessions/sessionIcons';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { defaultSessions } from '@/components/admin/sessions/defaultSessions';
import { 
  Brain, Heart, MessageCircle, Lightbulb, 
  Users, Sparkles, CircleDot, Star 
} from 'lucide-react';

// Combined sessions component for homepage
const HomepageIssueSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Additional issue-based sessions from IssueSessions component
  const additionalIssueSessions = [
    {
      id: "anxiety-depression",
      icon: "brain",
      title: "Anxiety & Depression",
      description: "Get help managing anxiety, depression, and stress from licensed therapists.",
      href: "/anxiety-depression",
      color: "bg-blue-100"
    },
    {
      id: "relationship-counseling",
      icon: "heart",
      title: "Relationship Counseling",
      description: "Improve communication and resolve conflicts in all types of relationships.",
      href: "/relationship-counseling",
      color: "bg-red-100"
    },
    {
      id: "career-guidance",
      icon: "lightbulb",
      title: "Career Guidance",
      description: "Navigate work stress, career transitions, and professional development.",
      href: "/career-guidance",
      color: "bg-yellow-100"
    },
    {
      id: "family-therapy",
      icon: "users",
      title: "Family Therapy",
      description: "Address family dynamics, parenting challenges, and intergenerational issues.",
      href: "/family-therapy",
      color: "bg-green-100"
    },
    {
      id: "trauma-recovery",
      icon: "sparkles",
      title: "Trauma Recovery",
      description: "Process and heal from past trauma with specialized therapeutic approaches.",
      href: "/trauma-recovery",
      color: "bg-purple-100"
    },
    {
      id: "teen-counseling",
      icon: "message-circle",
      title: "Teen Counseling",
      description: "Support for adolescents facing academic pressure, identity, and social challenges.",
      href: "/teen-counseling",
      color: "bg-orange-100"
    }
  ];
  
  // Featured programs to include in the combined list
  const featuredPrograms = [
    {
      id: "quickease-program",
      icon: "brain",
      title: "QuickEase Programs",
      description: "Short-term solutions for immediate stress and anxiety relief",
      href: "/programs-for-wellness-seekers?category=quick-ease",
      color: "bg-blue-100"
    },
    {
      id: "resilience-program",
      icon: "sparkles",
      title: "Emotional Resilience",
      description: "Build psychological strength to handle life's challenges",
      href: "/programs-for-wellness-seekers?category=resilience-building",
      color: "bg-purple-100"
    },
    {
      id: "superhuman-program",
      icon: "star",
      title: "Super Human Life",
      description: "Achieve your highest potential through mental optimization",
      href: "/programs-for-wellness-seekers?category=super-human",
      color: "bg-yellow-100"
    }
  ];

  useEffect(() => {
    const fetchSessions = () => {
      try {
        setLoading(true);
        // Try to get sessions from localStorage
        const storedSessions = localStorage.getItem('ifindlife-sessions');
        if (storedSessions) {
          const parsedSessions = JSON.parse(storedSessions);
          setSessions(parsedSessions);
          console.log('Sessions loaded from localStorage:', parsedSessions.length);
        } else {
          // If no sessions in localStorage, use default sessions
          console.log('Using default sessions');
          setSessions(defaultSessions);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
        toast.error('Failed to load session data');
        // Use default sessions as fallback
        setSessions(defaultSessions);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, []);

  // Create a merged list of sessions without duplicates
  const createMergedSessions = () => {
    // Start with featured programs
    const mergedSessions = [...featuredPrograms];
    
    // Add issue-based sessions, avoiding duplicates
    additionalIssueSessions.forEach(issueSession => {
      if (!mergedSessions.some(session => session.title === issueSession.title)) {
        mergedSessions.push(issueSession);
      }
    });
    
    // Add other sessions from defaultSessions/localStorage, avoiding duplicates
    sessions.forEach(session => {
      if (!mergedSessions.some(existingSession => 
        existingSession.title === session.title)) {
        mergedSessions.push(session);
      }
    });
    
    // Limit to 12 total sessions to avoid overcrowding
    return mergedSessions.slice(0, 12);
  };
  
  const combinedSessions = createMergedSessions();

  const handleOpenSession = (session: Session) => {
    console.log('Session clicked:', session);
    setSelectedSession(session);
    setIsDialogOpen(true);
  };

  // Handler for both click and keyboard events
  const handleCardInteraction = (e: React.MouseEvent | React.KeyboardEvent, session: Session) => {
    e.preventDefault(); // Prevent default navigation
    e.stopPropagation(); // Stop event bubbling
    handleOpenSession(session);
  };

  return (
    <section className="py-16 bg-ifind-purple/5">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">How Can We Help You Today?</h2>
          <p className="text-gray-600">Select a program or issue to connect with a specialist who can assist you</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading state
            Array(12).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="w-14 h-14 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
              </div>
            ))
          ) : (
            combinedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={(e) => handleCardInteraction(e, session as Session)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardInteraction(e, session as Session);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View details about ${session.title}`}
              >
                <div className={`w-14 h-14 ${session.color} rounded-full flex items-center justify-center mb-4`}>
                  {renderIcon(session.icon)}
                </div>
                <h3 className="font-medium text-lg mb-2">{session.title}</h3>
                <p className="text-sm text-gray-600">{session.description}</p>
              </div>
            ))
          )}
        </div>
        
        {/* Session Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedSession && (
                  <>
                    <span className={`w-8 h-8 ${selectedSession.color} rounded-full flex items-center justify-center`}>
                      {selectedSession?.icon && renderIcon(selectedSession.icon)}
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
                
                <Button asChild>
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
