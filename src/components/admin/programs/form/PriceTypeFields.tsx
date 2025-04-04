
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ProgramFormValues } from '../formUtils';

interface PriceTypeFieldsProps {
  form: UseFormReturn<ProgramFormValues>;
}

const PriceTypeFields: React.FC<PriceTypeFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price (₹)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={0}
                placeholder="e.g. 4999" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="programType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Program Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a program type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="wellness">Wellness Programs</SelectItem>
                <SelectItem value="academic">Academic Institute Programs</SelectItem>
                <SelectItem value="business">Business Programs</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PriceTypeFields;
