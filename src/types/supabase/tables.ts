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
      appointments: {
        Row: {
          actual_duration: number | null
          appointment_date: string
          calendar_event_id: string | null
          channel_name: string | null
          created_at: string
          currency: string | null
          duration: number
          expert_id: string
          expert_name: string
          extension_count: number | null
          id: string
          notes: string | null
          price: number | null
          refunded: boolean | null
          service_id: number
          status: string
          token: string | null
          uid: number | null
          user_id: string
        }
        Insert: {
          actual_duration?: number | null
          appointment_date: string
          calendar_event_id?: string | null
          channel_name?: string | null
          created_at?: string
          currency?: string | null
          duration: number
          expert_id: string
          expert_name: string
          extension_count?: number | null
          id?: string
          notes?: string | null
          price?: number | null
          refunded?: boolean | null
          service_id: number
          status: string
          token?: string | null
          uid?: number | null
          user_id: string
        }
        Update: {
          actual_duration?: number | null
          appointment_date?: string
          calendar_event_id?: string | null
          channel_name?: string | null
          created_at?: string
          currency?: string | null
          duration?: number
          expert_id?: string
          expert_name?: string
          extension_count?: number | null
          id?: string
          notes?: string | null
          price?: number | null
          refunded?: boolean | null
          service_id?: number
          status?: string
          token?: string | null
          uid?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_expert_id_fkey"
            columns: ["expert_id"]
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          href: string | null
          icon: string | null
          id: number
          title: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          href?: string | null
          icon?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          href?: string | null
          icon?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      expert_availability: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          expert_id: string
          id: string
          is_available: boolean
          start_time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          expert_id: string
          id?: string
          is_available: boolean
          start_time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          expert_id?: string
          id?: string
          is_available?: boolean
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_availability_expert_id_fkey"
            columns: ["expert_id"]
            referencedRelation: "experts"
            referencedColumns: ["id"]
          }
        ]
      }
      experts: {
        Row: {
          address: string | null
          bio: string | null
          certificate_urls: string[] | null
          city: string | null
          consultations: number | null
          country: string | null
          created_at: string | null
          education: string[] | null
          email: string | null
          experience: number | null
          id: string
          image_url: string | null
          languages: string[] | null
          name: string | null
          online: boolean | null
          phone: string | null
          price: number | null
          profile_picture: string | null
          rating: number | null
          services: number[] | null
          specialization: string | null
          specialties: string[] | null
          state: string | null
          user_id: string | null
          wait_time: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          certificate_urls?: string[] | null
          city?: string | null
          consultations?: number | null
          country?: string | null
          created_at?: string | null
          education?: string[] | null
          email?: string | null
          experience?: number | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name?: string | null
          online?: boolean | null
          phone?: string | null
          price?: number | null
          profile_picture?: string | null
          rating?: number | null
          services?: number[] | null
          specialization?: string | null
          specialties?: string[] | null
          state?: string | null
          user_id?: string | null
          wait_time?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          certificate_urls?: string[] | null
          city?: string | null
          consultations?: number | null
          country?: string | null
          created_at?: string | null
          education?: string[] | null
          email?: string | null
          experience?: number | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name?: string | null
          online?: boolean | null
          phone?: string | null
          price?: number | null
          profile_picture?: string | null
          rating?: number | null
          services?: number[] | null
          specialization?: string | null
          specialties?: string[] | null
          state?: string | null
          user_id?: string | null
          wait_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      referrals: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          new_user_id: string | null
          referrer_id: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          new_user_id?: string | null
          referrer_id?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          new_user_id?: string | null
          referrer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_new_user_id_fkey"
            columns: ["new_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          comment: string | null
          created_at: string | null
          expert_id: string | null
          id: string
          reason: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          expert_id?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          expert_id?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_expert_id_fkey"
            columns: ["expert_id"]
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          date: string | null
          expert_id: number | null
          id: string
          rating: number | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          date?: string | null
          expert_id?: number | null
          id?: string
          rating?: number | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          date?: string | null
          expert_id?: number | null
          id?: string
          rating?: number | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_expert_id_fkey"
            columns: ["expert_id"]
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          duration: number | null
          expert_id: string | null
          id: number
          name: string | null
          price: number | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          expert_id?: string | null
          id?: number
          name?: string | null
          price?: number | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          expert_id?: string | null
          id?: number
          name?: string | null
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_expert_id_fkey"
            columns: ["expert_id"]
            referencedRelation: "experts"
            referencedColumns: ["id"]
          }
        ]
      }
      user_reviews: {
        Row: {
          comment: string | null
          date: string | null
          expert_id: number | null
          id: string
          rating: number | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          comment?: string | null
          date?: string | null
          expert_id?: number | null
          id?: string
          rating?: number | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          comment?: string | null
          date?: string | null
          expert_id?: number | null
          id?: string
          rating?: number | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_expert_id_fkey"
            columns: ["expert_id"]
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          id: string
          last_login: string | null
          name: string | null
          phone: string | null
          profile_picture: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
          state: string | null
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          id: string
          last_login?: string | null
          name?: string | null
          phone?: string | null
          profile_picture?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
          state?: string | null
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          name?: string | null
          phone?: string | null
          profile_picture?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
          state?: string | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

// Add expert_availability table
export interface ExpertAvailability {
  id: string;
  expert_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at?: string;
}

// Define update and insert types if needed
export interface ExpertAvailabilityInsert extends Omit<ExpertAvailability, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface ExpertAvailabilityUpdate extends Partial<ExpertAvailabilityInsert> {
  id?: string;
}
