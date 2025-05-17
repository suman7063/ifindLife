
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterTab: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsRegistering(true);
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .single();
      
      if (existingUser) {
        toast.error('An account with this email already exists');
        return;
      }
      
      // Create auth account
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            email: data.email,
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            name: data.name,
            email: data.email,
            created_at: new Date().toISOString()
          }]);
          
        if (profileError) {
          toast.error('Failed to create profile: ' + profileError.message);
          return;
        }
      }
      
      toast.success('Registration successful! You can now login.');
      reset();
      
    } catch (error: any) {
      toast.error('Registration failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
        <Input
          id="name"
          placeholder="John Doe"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
          disabled={isRegistering}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
          disabled={isRegistering}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
          disabled={isRegistering}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          className={errors.confirmPassword ? 'border-red-500' : ''}
          disabled={isRegistering}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-sky-500 hover:bg-sky-600 text-white" 
        disabled={isRegistering}
      >
        {isRegistering ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};

export default RegisterTab;
