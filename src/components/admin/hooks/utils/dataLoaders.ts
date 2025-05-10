
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
