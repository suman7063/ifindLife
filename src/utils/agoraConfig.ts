// Agora configuration constants
export const AGORA_CONFIG = {
  // Use Vite env vars with safe fallbacks for local/dev
  APP_ID: (import.meta as any).env?.VITE_AGORA_APP_ID || '9b3ad657507642f98a52d47893780e8e',

  // Optional Agora Chat configuration (if/when using Agora Chat SDK)
  CHAT: {
    HOST: (import.meta as any).env?.VITE_AGORA_CHAT_HOST || '',
    ORG_NAME: (import.meta as any).env?.VITE_AGORA_CHAT_ORG_NAME || '',
    APP_NAME: (import.meta as any).env?.VITE_AGORA_CHAT_APP_NAME || ''
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

// Generate unique channel name for expert-user call
export const generateChannelName = (expertId: string, userId: string): string => {
  const timestamp = Date.now();
  return `${AGORA_CONFIG.CHANNEL_PREFIX}${expertId}_${userId}_${timestamp}`;
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
  if (!AGORA_CONFIG.APP_ID) {
    console.error('❌ Agora App ID is missing');
    return false;
  }
  
  if (AGORA_CONFIG.APP_ID.length !== 32) {
    console.error('❌ Agora App ID format is invalid');
    return false;
  }
  
  // Optional: log chat config presence without leaking secrets
  if (AGORA_CONFIG.CHAT?.HOST) {
    console.log('ℹ️ Agora Chat host configured');
  }
  
  console.log('✅ Agora configuration is valid');
  return true;
};