
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
          completed_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_claimed: boolean
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_claimed?: boolean
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          reward_claimed?: boolean
          status?: string
        }
        Relationships: []
      }
      referral_settings: {
        Row: {
          id: string
          referrer_reward: number
          referred_reward: number
          active: boolean
          description: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          referrer_reward: number
          referred_reward: number
          active: boolean
          description?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          referrer_reward?: number
          referred_reward?: number
          active?: boolean
          description?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
          user_name: string | null
        }
        Insert: {
          comment?: string | null
          date?: string | null
          expert_id?: number | null
          id?: string
          rating?: number | null
          user_id?: string | null
          verified?: boolean | null
          user_name?: string | null
        }
        Update: {
          comment?: string | null
          date?: string | null
          expert_id?: number | null
          id?: string
          rating?: number | null
          user_id?: string | null
          verified?: boolean | null
          user_name?: string | null
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          id: string
          user_id: string | null
          expert_id: number
          reason: string
          details: string | null
          date: string
          status: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          expert_id: number
          reason: string
          details?: string | null
          date: string
          status: string
        }
        Update: {
          id?: string
          user_id?: string | null
          expert_id?: number
          reason?: string
          details?: string | null
          date?: string
          status?: string
        }
        Relationships: []
      }
      moderation_reports: {
        Row: {
          id: string
          reporter_id: string
          reporter_type: string
          target_id: string
          target_type: string
          reason: string
          details: string | null
          status: string
          created_at: string
          updated_at: string
          session_id: string | null
        }
        Insert: {
          id?: string
          reporter_id: string
          reporter_type: string
          target_id: string
          target_type: string
          reason: string
          details?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          session_id?: string | null
        }
        Update: {
          id?: string
          reporter_id?: string
          reporter_type?: string
          target_id?: string
          target_type?: string
          reason?: string
          details?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          session_id?: string | null
        }
        Relationships: []
      }
      moderation_actions: {
        Row: {
          id: string
          report_id: string
          admin_id: string
          action_type: string
          message: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          admin_id: string
          action_type: string
          message: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          admin_id?: string
          action_type?: string
          message?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      expert_reports: {
        Row: {
          id: string
          expert_id: string | null
          reason: string | null
          details: string | null
          date: string | null
          status: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          id?: string
          expert_id?: string | null
          reason?: string | null
          details?: string | null
          date?: string | null
          status?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          id?: string
          expert_id?: string | null
          reason?: string | null
          details?: string | null
          date?: string | null
          status?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      user_expert_services: {
        Row: {
          id: string
          user_id: string
          expert_id: string
          service_id: number
          amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          expert_id: string
          service_id: number
          amount: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          expert_id?: string
          service_id?: number
          amount?: number
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string | null
          expert_id: number
        }
        Insert: {
          id?: string
          user_id?: string | null
          expert_id: number
        }
        Update: {
          id?: string
          user_id?: string | null
          expert_id?: number
        }
        Relationships: []
      }
      user_transactions: {
        Row: {
          id: string
          user_id: string | null
          date: string
          type: string
          amount: number
          currency: string
          description: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          date: string
          type: string
          amount: number
          currency: string
          description?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          date?: string
          type?: string
          amount?: number
          currency?: string
          description?: string | null
        }
        Relationships: []
      }
      user_courses: {
        Row: {
          id: string
          user_id: string | null
          title: string
          expert_id: number
          expert_name: string
          enrollment_date: string
          progress: number | null
          completed: boolean | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          expert_id: number
          expert_name: string
          enrollment_date: string
          progress?: number | null
          completed?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          expert_id?: number
          expert_name?: string
          enrollment_date?: string
          progress?: number | null
          completed?: boolean | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          created_at: string | null
          email: string | null
          name: string | null
          phone: string | null
          country: string | null
          city: string | null
          profile_picture: string | null
          wallet_balance: number | null
          currency: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
          country?: string | null
          city?: string | null
          profile_picture?: string | null
          wallet_balance?: number | null
          currency?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
          country?: string | null
          city?: string | null
          profile_picture?: string | null
          wallet_balance?: number | null
          currency?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
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

// Now define the types for the UI with camelCase properties
export type User = Database['public']['Tables']['users']['Row'];
export type Expert = Database['public']['Tables']['experts']['Row'];

// Add expert_availability table
export interface ExpertAvailability {
  id: string;
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt?: string;
}

// Define update and insert types if needed
export interface ExpertAvailabilityInsert {
  id?: string;
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt?: string;
}

export interface ExpertAvailabilityUpdate extends Partial<ExpertAvailabilityInsert> {
  id?: string;
}

// Add a type for the ReferralSettings with proper camelCase props
export interface ReferralSettings {
  id: string;
  referrerReward: number;
  referredReward: number;
  active: boolean;
  description?: string;
  updatedAt?: string;
}
