
import { useState } from 'react';
import { ExpertFormData } from '../types';

export const useExpertForm = (initialFormData: ExpertFormData) => {
  const [formData, setFormData] = useState<ExpertFormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (serviceId: number) => {
    setFormData(prev => {
      if (prev.selectedServices.includes(serviceId)) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(id => id !== serviceId)
        };
      } else {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, serviceId]
        };
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates || [], ...files],
        certificateUrls: [...prev.certificateUrls || [], ...files.map(file => URL.createObjectURL(file))]
      }));
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
