
export const walletDataDefaults = {
  initialBalance: 0,
  currency: 'INR',
};

export const userSettingsDefaults = {
  theme: 'system',
  notifications_enabled: true,
  email_notifications: true,
  newsletter: false,
  two_factor_auth: false,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  language: 'english',
};

export const profileDefaults = {
  getReferralCode: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
  getDefaultAvatar: () => null,
};

export const getReferralLink = (referralCode: string) => {
  return `${window.location.origin}/register?ref=${referralCode}`;
};

export const getWalletDefaults = () => ({
  balance: walletDataDefaults.initialBalance,
  currency: walletDataDefaults.currency,
});
