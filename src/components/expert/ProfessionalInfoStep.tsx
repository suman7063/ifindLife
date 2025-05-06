
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormItem, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { ExpertFormData } from './types';

interface ProfessionalInfoStepProps {
  formData: ExpertFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileUpload: (file: File) => Promise<void>;
  handleRemoveCertificate: (index: number) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
  touched?: Record<string, boolean>;
}

const ProfessionalInfoStep = ({
  formData,
  handleChange,
  handleBlur,
  handleFileUpload,
  handleRemoveCertificate,
  isUploading = false,
  uploadProgress = 0,
  nextStep,
  prevStep,
  errors,
  touched = {}
}: ProfessionalInfoStepProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
      
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isFieldInvalid = (fieldName: string): boolean => {
    return touched[fieldName] === true && !!errors[fieldName];
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Professional Information</h2>
      
      <div className="space-y-4">
        <FormItem className="space-y-2">
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
            Specialization <span className="text-destructive">*</span>
          </label>
          <Input
            id="specialization"
            name="specialization"
            type="text"
            value={formData.specialization}
            onChange={handleChange}
            onBlur={handleBlur}
            className={isFieldInvalid('specialization') ? "border-destructive" : ""}
            aria-invalid={isFieldInvalid('specialization')}
            aria-describedby={isFieldInvalid('specialization') ? "specialization-error" : undefined}
          />
          {isFieldInvalid('specialization') && (
            <FormMessage id="specialization-error">{errors.specialization}</FormMessage>
          )}
        </FormItem>
        
        <FormItem className="space-y-2">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Years of Experience <span className="text-destructive">*</span>
          </label>
          <Input
            id="experience"
            name="experience"
            type="text"
            value={formData.experience}
            onChange={handleChange}
            onBlur={handleBlur}
            className={isFieldInvalid('experience') ? "border-destructive" : ""}
            aria-invalid={isFieldInvalid('experience')}
            aria-describedby={isFieldInvalid('experience') ? "experience-error" : undefined}
          />
          {isFieldInvalid('experience') && (
            <FormMessage id="experience-error">{errors.experience}</FormMessage>
          )}
        </FormItem>
        
        <FormItem className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio / About Yourself <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            className={isFieldInvalid('bio') ? "border-destructive" : ""}
            aria-invalid={isFieldInvalid('bio')}
            aria-describedby={isFieldInvalid('bio') ? "bio-error" : undefined}
          />
          {isFieldInvalid('bio') && (
            <FormMessage id="bio-error">{errors.bio}</FormMessage>
          )}
        </FormItem>
        
        <FormItem className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Certificates / Qualifications
          </label>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="certificate"
            name="certificate"
            type="file"
            onChange={onFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            disabled={isUploading}
          />
          
          {/* Custom styled upload button */}
          <Button 
            type="button" 
            variant="outline" 
            onClick={triggerFileInput}
            className="w-full flex items-center justify-center gap-2"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Browse for Certificate'}
          </Button>
          
          {/* Upload progress */}
          {isUploading && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          )}
          
          {/* Display uploaded certificates */}
          {formData.certificateUrls && formData.certificateUrls.length > 0 && (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
              <p className="text-sm text-gray-500 flex items-center">
                <Check className="h-4 w-4 mr-1 text-green-500" />
                Uploaded Certificates:
              </p>
              <div className="space-y-2">
                {formData.certificateUrls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-muted/50 p-2 rounded border border-green-100">
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline truncate flex-1"
                    >
                      {formData.certificates?.[index]?.name || `Certificate ${index + 1}`}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertificate(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      title="Remove certificate"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Accepted formats: PDF, JPG, PNG (max 5MB)
          </div>
        </FormItem>
      </div>
      
      {/* Fixed positioning for navigation buttons to ensure they're always visible */}
      <div className="flex justify-between pt-10 pb-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="px-4 py-2"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className="px-4 py-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
