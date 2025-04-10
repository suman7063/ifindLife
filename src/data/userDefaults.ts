
/**
 * Default values for user wallet data
 */
export const walletDataDefaults = {
  initialBalance: 0,
  currency: 'USD'
};

/**
 * Default values for user settings
 */
export const userSettingsDefaults = {
  theme: 'system',
  notificationsEnabled: true,
  emailNotifications: true,
  newsletter: false,
  twoFactorAuth: false,
  language: 'english'
};

/**
 * User profile defaults
 */
export const profileDefaults = {
  generateReferralCode: () => Math.random().toString(36).substring(2, 10).toUpperCase()
};
