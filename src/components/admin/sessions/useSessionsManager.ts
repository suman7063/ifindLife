
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Session } from './types';
import { getDefaultSessions } from './defaultSessions';

export const useSessionsManager = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Fetch sessions on hook mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch sessions from localStorage or initialize with defaults
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      let fetchedSessions: Session[] = [];
      
      // Try to fetch from localStorage first
      const storedSessions = localStorage.getItem('ifindlife-sessions');
      if (storedSessions) {
        fetchedSessions = JSON.parse(storedSessions);
        console.log('Sessions fetched from localStorage:', fetchedSessions.length);
      } else {
        // Initialize with default sessions if none found
        fetchedSessions = getDefaultSessions();
        
        // Save defaults to localStorage
        localStorage.setItem('ifindlife-sessions', JSON.stringify(fetchedSessions));
      }
      
      setSessions(fetchedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch sessions');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog open for creating/editing a session
  const handleOpenDialog = (session?: Session) => {
    if (session) {
      console.log('Opening dialog for edit with session:', session);
      setSelectedSession(session);
    } else {
      console.log('Opening dialog for new session');
      setSelectedSession(null);
    }
    setIsDialogOpen(true);
  };

  // Save a new or updated session
  const handleSaveSession = (sessionData: Omit<Session, 'id'>) => {
    try {
      let savedSession: Session;
      
      if (selectedSession?.id) {
        // Update existing session
        savedSession = { ...sessionData, id: selectedSession.id };
        
        // Update in localStorage
        const updatedSessions = sessions.map(s => 
          s.id === selectedSession.id ? savedSession : s
        );
        localStorage.setItem('ifindlife-sessions', JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
        toast.success('Session updated successfully');
      } else {
        // Create new session with new ID
        const newId = sessions.length > 0 
          ? Math.max(...sessions.map(s => s.id)) + 1 
          : 1;
        
        savedSession = { ...sessionData, id: newId };
        
        // Save to localStorage
        const updatedSessions = [...sessions, savedSession];
        localStorage.setItem('ifindlife-sessions', JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
        toast.success('Session created successfully');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    }
  };

  // Delete a session
  const handleDeleteSession = (sessionId: number) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      // Remove from localStorage
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem('ifindlife-sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  return {
    sessions,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    selectedSession,
    handleOpenDialog,
    handleSaveSession,
    handleDeleteSession
  };
};
