/**
 * Utility to check and validate environment variables for Agora call integration
 */

export interface EnvVarStatus {
  name: string;
  value: string | undefined;
  isSet: boolean;
  isValid: boolean;
  message: string;
}

export function checkAgoraEnvVars(): {
  frontend: EnvVarStatus[];
  backend: { message: string };
  allValid: boolean;
} {
  // Frontend environment variables (Vite)
  const frontendVars: EnvVarStatus[] = [
    {
      name: 'VITE_AGORA_APP_ID',
      value: import.meta.env.VITE_AGORA_APP_ID,
      isSet: !!import.meta.env.VITE_AGORA_APP_ID,
      isValid: !!import.meta.env.VITE_AGORA_APP_ID && 
               (import.meta.env.VITE_AGORA_APP_ID as string).length === 32,
      message: import.meta.env.VITE_AGORA_APP_ID 
        ? `Set (${(import.meta.env.VITE_AGORA_APP_ID as string).substring(0, 8)}...)`
        : 'Not set - using fallback'
    },
    {
      name: 'VITE_SUPABASE_URL',
      value: import.meta.env.VITE_SUPABASE_URL,
      isSet: !!import.meta.env.VITE_SUPABASE_URL,
      isValid: !!import.meta.env.VITE_SUPABASE_URL,
      message: import.meta.env.VITE_SUPABASE_URL 
        ? 'Set' 
        : 'Not set - using fallback'
    },
    {
      name: 'VITE_SUPABASE_ANON_KEY',
      value: import.meta.env.VITE_SUPABASE_ANON_KEY,
      isSet: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      isValid: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      message: import.meta.env.VITE_SUPABASE_ANON_KEY 
        ? 'Set' 
        : 'Not set - using fallback'
    }
  ];

  // Backend variables (Supabase Edge Functions)
  // Note: These can't be checked from frontend, but we can provide guidance
  const backend = {
    message: 'Backend env vars must be set in Supabase Dashboard → Edge Functions → Secrets'
  };

  const allValid = frontendVars.every(v => v.isValid);

  return {
    frontend: frontendVars,
    backend,
    allValid
  };
}

/**
 * Log environment variable status to console
 */
export function logEnvVarStatus(): void {
  const status = checkAgoraEnvVars();
  
  console.group('🔍 Environment Variables Status');
  
  console.group('Frontend (Browser)');
  status.frontend.forEach(v => {
    const icon = v.isValid ? '✅' : '⚠️';
    console.log(`${icon} ${v.name}: ${v.message}`);
  });
  console.groupEnd();
  
  console.log(`\n${status.backend.message}`);
  console.log('  - AGORA_APP_ID (optional, uses fallback if not set)');
  console.log('  - AGORA_APP_CERTIFICATE (optional, for token auth)');
  
  if (status.allValid) {
    console.log('\n✅ All frontend environment variables are properly configured!');
  } else {
    console.log('\n⚠️ Some environment variables are missing. Check your .env file.');
  }
  
  console.groupEnd();
}

