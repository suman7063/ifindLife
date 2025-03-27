
import { toast } from 'sonner';
import { ExpertFormData } from '../types';

export const validateStep = (currentStep: number, formData: ExpertFormData): boolean => {
  if (currentStep === 1) {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all required fields");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return false;
    }
  }
  
  if (currentStep === 2) {
    if (!formData.address || !formData.city || !formData.state || !formData.country) {
      toast.error("Please fill all required fields");
      return false;
    }
  }
  
  if (currentStep === 3) {
    if (!formData.specialization || !formData.experience || !formData.bio) {
      toast.error("Please fill all required fields");
      return false;
    }
  }

  return true;
};

export const validateSubmission = (formData: ExpertFormData): boolean => {
  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords don't match");
    return false;
  }
  
  if (!formData.acceptedTerms) {
    toast.error("Please accept the terms and conditions");
    return false;
  }
  
  if (formData.selectedServices.length === 0) {
    toast.error("Please select at least one service");
    return false;
  }
  
  return true;
};
