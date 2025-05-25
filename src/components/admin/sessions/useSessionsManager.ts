
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Session } from './types';
import { defaultSessions } from './defaultSessions';

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
      
      // First, try to get sessions from the main website content
      const storedContent = localStorage.getItem('ifindlife-content');
      if (storedContent) {
        const parsedContent = JSON.parse(storedContent);
        if (parsedContent.sessions && parsedContent.sessions.length > 0) {
          fetchedSessions = parsedContent.sessions;
          console.log('Sessions loaded from website content:', fetchedSessions.length);
        }
      }
      
      // If no sessions in main content, try dedicated sessions storage
      if (fetchedSessions.length === 0) {
        const storedSessions = localStorage.getItem('ifindlife-sessions');
        if (storedSessions) {
          fetchedSessions = JSON.parse(storedSessions);
          console.log('Sessions loaded from dedicated storage:', fetchedSessions.length);
        }
      }
      
      // If still no sessions, use defaults and save them
      if (fetchedSessions.length === 0) {
        fetchedSessions = [...defaultSessions];
        
        // Save defaults to both storages for consistency
        localStorage.setItem('ifindlife-sessions', JSON.stringify(fetchedSessions));
        
        // Also update main content if it exists
        if (storedContent) {
          const content = JSON.parse(storedContent);
          content.sessions = fetchedSessions;
          localStorage.setItem('ifindlife-content', JSON.stringify(content));
        }
        
        console.log('Using default sessions and saved for future use');
      }
      
      setSessions(fetchedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch sessions');
      // Fallback to defaults
      setSessions([...defaultSessions]);
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
        
        const updatedSessions = sessions.map(s => 
          s.id === selectedSession.id ? savedSession : s
        );
        setSessions(updatedSessions);
        saveToStorage(updatedSessions);
        toast.success('Session updated successfully');
      } else {
        // Create new session with new ID
        const highestId = sessions.reduce((max, session) => {
          const id = parseInt(session.id);
          return id > max ? id : max;
        }, 0);
        
        const newId = (highestId + 1).toString();
        savedSession = { ...sessionData, id: newId };
        
        const updatedSessions = [...sessions, savedSession];
        setSessions(updatedSessions);
        saveToStorage(updatedSessions);
        toast.success('Session created successfully');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    }
  };

  // Delete a session
  const handleDeleteSession = (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);
      saveToStorage(updatedSessions);
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  // Save to both storage locations for consistency
  const saveToStorage = (updatedSessions: Session[]) => {
    // Save to dedicated sessions storage
    localStorage.setItem('ifindlife-sessions', JSON.stringify(updatedSessions));
    
    // Also update main website content storage
    try {
      const storedContent = localStorage.getItem('ifindlife-content');
      if (storedContent) {
        const content = JSON.parse(storedContent);
        content.sessions = updatedSessions;
        localStorage.setItem('ifindlife-content', JSON.stringify(content));
      }
    } catch (error) {
      console.error('Error updating main content storage:', error);
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
