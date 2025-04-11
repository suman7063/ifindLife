
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: any;
        Insert: any;
        Update: any;
      };
      expert_profiles: {
        Row: any;
        Insert: any;
        Update: any;
      };
      referral_settings: {
        Row: any;
        Insert: any;
        Update: any;
      };
      // Add other tables as needed
    };
  };
}
