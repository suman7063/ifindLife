
import { toast } from 'sonner';
import { useState } from 'react';
import { UserProfile } from '@/types/supabase';

export interface DoxymeRoom {
  roomUrl: string;
  roomName: string;
  provider: {
    name: string;
    id: string;
  };
}

export const useDoxyme = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Join a Doxy.me waiting room
  const joinDoxymeRoom = (roomUrl: string) => {
    if (!roomUrl) {
      toast.error('Invalid room URL');
      return;
    }
    
    // Open the Doxy.me room in a new tab
    window.open(roomUrl, '_blank');
    toast.success('Joining Doxy.me room');
  };
  
  // Generate a room URL for a provider
  const getProviderRoomUrl = (providerId: string, providerName: string): DoxymeRoom => {
    // Format the provider name for the URL (lowercase, no spaces)
    const formattedName = providerName.toLowerCase().replace(/\s+/g, '');
    
    // In a real implementation, this would be the actual Doxy.me room URL
    // Doxy.me URLs are typically in the format: https://doxy.me/providername
    const roomUrl = `https://doxy.me/${formattedName}${providerId.slice(0, 4)}`;
    
    return {
      roomUrl,
      roomName: `${providerName}'s Room`,
      provider: {
        name: providerName,
        id: providerId
      }
    };
  };
  
  // Start a provider call session
  const startProviderSession = (user: UserProfile | null, expertId: string, expertName: string) => {
    setIsLoading(true);
    
    try {
      if (!user) {
        toast.error('You must be logged in to start a video session');
        return null;
      }
      
      // In a production app, we would create a session record in our database
      // For now, we'll just generate and return the room information
      const roomInfo = getProviderRoomUrl(expertId, expertName);
      
      toast.success(`Session ready with ${expertName}`);
      setIsLoading(false);
      return roomInfo;
      
    } catch (error) {
      console.error('Error starting Doxy.me session:', error);
      toast.error('Failed to start video session');
      setIsLoading(false);
      return null;
    }
  };
  
  return {
    joinDoxymeRoom,
    startProviderSession,
    getProviderRoomUrl,
    isLoading
  };
};
