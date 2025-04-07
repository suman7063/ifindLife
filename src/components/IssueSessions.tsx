
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import { Session } from '@/components/admin/sessions/types';
import { renderIcon } from '@/components/admin/sessions/sessionIcons';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { defaultSessions } from '@/components/admin/sessions/defaultSessions';

const IssueSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleOpenSession = (session: Session) => {
    console.log('Session clicked:', session);
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
          {loading ? (
            // Loading state
            Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mx-auto"></div>
              </div>
            ))
          ) : (
            sessions.slice(0, 8).map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOpenSession(session)}
                role="button"
                tabIndex={0}
                aria-label={`View details about ${session.title}`}
              >
                <div className={`w-12 h-12 ${session.color} rounded-full flex items-center justify-center mb-3`}>
                  {renderIcon(session.icon)}
                </div>
                <h3 className="font-medium mb-1">{session.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{session.description}</p>
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

export default IssueSessions;
