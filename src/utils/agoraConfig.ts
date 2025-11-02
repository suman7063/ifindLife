/**
 * Agora Configuration
 * Centralized configuration for Agora SDK
 */

export const AGORA_CONFIG = {
  APP_ID: import.meta.env.VITE_AGORA_APP_ID || '',
  ENABLE_LOG: import.meta.env.VITE_AGORA_ENABLE_LOG === 'true',
  LOG_LEVEL: import.meta.env.VITE_AGORA_LOG_LEVEL || 'warn',
} as const;

// Validate configuration
if (!AGORA_CONFIG.APP_ID) {
  console.warn('⚠️ VITE_AGORA_APP_ID is not set in .env file');
}

