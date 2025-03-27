
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExpertFormData } from './types';
import { Award, FileText, Upload, X } from 'lucide-react';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
      // Reset the input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Professional Information</h2>
      
      <FormItem className="space-y-2">
        <FormLabel htmlFor="specialization" className={errors.specialization ? "text-destructive" : ""}>
          Specialization <span className="text-destructive">*</span>
        </FormLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Award className={`h-4 w-4 ${errors.specialization ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <Input
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="e.g., Counseling, CBT, Psychotherapy"
            className={`pl-10 ${errors.specialization ? "border-destructive focus-visible:ring-destructive" : ""}`}
            required
          />
        </div>
        {errors.specialization && (
          <FormMessage>{errors.specialization}</FormMessage>
        )}
      </FormItem>
      
      <FormItem className="space-y-2">
        <FormLabel htmlFor="experience" className={errors.experience ? "text-destructive" : ""}>
          Experience <span className="text-destructive">*</span>
        </FormLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className={`h-4 w-4 ${errors.experience ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <Input
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g., 5 years in clinical psychology"
            className={`pl-10 ${errors.experience ? "border-destructive focus-visible:ring-destructive" : ""}`}
            required
          />
        </div>
        {errors.experience && (
          <FormMessage>{errors.experience}</FormMessage>
        )}
      </FormItem>
      
      <FormItem className="space-y-2">
        <FormLabel htmlFor="bio" className={errors.bio ? "text-destructive" : ""}>
          Professional Bio <span className="text-destructive">*</span>
        </FormLabel>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Brief description of your professional background and approach"
          className={`min-h-[100px] ${errors.bio ? "border-destructive focus-visible:ring-destructive" : ""}`}
          required
        />
        {errors.bio && (
          <FormMessage>{errors.bio}</FormMessage>
        )}
      </FormItem>
      
      <div className="space-y-2">
        <FormLabel>Certificates & Qualifications</FormLabel>
        <div className="mt-1">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf"
          />
          <Button
            type="button"
            onClick={triggerFileUpload}
            variant="outline"
            className="w-full border-dashed border-2 py-6"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Certificates
          </Button>
        </div>
        
        {formData.certificateUrls.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium">Uploaded Certificates</h3>
            <div className="grid grid-cols-1 gap-2">
              {formData.certificateUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <span className="text-sm truncate max-w-[80%]">
                    Certificate {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCertificate(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className="bg-ifind-aqua hover:bg-ifind-teal transition-colors"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
