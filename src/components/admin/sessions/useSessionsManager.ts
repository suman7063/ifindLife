
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Session } from './types';
import { defaultSessions } from './defaultSessions';
import { issueBasedPrograms } from '@/data/issueBasedPrograms';

// Helper functions to get color and icon based on category
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    mental_health: 'bg-blue-100 text-blue-800',
    relationships: 'bg-pink-100 text-pink-800',
    career: 'bg-purple-100 text-purple-800',
    productivity: 'bg-green-100 text-green-800',
    business: 'bg-gray-100 text-gray-800',
    academic: 'bg-cyan-100 text-cyan-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    mental_health: '🧠',
    relationships: '💝',
    career: '🚀',
    productivity: '⚡',
    business: '💼',
    academic: '📚'
  };
  return icons[category] || '📋';
};

export const useSessionsManager = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Fetch sessions on hook mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch sessions from the same data source as frontend (issueBasedPrograms)
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      // Transform issueBasedPrograms to session format to match frontend data
      const programSessions: Session[] = issueBasedPrograms.map(program => ({
        id: program.id.toString(),
        title: program.title,
        description: program.description,
        color: getCategoryColor(program.category),
        icon: getCategoryIcon(program.category),
        href: `/program/${program.id}`
      }));
      
      console.log('Sessions loaded from issueBasedPrograms data:', programSessions.length);
      setSessions(programSessions);
    } catch (error) {
      console.error('Error loading sessions from programs data:', error);
      toast.error('Failed to load sessions');
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
