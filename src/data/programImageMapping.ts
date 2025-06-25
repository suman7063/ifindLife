
// Mapping of program IDs to specific, relevant images
export const programImageMapping: Record<string, string> = {
  // Issue-based programs with relevant imagery
  'depression': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Sunrise over mountains - hope and renewal
  'anxiety': 'https://images.unsplash.com/photo-1506629905607-d5b7ff5d2c1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Calm lake reflection - peace and tranquility
  'stress': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Peaceful forest path - calm and grounding
  'sleep': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Peaceful night scene - rest and tranquility
  'relationships': 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Two trees growing together - connection and growth
  'trauma': 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Strong tree against sky - resilience and strength
  'grief': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Gentle flowers - healing and compassion
  'self-esteem': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mountain vista - confidence and achievement
  
  // Fallback image for any program without specific mapping
  'default': '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
};

// Helper function to get program image
export const getProgramImage = (programId: string): string => {
  return programImageMapping[programId] || programImageMapping.default;
};
