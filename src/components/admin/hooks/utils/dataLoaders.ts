
export const loadContentFromLocalStorage = () => {
  try {
    const savedContent = localStorage.getItem('ifindlife-content');
    if (savedContent) {
      return JSON.parse(savedContent);
    }
  } catch (error) {
    console.error('Error loading content from localStorage:', error);
    // Create a new content object if loading fails
    return null;
  }
  return null;
};

export const saveContentToLocalStorage = (content: any) => {
  try {
    localStorage.setItem('ifindlife-content', JSON.stringify(content));
    console.log('Content saved to localStorage');
  } catch (error) {
    console.error('Error saving content to localStorage:', error);
  }
};

// Add a helper function to detect and fix RLS policy errors
export const handlePolicyError = (error: any) => {
  if (error?.code === '42P17' || 
      error?.message?.includes('recursion') || 
      error?.message?.includes('policy')) {
    console.warn('Database policy error detected:', error.message);
    return true;
  }
  return false;
};

// Add a helper to clean up URLs that might have been corrupted
export const sanitizeVideoUrl = (url: string): string => {
  if (!url) return '';
  
  const inappropriatePatterns = [
    'dQw4w9WgXcQ', // Rick Astley Never Gonna Give You Up video ID
    'rick astley',
    'rickroll',
    'never gonna give you up'
  ];
  
  const lowercaseUrl = url.toLowerCase();
  const isInappropriate = inappropriatePatterns.some(pattern => 
    lowercaseUrl.includes(pattern.toLowerCase())
  );
  
  if (isInappropriate) {
    console.warn("Inappropriate video URL detected and replaced");
    return "https://www.youtube.com/embed/0J_Vg-uWY-k?autoplay=0";
  }
  
  // Ensure autoplay is disabled
  let sanitized = url.replace(/([?&])autoplay=1/g, '$1autoplay=0');
  
  if (!sanitized.includes('autoplay=')) {
    sanitized = sanitized.includes('?') 
      ? `${sanitized}&autoplay=0` 
      : `${sanitized}?autoplay=0`;
  }
  
  return sanitized;
};

// Add the missing getDefaultTestimonials function
export const getDefaultTestimonials = () => {
  return [
    {
      name: "Rebecca T.",
      location: "New York",
      rating: 5,
      text: "After months of struggling with anxiety, my sessions have been life-changing. I've learned techniques that help me manage stressful situations effectively.",
      date: "2 weeks ago",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
    },
    {
      name: "Mark L.",
      location: "Chicago",
      rating: 5,
      text: "The counseling helped my wife and I improve our communication in ways we never thought possible. Our relationship is stronger than ever.",
      date: "1 month ago",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Samantha J.",
      location: "Los Angeles",
      rating: 5,
      text: "The mindfulness techniques I learned have completely transformed how I handle stress at work. I'm more productive and happier than I've been in years.",
      date: "3 weeks ago",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
    }
  ];
};
