
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormItem, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { X, Upload } from 'lucide-react';
import { ExpertFormData } from './types';

interface ProfessionalInfoStepProps {
  formData: ExpertFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileUpload: (file: File) => Promise<void>;
  handleRemoveCertificate: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
}

const ProfessionalInfoStep = ({
  formData,
  handleChange,
  handleFileUpload,
  handleRemoveCertificate,
  nextStep,
  prevStep,
  errors
}: ProfessionalInfoStepProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
            className={errors.specialization ? "border-destructive" : ""}
          />
          {errors.specialization && <FormMessage>{errors.specialization}</FormMessage>}
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
            className={errors.experience ? "border-destructive" : ""}
          />
          {errors.experience && <FormMessage>{errors.experience}</FormMessage>}
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
            className={errors.bio ? "border-destructive" : ""}
          />
          {errors.bio && <FormMessage>{errors.bio}</FormMessage>}
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
          />
          
          {/* Custom styled upload button */}
          <Button 
            type="button" 
            variant="outline" 
            onClick={triggerFileInput}
            className="w-full flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Browse for Certificate
          </Button>
          
          {formData.certificateUrls && formData.certificateUrls.length > 0 && (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
              <p className="text-sm text-gray-500">Uploaded Certificates:</p>
              <div className="space-y-2">
                {formData.certificateUrls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-muted/50 p-2 rounded">
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
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormItem>
      </div>
      
      {/* Fixed positioning for navigation buttons to ensure they're always visible */}
      <div className="flex justify-between pt-10 pb-4 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ifind-aqua hover:bg-ifind-teal transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
