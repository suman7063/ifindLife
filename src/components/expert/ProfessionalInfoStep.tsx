
import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from 'lucide-react';

const specialtiesList = [
  "Anxiety",
  "Depression",
  "Stress Management",
  "Relationship Issues",
  "Trauma",
  "Self-esteem",
  "Career Counseling",
  "Grief",
  "Life Transitions",
  "ADHD",
];

const ProfessionalInfoStep = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext();
  
  if (!form) {
    console.error("ProfessionalInfoStep must be used within a FormProvider");
    return null;
  }
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Title</FormLabel>
            <FormControl>
              <Input placeholder="Licensed Therapist" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years of Experience</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                {...field} 
                onChange={e => field.onChange(parseInt(e.target.value))} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="specialties"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Specialties</FormLabel>
              <FormDescription>Select all that apply.</FormDescription>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {specialtiesList.map((specialty) => (
                <FormField
                  key={specialty}
                  control={form.control}
                  name="specialties"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={specialty}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(specialty)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, specialty])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== specialty
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {specialty}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Bio</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about your professional background and approach..." 
                className="min-h-[150px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-4">Account Security</h3>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      {...field} 
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-2 top-2.5"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4">
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I accept the Terms of Service and Privacy Policy
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
