
import { useState } from 'react';
import { ExpertFormData } from '../types';

export const useExpertForm = (initialFormData: ExpertFormData) => {
  const [formData, setFormData] = useState<ExpertFormData>(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (serviceId: number, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, serviceId]
        };
      } else {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(id => id !== serviceId)
        };
      }
    });
  };

  const handleFileUpload = async (file: File): Promise<void> => {
    try {
      // Create a fake URL for the file for preview purposes
      const fileUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        certificates: [...(prev.certificates || []), file],
        certificateUrls: [...(prev.certificateUrls || []), fileUrl]
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleRemoveCertificate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates ? prev.certificates.filter((_, i) => i !== index) : [],
      certificateUrls: prev.certificateUrls ? prev.certificateUrls.filter((_, i) => i !== index) : []
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleCheckboxChange,
    handleFileUpload,
    handleRemoveCertificate
  };
};
