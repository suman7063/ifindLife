import { useState } from 'react';

export type VideoMode = 'side-by-side' | 'picture-in-picture';

export const useVideoMode = () => {
  const [videoMode, setVideoMode] = useState<VideoMode>('side-by-side');

  const toggleVideoMode = () => {
    setVideoMode(prev => 
      prev === 'side-by-side' ? 'picture-in-picture' : 'side-by-side'
    );
  };

  return {
    videoMode,
    setVideoMode,
    toggleVideoMode
  };
};