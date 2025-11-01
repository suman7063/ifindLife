// Agora configuration constants
// Note: This will be empty string if VITE_AGORA_APP_ID is not set
// Validation should be done before using this value
export const AGORA_CONFIG = {
  // Use Vite env vars - REQUIRED, no fallback
  // Will be empty string if not set, which will cause errors (as intended)
  APP_ID: import.meta.env.VITE_AGORA_APP_ID || '',

  // Optional Agora Chat configuration (if/when using Agora Chat SDK)
  CHAT: {
    HOST: import.meta.env.VITE_AGORA_CHAT_HOST || '',
    ORG_NAME: import.meta.env.VITE_AGORA_CHAT_ORG_NAME || '',
    APP_NAME: import.meta.env.VITE_AGORA_CHAT_APP_NAME || ''
  },

  // Channel naming convention
  CHANNEL_PREFIX: 'expert_call_',
  
  // Call settings
  DEFAULT_CODEC: 'vp8' as const,
  DEFAULT_MODE: 'rtc' as const,
  
  // Pricing settings (in USD)
  PRICING: {
    FREE_MINUTES: 15,
    PRICE_PER_MINUTE: 2.0,
    EXPERT_COMMISSION: 0.7 // 70% to expert, 30% platform fee
  },
  
  // Call quality settings
  QUALITY_SETTINGS: {
    video: {
      width: 640,
      height: 480,
      framerate: 15,
      bitrateMin: 200,
      bitrateMax: 1000
    },
    audio: {
      bitrate: 48,
      sampleRate: 48000
    }
  }
} as const;

/**
 * Generate a short, unique ID from a UUID or string
 * Takes first 8 chars of UUID (removes hyphens) for uniqueness
 */
const shortId = (uuid: string): string => {
  // Remove hyphens and take first 8 characters
  return uuid.replace(/-/g, '').substring(0, 8);
};

/**
 * Generate unique channel name for expert-user call
 * Must be <= 64 bytes for Agora compatibility
 * Format: call_<8-char-expert-id>_<8-char-user-id>_<timestamp>
 * Example: call_a1b2c3d4_e5f6g7h8_1234567890 (36 chars, well under 64 limit)
 */
export const generateChannelName = (expertId: string, userId: string): string => {
  const timestamp = Date.now();
  const shortExpertId = shortId(expertId);
  const shortUserId = shortId(userId);
  // Format: call_XXXXXXXX_YYYYYYYY_TIMESTAMP
  // call_ = 5, short IDs = 8+8 = 16, separators = 2, timestamp = 13, total = 36 chars (well under 64)
  // Use 'call_' instead of CHANNEL_PREFIX to keep it shorter
  return `call_${shortExpertId}_${shortUserId}_${timestamp}`;
};

// Generate unique user ID for Agora
export const generateAgoraUserId = (prefix: string = 'user'): string => {
  return `${prefix}_${Math.floor(Math.random() * 1000000)}_${Date.now()}`;
};

// Calculate call cost based on duration
export const calculateCallCost = (durationInSeconds: number): {
  totalCost: number;
  expertEarnings: number;
  platformFee: number;
  freeMinutesUsed: number;
  billableMinutes: number;
} => {
  const durationInMinutes = durationInSeconds / 60;
  const freeMinutesUsed = Math.min(durationInMinutes, AGORA_CONFIG.PRICING.FREE_MINUTES);
  const billableMinutes = Math.max(0, durationInMinutes - AGORA_CONFIG.PRICING.FREE_MINUTES);
  
  const totalCost = Math.ceil(billableMinutes) * AGORA_CONFIG.PRICING.PRICE_PER_MINUTE;
  const expertEarnings = totalCost * AGORA_CONFIG.PRICING.EXPERT_COMMISSION;
  const platformFee = totalCost - expertEarnings;
  
  return {
    totalCost,
    expertEarnings,
    platformFee,
    freeMinutesUsed,
    billableMinutes: Math.ceil(billableMinutes)
  };
};

  // Validate Agora configuration
export const validateAgoraConfig = (): boolean => {
  const appId = import.meta.env.VITE_AGORA_APP_ID;
  
  if (!appId) {
    console.error('❌ VITE_AGORA_APP_ID is not set in .env file');
    console.error('❌ Agora calls will not work without this configuration');
    console.error('❌ Please add VITE_AGORA_APP_ID to your .env file');
    return false;
  }
  
  if (appId.length !== 32) {
    console.error('❌ Agora App ID format is invalid (should be 32 characters)');
    console.error(`❌ Current length: ${appId.length} characters`);
    return false;
  }
  
  if (AGORA_CONFIG.APP_ID !== appId) {
    console.warn('⚠️ AGORA_CONFIG.APP_ID does not match env var - this should not happen');
  }
  
  // Optional: log chat config presence without leaking secrets
  if (AGORA_CONFIG.CHAT?.HOST) {
    console.log('ℹ️ Agora Chat host configured');
  }
  
  // Log environment variable status
  const envAppId = import.meta.env.VITE_AGORA_APP_ID;
  if (envAppId) {
    console.log('✅ Agora App ID loaded from environment variable');
  } else {
    console.error('❌ VITE_AGORA_APP_ID is not set in .env file - Agora calls will not work!');
    console.error('❌ Please set VITE_AGORA_APP_ID in your .env file');
  }
  
  console.log('✅ Agora configuration is valid');
  return true;
};