
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          phone: string | null
          country: string | null
          city: string | null
          wallet_balance: number | null
          created_at: string | null
          currency: string | null
          profile_picture: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          phone?: string | null
          country?: string | null
          city?: string | null
          wallet_balance?: number | null
          created_at?: string | null
          currency?: string | null
          profile_picture?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          country?: string | null
          city?: string | null
          wallet_balance?: number | null
          created_at?: string | null
          currency?: string | null
          profile_picture?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
        }
      }
      // Add more table definitions as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
