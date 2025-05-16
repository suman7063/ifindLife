
import { registerTest } from './functionRegistry';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';

// Test user login via Supabase directly
registerTest({
  name: 'Direct Supabase User Login',
  path: 'lib/supabase -> auth.signInWithPassword',
  test: async () => {
    try {
      // Test with test credentials - these should be replaced with actual test credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      });
      return !error;
    } catch {
      return false;
    }
  }
});

// Test expert login via Supabase directly
registerTest({
  name: 'Direct Supabase Expert Login',
  path: 'lib/supabase -> auth.signInWithPassword (expert)',
  test: async () => {
    try {
      // Test with test expert credentials - these should be replaced with actual test credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'expert@example.com',
        password: 'password123'
      });
      return !error;
    } catch {
      return false;
    }
  }
});

// Test auth context login function existence
registerTest({
  name: 'Auth Context Login Function Check',
  path: 'contexts/auth/AuthContext -> login',
  test: async () => {
    try {
      // We need to use a component to access the hook
      // This is just a check if the function exists
      const auth = useAuth();
      return typeof auth.login === 'function';
    } catch {
      return false;
    }
  }
});
