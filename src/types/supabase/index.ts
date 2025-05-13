
// Re-export all types from subdirectories
export * from './user';
export * from './expert';
export * from './tables';
export * from './reviews';
export * from './referral';
export * from './transactions';
export * from './userProfile';
export * from './userFavorites';
export * from './courses';

// Export the Database type for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: any;
        Insert: any;
        Update: any;
      };
      experts: {
        Row: any;
        Insert: any;
        Update: any;
      };
      // Add other tables as needed
    };
    Views: {};
    Functions: {};
  };
}
