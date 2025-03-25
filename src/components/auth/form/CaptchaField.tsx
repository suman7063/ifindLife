
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface CaptchaFieldProps {
  name: string;
  className?: string;
  siteKey?: string;
}

// Using a default test key - replace with real key in production
const DEFAULT_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export const CaptchaField: React.FC<CaptchaFieldProps> = ({ 
  name, 
  className,
  siteKey = DEFAULT_SITE_KEY
}) => {
  const form = useFormContext();

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      form.setValue(name, value);
      form.clearErrors(name);
    } else {
      form.setValue(name, '');
      form.setError(name, {
        type: 'manual',
        message: 'Please verify that you are not a robot'
      });
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-2', className)}>
          <FormControl>
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={handleCaptchaChange}
              onExpired={() => handleCaptchaChange(null)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CaptchaField;
