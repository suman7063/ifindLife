
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const useDashboardSection = () => {
  const { section } = useParams<{ section?: string }>();
  const [currentSection, setCurrentSection] = useState(section || 'overview');
  
  useEffect(() => {
    console.log('useDashboardSection: Current section from URL:', section);
    console.log('useDashboardSection: Current dashboard section state:', currentSection);
  }, [section, currentSection]);

  // Update current section when URL changes
  useEffect(() => {
    if (section) {
      setCurrentSection(section);
    } else {
      setCurrentSection('overview');
    }
  }, [section]);

  return {
    currentSection,
    setCurrentSection
  };
};
