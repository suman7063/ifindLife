
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HelpForm from './HelpForm';

export function useHelpNavigation() {
  const [isHelpFormOpen, setIsHelpFormOpen] = useState(false);
  const navigate = useNavigate();
  
  // Function to handle referral link click
  const handleReferralClick = () => {
    navigate('/referral');
  };
  
  // Function to handle help link click
  const handleHelpClick = () => {
    setIsHelpFormOpen(true);
  };
  
  // Help form close handler
  const closeHelpForm = () => {
    setIsHelpFormOpen(false);
  };
  
  // Component to render the Help form modal
  const HelpFormDialog = () => (
    <HelpForm isOpen={isHelpFormOpen} onClose={closeHelpForm} />
  );
  
  return {
    handleReferralClick,
    handleHelpClick,
    isHelpFormOpen,
    closeHelpForm,
    HelpFormDialog
  };
}

export default useHelpNavigation;
