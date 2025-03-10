
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Upload } from 'lucide-react';
import { ExpertFormData } from './types';

interface ProfessionalInfoStepProps {
  formData: ExpertFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveCertificate: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ProfessionalInfoStep = ({ 
  formData, 
  handleChange, 
  handleFileUpload, 
  handleRemoveCertificate,
  nextStep, 
  prevStep 
}: ProfessionalInfoStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Professional Information</h2>
      
      <div className="space-y-2">
        <label htmlFor="specialization" className="text-sm font-medium">Specialization</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Clinical Psychology, CBT, etc."
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="experience" className="text-sm font-medium">Years of Experience</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="5"
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">Professional Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about your professional background, approach, and expertise..."
          className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Certificates</label>
        <div className="border border-dashed border-input rounded-md p-6">
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
            <input
              type="file"
              id="certificates"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('certificates')?.click()}
            >
              Select Files
            </Button>
          </div>
        </div>
        
        {formData.certificateUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {formData.certificateUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Certificate ${index + 1}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleRemoveCertificate(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className="bg-astro-purple hover:bg-astro-violet"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
