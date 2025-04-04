
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProgramFormValues } from '../formUtils';

interface DurationFieldsProps {
  form: UseFormReturn<ProgramFormValues>;
}

const DurationFields: React.FC<DurationFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <FormControl>
              <Input placeholder="e.g. 6 weeks" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="sessions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Sessions</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1}
                placeholder="e.g. 12" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DurationFields;
