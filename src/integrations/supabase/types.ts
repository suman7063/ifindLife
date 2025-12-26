export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_accounts: {
        Row: {
          created_at: string
          email: string
          failed_login_attempts: number
          id: string
          is_active: boolean
          last_login: string | null
          locked_until: string | null
          password_hash: string
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          failed_login_attempts?: number
          id?: string
          is_active?: boolean
          last_login?: string | null
          locked_until?: string | null
          password_hash: string
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          failed_login_attempts?: number
          id?: string
          is_active?: boolean
          last_login?: string | null
          locked_until?: string | null
          password_hash?: string
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown
          revoked_at: string | null
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown
          revoked_at?: string | null
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          revoked_at?: string | null
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          channel_name: string | null
          created_at: string | null
          duration: number
          end_time: string | null
          expert_id: string
          expert_name: string
          google_calendar_event_id: string | null
          id: string
          notes: string | null
          order_id: string | null
          payment_status: string | null
          razorpay_payment_id: string | null
          reminder_sent: boolean | null
          service_id: string | null
          start_time: string | null
          status: string | null
          time_slot_id: string | null
          token: string | null
          uid: number | null
          user_calendar_event_id: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          channel_name?: string | null
          created_at?: string | null
          duration: number
          end_time?: string | null
          expert_id: string
          expert_name: string
          google_calendar_event_id?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_status?: string | null
          razorpay_payment_id?: string | null
          reminder_sent?: boolean | null
          service_id?: string | null
          start_time?: string | null
          status?: string | null
          time_slot_id?: string | null
          token?: string | null
          uid?: number | null
          user_calendar_event_id?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          channel_name?: string | null
          created_at?: string | null
          duration?: number
          end_time?: string | null
          expert_id?: string
          expert_name?: string
          google_calendar_event_id?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_status?: string | null
          razorpay_payment_id?: string | null
          reminder_sent?: boolean | null
          service_id?: string | null
          start_time?: string | null
          status?: string | null
          time_slot_id?: string | null
          token?: string | null
          uid?: number | null
          user_calendar_event_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      call_pricing: {
        Row: {
          active: boolean | null
          created_at: string | null
          duration_minutes: number
          id: string
          price_eur: number | null
          price_inr: number
          price_usd: number
          tier: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          price_eur?: number | null
          price_inr: number
          price_usd: number
          tier?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          price_eur?: number | null
          price_inr?: number
          price_usd?: number
          tier?: string | null
        }
        Relationships: []
      }
      call_sessions: {
        Row: {
          agora_channel_name: string | null
          agora_token: string | null
          analytics_data: Json | null
          answered_at: string | null
          appointment_id: string | null
          call_direction: string | null
          call_metadata: Json
          call_type: string | null
          channel_name: string
          cost: number | null
          cost_eur: number | null
          created_at: string | null
          currency: string | null
          duration: number | null
          end_time: string | null
          expert_auth_id: string | null
          expert_category: string | null
          expert_id: string
          failure_reason: string | null
          id: string
          missed_call: boolean | null
          payment_method: string | null
          payment_status: string | null
          pricing_tier: string | null
          rating: number | null
          razorpay_payment_id: string | null
          recording_url: string | null
          review: string | null
          selected_duration: number | null
          start_time: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agora_channel_name?: string | null
          agora_token?: string | null
          analytics_data?: Json | null
          answered_at?: string | null
          appointment_id?: string | null
          call_direction?: string | null
          call_metadata?: Json
          call_type?: string | null
          channel_name: string
          cost?: number | null
          cost_eur?: number | null
          created_at?: string | null
          currency?: string | null
          duration?: number | null
          end_time?: string | null
          expert_auth_id?: string | null
          expert_category?: string | null
          expert_id: string
          failure_reason?: string | null
          id: string
          missed_call?: boolean | null
          payment_method?: string | null
          payment_status?: string | null
          pricing_tier?: string | null
          rating?: number | null
          razorpay_payment_id?: string | null
          recording_url?: string | null
          review?: string | null
          selected_duration?: number | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agora_channel_name?: string | null
          agora_token?: string | null
          analytics_data?: Json | null
          answered_at?: string | null
          appointment_id?: string | null
          call_direction?: string | null
          call_metadata?: Json
          call_type?: string | null
          channel_name?: string
          cost?: number | null
          cost_eur?: number | null
          created_at?: string | null
          currency?: string | null
          duration?: number | null
          end_time?: string | null
          expert_auth_id?: string | null
          expert_category?: string | null
          expert_id?: string
          failure_reason?: string | null
          id?: string
          missed_call?: boolean | null
          payment_method?: string | null
          payment_status?: string | null
          pricing_tier?: string | null
          rating?: number | null
          razorpay_payment_id?: string | null
          recording_url?: string | null
          review?: string | null
          selected_duration?: number | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_sessions_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
        ]
      }
      expert_accounts: {
        Row: {
          address: string | null
          auth_id: string
          availability_set: boolean | null
          average_rating: number | null
          bio: string | null
          category: string | null
          certificate_urls: string[]
          city: string | null
          country: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          experience: string | null
          feedback_message: string | null
          languages: string[]
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          pricing_set: boolean | null
          profile_completed: boolean | null
          profile_picture: string | null
          reviews_count: number | null
          specialization: string | null
          state: string | null
          status: string | null
          updated_by_admin_at: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          auth_id: string
          availability_set?: boolean | null
          average_rating?: number | null
          bio?: string | null
          category?: string | null
          certificate_urls?: string[]
          city?: string | null
          country?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          experience?: string | null
          feedback_message?: string | null
          languages?: string[]
          name: string
          onboarding_completed?: boolean | null
          phone?: string | null
          pricing_set?: boolean | null
          profile_completed?: boolean | null
          profile_picture?: string | null
          reviews_count?: number | null
          specialization?: string | null
          state?: string | null
          status?: string | null
          updated_by_admin_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          auth_id?: string
          availability_set?: boolean | null
          average_rating?: number | null
          bio?: string | null
          category?: string | null
          certificate_urls?: string[]
          city?: string | null
          country?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          experience?: string | null
          feedback_message?: string | null
          languages?: string[]
          name?: string
          onboarding_completed?: boolean | null
          phone?: string | null
          pricing_set?: boolean | null
          profile_completed?: boolean | null
          profile_picture?: string | null
          reviews_count?: number | null
          specialization?: string | null
          state?: string | null
          status?: string | null
          updated_by_admin_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      expert_approval_notifications: {
        Row: {
          created_at: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          expert_id: string
          id: string
          notification_type: string
        }
        Insert: {
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          expert_id: string
          id?: string
          notification_type: string
        }
        Update: {
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          expert_id?: string
          id?: string
          notification_type?: string
        }
        Relationships: []
      }
      expert_availabilities: {
        Row: {
          created_at: string
          day_of_week: number
          end_date: string | null
          end_time: string
          expert_id: string
          id: string
          is_available: boolean
          start_date: string | null
          start_time: string
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_date?: string | null
          end_time: string
          expert_id: string
          id?: string
          is_available?: boolean
          start_date?: string | null
          start_time: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_date?: string | null
          end_time?: string
          expert_id?: string
          id?: string
          is_available?: boolean
          start_date?: string | null
          start_time?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_availabilities_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
        ]
      }
      expert_away_messages: {
        Row: {
          expert_id: string
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          sent_at: string
          user_id: string
        }
        Insert: {
          expert_id: string
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          sent_at?: string
          user_id: string
        }
        Update: {
          expert_id?: string
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_away_messages_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
        ]
      }
      expert_categories: {
        Row: {
          base_price_30_eur: number | null
          base_price_30_inr: number | null
          base_price_60_eur: number | null
          base_price_60_inr: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          base_price_30_eur?: number | null
          base_price_30_inr?: number | null
          base_price_60_eur?: number | null
          base_price_60_inr?: number | null
          created_at?: string | null
          description?: string | null
          id: string
          name: string
        }
        Update: {
          base_price_30_eur?: number | null
          base_price_30_inr?: number | null
          base_price_60_eur?: number | null
          base_price_60_inr?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      expert_category_duration_pricing: {
        Row: {
          category_id: string
          created_at: string
          duration_minutes: number
          id: string
          price_eur: number
          price_inr: number
        }
        Insert: {
          category_id: string
          created_at?: string
          duration_minutes: number
          id?: string
          price_eur?: number
          price_inr?: number
        }
        Update: {
          category_id?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          price_eur?: number
          price_inr?: number
        }
        Relationships: [
          {
            foreignKeyName: "expert_category_duration_pricing_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expert_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_category_pricing: {
        Row: {
          active: boolean | null
          category: string
          created_at: string
          duration_minutes: number
          id: string
          price_inr: number
          price_usd: number
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string
          duration_minutes: number
          id?: string
          price_inr: number
          price_usd: number
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          price_inr?: number
          price_usd?: number
          updated_at?: string
        }
        Relationships: []
      }
      expert_category_services: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          service_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          service_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_category_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expert_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_category_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_onboarding_status: {
        Row: {
          availability_setup: boolean | null
          created_at: string | null
          expert_id: string
          first_login_after_approval: string | null
          id: string
          onboarding_completed: boolean | null
          pricing_setup: boolean | null
          profile_completed: boolean | null
          services_assigned: boolean | null
          updated_at: string | null
        }
        Insert: {
          availability_setup?: boolean | null
          created_at?: string | null
          expert_id: string
          first_login_after_approval?: string | null
          id?: string
          onboarding_completed?: boolean | null
          pricing_setup?: boolean | null
          profile_completed?: boolean | null
          services_assigned?: boolean | null
          updated_at?: string | null
        }
        Update: {
          availability_setup?: boolean | null
          created_at?: string | null
          expert_id?: string
          first_login_after_approval?: string | null
          id?: string
          onboarding_completed?: boolean | null
          pricing_setup?: boolean | null
          profile_completed?: boolean | null
          services_assigned?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      expert_presence: {
        Row: {
          accepting_calls: boolean
          created_at: string
          expert_id: string
          id: string
          last_activity: string
          previous_status: string | null
          status: string
          updated_at: string
        }
        Insert: {
          accepting_calls?: boolean
          created_at?: string
          expert_id: string
          id?: string
          last_activity?: string
          previous_status?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          accepting_calls?: boolean
          created_at?: string
          expert_id?: string
          id?: string
          last_activity?: string
          previous_status?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_presence_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
        ]
      }
      expert_pricing_tiers: {
        Row: {
          category: string
          created_at: string
          expert_id: string
          id: string
          session_30_eur: number | null
          session_30_inr: number | null
          session_60_eur: number | null
          session_60_inr: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          expert_id: string
          id?: string
          session_30_eur?: number | null
          session_30_inr?: number | null
          session_60_eur?: number | null
          session_60_inr?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          expert_id?: string
          id?: string
          session_30_eur?: number | null
          session_30_inr?: number | null
          session_60_eur?: number | null
          session_60_inr?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_pricing_tiers_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
        ]
      }
      expert_service_specializations: {
        Row: {
          created_at: string
          expert_id: string
          id: string
          is_available: boolean | null
          is_primary_service: boolean | null
          proficiency_level: string | null
          service_id: string
        }
        Insert: {
          created_at?: string
          expert_id: string
          id?: string
          is_available?: boolean | null
          is_primary_service?: boolean | null
          proficiency_level?: string | null
          service_id: string
        }
        Update: {
          created_at?: string
          expert_id?: string
          id?: string
          is_available?: boolean | null
          is_primary_service?: boolean | null
          proficiency_level?: string | null
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_service_specializations_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
          {
            foreignKeyName: "expert_service_specializations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_services: {
        Row: {
          admin_assigned_rate_inr: number | null
          admin_assigned_rate_usd: number | null
          assigned_at: string | null
          assigned_by: string | null
          created_at: string
          expert_id: string
          id: string
          is_active: boolean | null
          service_id: string
          updated_at: string
        }
        Insert: {
          admin_assigned_rate_inr?: number | null
          admin_assigned_rate_usd?: number | null
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string
          expert_id: string
          id?: string
          is_active?: boolean | null
          service_id: string
          updated_at?: string
        }
        Update: {
          admin_assigned_rate_inr?: number | null
          admin_assigned_rate_usd?: number | null
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string
          expert_id?: string
          id?: string
          is_active?: boolean | null
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_services_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
          {
            foreignKeyName: "expert_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_user_reports: {
        Row: {
          call_session_id: string | null
          created_at: string
          details: string | null
          expert_id: string
          id: string
          reason: string
          reported_user_email: string | null
          reported_user_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          call_session_id?: string | null
          created_at?: string
          details?: string | null
          expert_id: string
          id?: string
          reason: string
          reported_user_email?: string | null
          reported_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          call_session_id?: string | null
          created_at?: string
          details?: string | null
          expert_id?: string
          id?: string
          reason?: string
          reported_user_email?: string | null
          reported_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_user_reports_call_session_id_fkey"
            columns: ["call_session_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      incoming_call_requests: {
        Row: {
          agora_token: string | null
          agora_uid: number | null
          call_session_id: string | null
          call_type: string
          channel_name: string
          created_at: string
          estimated_cost_eur: number | null
          estimated_cost_inr: number | null
          expert_id: string
          expires_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
          user_metadata: Json | null
        }
        Insert: {
          agora_token?: string | null
          agora_uid?: number | null
          call_session_id?: string | null
          call_type: string
          channel_name: string
          created_at?: string
          estimated_cost_eur?: number | null
          estimated_cost_inr?: number | null
          expert_id: string
          expires_at: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          user_metadata?: Json | null
        }
        Update: {
          agora_token?: string | null
          agora_uid?: number | null
          call_session_id?: string | null
          call_type?: string
          channel_name?: string
          created_at?: string
          estimated_cost_eur?: number | null
          estimated_cost_inr?: number | null
          expert_id?: string
          expires_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          user_metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "incoming_call_requests_call_session_id_fkey"
            columns: ["call_session_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incoming_call_requests_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          read: boolean | null
          reference_id: string | null
          sender_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          read?: boolean | null
          reference_id?: string | null
          sender_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          read?: boolean | null
          reference_id?: string | null
          sender_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          item_type: string | null
          original_amount: number | null
          original_currency: string | null
          razorpay_order_id: string
          razorpay_payment_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          item_type?: string | null
          original_amount?: number | null
          original_currency?: string | null
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          item_type?: string | null
          original_amount?: number | null
          original_currency?: string | null
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          profile_picture: string | null
          reward_points: number | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          profile_picture?: string | null
          reward_points?: number | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          profile_picture?: string | null
          reward_points?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          duration: string
          enrollments: number | null
          id: number
          image: string
          price: number
          programtype: string | null
          sessions: number
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          duration: string
          enrollments?: number | null
          id?: number
          image: string
          price: number
          programtype?: string | null
          sessions: number
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          duration?: string
          enrollments?: number | null
          id?: number
          image?: string
          price?: number
          programtype?: string | null
          sessions?: number
          title?: string
        }
        Relationships: []
      }
      referral_settings: {
        Row: {
          currency: string
          id: string
          program_enabled: boolean
          reward_amount: number
          updated_at: string
        }
        Insert: {
          currency?: string
          id?: string
          program_enabled?: boolean
          reward_amount?: number
          updated_at?: string
        }
        Update: {
          currency?: string
          id?: string
          program_enabled?: boolean
          reward_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_claimed: boolean | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_claimed?: boolean | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          reward_claimed?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      service_pricing: {
        Row: {
          base_price_inr: number
          base_price_usd: number
          created_at: string | null
          demand_multiplier: number | null
          discount_percentage: number | null
          experience_multiplier: number | null
          expert_id: string | null
          id: string
          is_active: boolean | null
          maximum_session_duration: number | null
          minimum_session_duration: number | null
          peak_hour_multiplier: number | null
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          base_price_inr?: number
          base_price_usd?: number
          created_at?: string | null
          demand_multiplier?: number | null
          discount_percentage?: number | null
          experience_multiplier?: number | null
          expert_id?: string | null
          id?: string
          is_active?: boolean | null
          maximum_session_duration?: number | null
          minimum_session_duration?: number | null
          peak_hour_multiplier?: number | null
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price_inr?: number
          base_price_usd?: number
          created_at?: string | null
          demand_multiplier?: number | null
          discount_percentage?: number | null
          experience_multiplier?: number | null
          expert_id?: string | null
          id?: string
          is_active?: boolean | null
          maximum_session_duration?: number | null
          minimum_session_duration?: number | null
          peak_hour_multiplier?: number | null
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_pricing_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
          {
            foreignKeyName: "service_pricing_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          description: string | null
          duration: number | null
          featured: boolean | null
          id: string
          name: string
          rate_eur: number | null
          rate_inr: number
          rate_usd: number
        }
        Insert: {
          category?: string | null
          description?: string | null
          duration?: number | null
          featured?: boolean | null
          id?: string
          name: string
          rate_eur?: number | null
          rate_inr?: number
          rate_usd: number
        }
        Update: {
          category?: string | null
          description?: string | null
          duration?: number | null
          featured?: boolean | null
          id?: string
          name?: string
          rate_eur?: number | null
          rate_inr?: number
          rate_usd?: number
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          admin_notes: string | null
          category: string
          created_at: string
          id: string
          message: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          category: string
          created_at?: string
          id?: string
          message: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          category?: string
          created_at?: string
          id?: string
          message?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string | null
          date: string
          id: string
          image_url: string
          location: string
          name: string
          rating: number
          text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          image_url: string
          location: string
          name: string
          rating: number
          text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          image_url?: string
          location?: string
          name?: string
          rating?: number
          text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_expert_services: {
        Row: {
          created_at: string
          expert_id: string
          id: string
          service_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expert_id: string
          id?: string
          service_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expert_id?: string
          id?: string
          service_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_expert_services_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
          {
            foreignKeyName: "user_expert_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_expert_services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_programs: {
        Row: {
          created_at: string
          id: string
          program_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          program_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          program_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          expert_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          expert_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          expert_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_geolocations: {
        Row: {
          country_code: string | null
          country_name: string | null
          currency: string | null
          detected_at: string | null
          id: string
          ip_address: unknown
          user_id: string | null
        }
        Insert: {
          country_code?: string | null
          country_name?: string | null
          currency?: string | null
          detected_at?: string | null
          id?: string
          ip_address?: unknown
          user_id?: string | null
        }
        Update: {
          country_code?: string | null
          country_name?: string | null
          currency?: string | null
          detected_at?: string | null
          id?: string
          ip_address?: unknown
          user_id?: string | null
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          appointment_reminders: boolean | null
          booking_confirmations: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          expert_messages: boolean | null
          id: string
          promotional_emails: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
          weekly_digest: boolean | null
        }
        Insert: {
          appointment_reminders?: boolean | null
          booking_confirmations?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          expert_messages?: boolean | null
          id?: string
          promotional_emails?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weekly_digest?: boolean | null
        }
        Update: {
          appointment_reminders?: boolean | null
          booking_confirmations?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          expert_messages?: boolean | null
          id?: string
          promotional_emails?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weekly_digest?: boolean | null
        }
        Relationships: []
      }
      user_reviews: {
        Row: {
          comment: string | null
          date: string
          expert_id: string | null
          expert_name: string | null
          id: string
          rating: number
          user_id: string | null
          user_name: string | null
          verified: boolean | null
        }
        Insert: {
          comment?: string | null
          date: string
          expert_id?: string | null
          expert_name?: string | null
          id?: string
          rating: number
          user_id?: string | null
          user_name?: string | null
          verified?: boolean | null
        }
        Update: {
          comment?: string | null
          date?: string
          expert_id?: string | null
          expert_name?: string | null
          id?: string
          rating?: number
          user_id?: string | null
          user_name?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
          {
            foreignKeyName: "user_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          date_of_birth: string | null
          email: string | null
          gender: string | null
          id: string
          marketing_consent: boolean | null
          name: string | null
          occupation: string | null
          phone: string | null
          preferences: Json
          privacy_accepted: boolean | null
          profile_picture: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
          reward_points: number | null
          terms_accepted: boolean | null
          wallet_balance: number | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          marketing_consent?: boolean | null
          name?: string | null
          occupation?: string | null
          phone?: string | null
          preferences?: Json
          privacy_accepted?: boolean | null
          profile_picture?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
          reward_points?: number | null
          terms_accepted?: boolean | null
          wallet_balance?: number | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          marketing_consent?: boolean | null
          name?: string | null
          occupation?: string | null
          phone?: string | null
          preferences?: Json
          privacy_accepted?: boolean | null
          profile_picture?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
          reward_points?: number | null
          terms_accepted?: boolean | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          honeypot: string | null
          id: string
          subscriber_number: number
        }
        Insert: {
          created_at?: string | null
          email: string
          honeypot?: string | null
          id?: string
          subscriber_number: number
        }
        Update: {
          created_at?: string | null
          email?: string
          honeypot?: string | null
          id?: string
          subscriber_number?: number
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          reason: string
          reference_id: string | null
          reference_type: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reason: string
          reference_id?: string | null
          reference_type?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reason?: string
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          event_type: string
          id: string
          payload: Json
          processed_at: string
          provider: string
          status: string
        }
        Insert: {
          event_type: string
          id?: string
          payload: Json
          processed_at?: string
          provider: string
          status: string
        }
        Update: {
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string
          provider?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_wallet_credit: {
        Args: {
          p_amount: number
          p_created_by?: string
          p_description?: string
          p_expires_in_months?: number
          p_metadata?: Json
          p_reason: string
          p_reference_id?: string
          p_reference_type?: string
          p_user_id: string
        }
        Returns: string
      }
      admin_list_all_experts: {
        Args: never
        Returns: {
          address: string | null
          auth_id: string
          availability_set: boolean | null
          average_rating: number | null
          bio: string | null
          category: string | null
          certificate_urls: string[]
          city: string | null
          country: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          experience: string | null
          feedback_message: string | null
          languages: string[]
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          pricing_set: boolean | null
          profile_completed: boolean | null
          profile_picture: string | null
          reviews_count: number | null
          specialization: string | null
          state: string | null
          status: string | null
          updated_by_admin_at: string | null
          user_id: string | null
          verified: boolean | null
        }[]
        SetofOptions: {
          from: "*"
          to: "expert_accounts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_all_experts_including_deleted: {
        Args: never
        Returns: {
          address: string | null
          auth_id: string
          availability_set: boolean | null
          average_rating: number | null
          bio: string | null
          category: string | null
          certificate_urls: string[]
          city: string | null
          country: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          experience: string | null
          feedback_message: string | null
          languages: string[]
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          pricing_set: boolean | null
          profile_completed: boolean | null
          profile_picture: string | null
          reviews_count: number | null
          specialization: string | null
          state: string | null
          status: string | null
          updated_by_admin_at: string | null
          user_id: string | null
          verified: boolean | null
        }[]
        SetofOptions: {
          from: "*"
          to: "expert_accounts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_deleted_experts: {
        Args: never
        Returns: {
          address: string | null
          auth_id: string
          availability_set: boolean | null
          average_rating: number | null
          bio: string | null
          category: string | null
          certificate_urls: string[]
          city: string | null
          country: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          experience: string | null
          feedback_message: string | null
          languages: string[]
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          pricing_set: boolean | null
          profile_completed: boolean | null
          profile_picture: string | null
          reviews_count: number | null
          specialization: string | null
          state: string | null
          status: string | null
          updated_by_admin_at: string | null
          user_id: string | null
          verified: boolean | null
        }[]
        SetofOptions: {
          from: "*"
          to: "expert_accounts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_restore_expert: {
        Args: { p_auth_id: string }
        Returns: {
          address: string | null
          auth_id: string
          availability_set: boolean | null
          average_rating: number | null
          bio: string | null
          category: string | null
          certificate_urls: string[]
          city: string | null
          country: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          experience: string | null
          feedback_message: string | null
          languages: string[]
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          pricing_set: boolean | null
          profile_completed: boolean | null
          profile_picture: string | null
          reviews_count: number | null
          specialization: string | null
          state: string | null
          status: string | null
          updated_by_admin_at: string | null
          user_id: string | null
          verified: boolean | null
        }
        SetofOptions: {
          from: "*"
          to: "expert_accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_update_expert_status: {
        Args: { p_auth_id: string; p_status: string }
        Returns: {
          address: string | null
          auth_id: string
          availability_set: boolean | null
          average_rating: number | null
          bio: string | null
          category: string | null
          certificate_urls: string[]
          city: string | null
          country: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          experience: string | null
          feedback_message: string | null
          languages: string[]
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          pricing_set: boolean | null
          profile_completed: boolean | null
          profile_picture: string | null
          reviews_count: number | null
          specialization: string | null
          state: string | null
          status: string | null
          updated_by_admin_at: string | null
          user_id: string | null
          verified: boolean | null
        }
        SetofOptions: {
          from: "*"
          to: "expert_accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      authenticate_admin: {
        Args: { p_password: string; p_username: string }
        Returns: Json
      }
      check_email_uniqueness_across_accounts: {
        Args: {
          p_email: string
          p_exclude_admin_id?: string
          p_exclude_auth_user_id?: string
          p_exclude_expert_id?: string
          p_exclude_user_id?: string
        }
        Returns: boolean
      }
      check_if_table_exists: { Args: { table_name: string }; Returns: boolean }
      deduct_wallet_credit: {
        Args: {
          p_amount: number
          p_description?: string
          p_metadata?: Json
          p_reason: string
          p_reference_id?: string
          p_reference_type?: string
          p_user_id: string
        }
        Returns: string
      }
      expert_owns_appointment: {
        Args: { appointment_uuid: string }
        Returns: boolean
      }
      get_approved_expert_presence: {
        Args: { expert_auth_ids: string[] }
        Returns: {
          accepting_calls: boolean
          expert_id: string
          last_activity: string
          status: string
        }[]
      }
      get_approved_experts: {
        Args: never
        Returns: {
          auth_id: string
          average_rating: number
          category: string
          experience: string
          languages: string[]
          name: string
          onboarding_completed: boolean
          profile_completed: boolean
          profile_picture: string
          reviews_count: number
          specialization: string
          status: string
          verified: boolean
        }[]
      }
      get_expert_status_by_email: {
        Args: { p_email: string }
        Returns: {
          address: string
          auth_id: string
          bio: string
          category: string
          city: string
          country: string
          email: string
          experience: string
          feedback_message: string
          name: string
          phone: string
          specialization: string
          state: string
          status: string
        }[]
      }
      get_public_expert_profile: {
        Args: { p_auth_id: string }
        Returns: {
          address: string
          auth_id: string
          average_rating: number
          bio: string
          category: string
          certificate_urls: string[]
          city: string
          country: string
          created_at: string
          email: string
          experience: string
          id: string
          languages: string[]
          name: string
          phone: string
          profile_picture: string
          reviews_count: number
          selected_services: string[]
          specialization: string
          state: string
          status: string
          verified: boolean
        }[]
      }
      get_wallet_balance: { Args: { p_user_id: string }; Returns: number }
      get_wallet_history: {
        Args: { p_limit?: number; p_offset?: number; p_user_id: string }
        Returns: {
          amount: number
          created_at: string
          description: string
          expires_at: string
          id: string
          metadata: Json
          reason: string
          reference_id: string
          reference_type: string
          type: string
        }[]
      }
      process_wallet_refund: {
        Args: {
          p_amount: number
          p_description?: string
          p_metadata?: Json
          p_reason: string
          p_reference_id: string
          p_reference_type: string
          p_user_id: string
        }
        Returns: string
      }
      sync_wallet_balance_cache: {
        Args: never
        Returns: {
          new_balance: number
          old_balance: number
          synced: boolean
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
