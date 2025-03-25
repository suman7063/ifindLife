
import React from 'react';
import { Link } from 'react-router-dom';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { TermsCheckboxProps } from './types';

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="termsAccepted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              I accept the <Link to="/terms" className="text-ifind-aqua hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-ifind-aqua hover:underline">Privacy Policy</Link>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TermsCheckbox;
