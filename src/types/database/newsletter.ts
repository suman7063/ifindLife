
export interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
  active: boolean;
}

export interface NewsletterSubscriptionInsert {
  email: string;
  created_at?: string;
  active?: boolean;
}
