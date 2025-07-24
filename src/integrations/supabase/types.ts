export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_accounts: {
        Row: {
          created_at: string
          email: string
          failed_login_attempts: number | null
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
          failed_login_attempts?: number | null
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
          failed_login_attempts?: number | null
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
          admin_id: string | null
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
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
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          id: string
          role: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          channel_name: string | null
          created_at: string
          duration: number
          end_time: string | null
          expert_id: string
          expert_name: string
          google_calendar_event_id: string | null
          id: string
          notes: string | null
          reminder_sent: boolean | null
          service_id: number | null
          start_time: string | null
          status: string
          time_slot_id: string | null
          token: string | null
          uid: number | null
          user_calendar_event_id: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          channel_name?: string | null
          created_at?: string
          duration: number
          end_time?: string | null
          expert_id: string
          expert_name: string
          google_calendar_event_id?: string | null
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          service_id?: number | null
          start_time?: string | null
          status: string
          time_slot_id?: string | null
          token?: string | null
          uid?: number | null
          user_calendar_event_id?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          channel_name?: string | null
          created_at?: string
          duration?: number
          end_time?: string | null
          expert_id?: string
          expert_name?: string
          google_calendar_event_id?: string | null
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          service_id?: number | null
          start_time?: string | null
          status?: string
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
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "expert_time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_requests: {
        Row: {
          created_at: string | null
          duration_minutes: number
          estimated_price_inr: number
          estimated_price_usd: number
          expert_id: string | null
          expert_response: string | null
          expires_at: string | null
          id: string
          payment_status: string | null
          requested_date: string
          requested_time: string
          service_id: number | null
          special_requirements: string | null
          status: string | null
          updated_at: string | null
          urgency_level: string | null
          user_currency: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number
          estimated_price_inr: number
          estimated_price_usd: number
          expert_id?: string | null
          expert_response?: string | null
          expires_at?: string | null
          id?: string
          payment_status?: string | null
          requested_date: string
          requested_time: string
          service_id?: number | null
          special_requirements?: string | null
          status?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          user_currency?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number
          estimated_price_inr?: number
          estimated_price_usd?: number
          expert_id?: string | null
          expert_response?: string | null
          expires_at?: string | null
          id?: string
          payment_status?: string | null
          requested_date?: string
          requested_time?: string
          service_id?: number | null
          special_requirements?: string | null
          status?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          user_currency?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_requests_service_id_fkey"
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
          call_metadata: Json | null
          call_type: string
          channel_name: string
          cost: number | null
          cost_eur: number | null
          created_at: string | null
          currency: string | null
          duration: number | null
          end_time: string | null
          expert_auth_id: string | null
          expert_category: string | null
          expert_id: number
          id: string
          missed_call: boolean | null
          payment_method: string | null
          pricing_tier: string | null
          rating: number | null
          recording_url: string | null
          review: string | null
          selected_duration: number | null
          start_time: string | null
          status: string
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
          call_metadata?: Json | null
          call_type: string
          channel_name: string
          cost?: number | null
          cost_eur?: number | null
          created_at?: string | null
          currency?: string | null
          duration?: number | null
          end_time?: string | null
          expert_auth_id?: string | null
          expert_category?: string | null
          expert_id: number
          id: string
          missed_call?: boolean | null
          payment_method?: string | null
          pricing_tier?: string | null
          rating?: number | null
          recording_url?: string | null
          review?: string | null
          selected_duration?: number | null
          start_time?: string | null
          status?: string
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
          call_metadata?: Json | null
          call_type?: string
          channel_name?: string
          cost?: number | null
          cost_eur?: number | null
          created_at?: string | null
          currency?: string | null
          duration?: number | null
          end_time?: string | null
          expert_auth_id?: string | null
          expert_category?: string | null
          expert_id?: number
          id?: string
          missed_call?: boolean | null
          payment_method?: string | null
          pricing_tier?: string | null
          rating?: number | null
          recording_url?: string | null
          review?: string | null
          selected_duration?: number | null
          start_time?: string | null
          status?: string
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
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: number
          is_read: boolean | null
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          is_read?: boolean | null
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          is_read?: boolean | null
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      expert_accounts: {
        Row: {
          address: string | null
          auth_id: string | null
          availability_set: boolean | null
          average_rating: number | null
          bio: string | null
          category: string | null
          certificate_urls: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          experience: string | null
          id: string
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          pricing_set: boolean | null
          profile_completed: boolean | null
          profile_picture: string | null
          reviews_count: number | null
          selected_services: number[] | null
          specialization: string | null
          state: string | null
          status: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          auth_id?: string | null
          availability_set?: boolean | null
          average_rating?: number | null
          bio?: string | null
          category?: string | null
          certificate_urls?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          experience?: string | null
          id?: string
          name: string
          onboarding_completed?: boolean | null
          phone?: string | null
          pricing_set?: boolean | null
          profile_completed?: boolean | null
          profile_picture?: string | null
          reviews_count?: number | null
          selected_services?: number[] | null
          specialization?: string | null
          state?: string | null
          status?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          auth_id?: string | null
          availability_set?: boolean | null
          average_rating?: number | null
          bio?: string | null
          category?: string | null
          certificate_urls?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          experience?: string | null
          id?: string
          name?: string
          onboarding_completed?: boolean | null
          phone?: string | null
          pricing_set?: boolean | null
          profile_completed?: boolean | null
          profile_picture?: string | null
          reviews_count?: number | null
          selected_services?: number[] | null
          specialization?: string | null
          state?: string | null
          status?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      expert_availabilities: {
        Row: {
          availability_type: string
          created_at: string | null
          end_date: string
          expert_id: string
          id: string
          start_date: string
        }
        Insert: {
          availability_type: string
          created_at?: string | null
          end_date: string
          expert_id: string
          id?: string
          start_date: string
        }
        Update: {
          availability_type?: string
          created_at?: string | null
          end_date?: string
          expert_id?: string
          id?: string
          start_date?: string
        }
        Relationships: []
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
          base_price_eur: number | null
          base_price_inr: number | null
          base_price_usd: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          base_price_eur?: number | null
          base_price_inr?: number | null
          base_price_usd?: number | null
          created_at?: string | null
          description?: string | null
          id: string
          name: string
        }
        Update: {
          base_price_eur?: number | null
          base_price_inr?: number | null
          base_price_usd?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      expert_category_pricing: {
        Row: {
          active: boolean
          category: string
          created_at: string
          duration_minutes: number
          id: string
          price_inr: number
          price_usd: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          duration_minutes: number
          id?: string
          price_inr: number
          price_usd: number
          updated_at?: string
        }
        Update: {
          active?: boolean
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
      expert_presence: {
        Row: {
          auto_away_enabled: boolean | null
          away_timeout_minutes: number | null
          created_at: string
          expert_id: string
          id: string
          last_activity: string
          status: string
          updated_at: string
        }
        Insert: {
          auto_away_enabled?: boolean | null
          away_timeout_minutes?: number | null
          created_at?: string
          expert_id: string
          id?: string
          last_activity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          auto_away_enabled?: boolean | null
          away_timeout_minutes?: number | null
          created_at?: string
          expert_id?: string
          id?: string
          last_activity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_presence_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: true
            referencedRelation: "expert_accounts"
            referencedColumns: ["auth_id"]
          },
        ]
      }
      expert_pricing_tiers: {
        Row: {
          category: string
          consultation_fee_eur: number | null
          consultation_fee_inr: number | null
          consultation_fee_usd: number | null
          created_at: string | null
          expert_id: string
          id: string
          price_per_min_eur: number | null
          price_per_min_inr: number | null
          price_per_min_usd: number | null
          session_30_eur: number | null
          session_30_inr: number | null
          session_30_usd: number | null
          session_60_eur: number | null
          session_60_inr: number | null
          session_60_usd: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          consultation_fee_eur?: number | null
          consultation_fee_inr?: number | null
          consultation_fee_usd?: number | null
          created_at?: string | null
          expert_id: string
          id?: string
          price_per_min_eur?: number | null
          price_per_min_inr?: number | null
          price_per_min_usd?: number | null
          session_30_eur?: number | null
          session_30_inr?: number | null
          session_30_usd?: number | null
          session_60_eur?: number | null
          session_60_inr?: number | null
          session_60_usd?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          consultation_fee_eur?: number | null
          consultation_fee_inr?: number | null
          consultation_fee_usd?: number | null
          created_at?: string | null
          expert_id?: string
          id?: string
          price_per_min_eur?: number | null
          price_per_min_inr?: number | null
          price_per_min_usd?: number | null
          session_30_eur?: number | null
          session_30_inr?: number | null
          session_30_usd?: number | null
          session_60_eur?: number | null
          session_60_inr?: number | null
          session_60_usd?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_pricing_tiers_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_reports: {
        Row: {
          date: string | null
          details: string | null
          expert_id: string | null
          id: string
          reason: string | null
          status: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          date?: string | null
          details?: string | null
          expert_id?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          date?: string | null
          details?: string | null
          expert_id?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_reports_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_service_specializations: {
        Row: {
          certifications: string[] | null
          created_at: string | null
          description: string | null
          expert_id: string | null
          hourly_rate_inr: number | null
          hourly_rate_usd: number | null
          id: string
          is_available: boolean | null
          is_primary_service: boolean | null
          proficiency_level: string | null
          service_id: number | null
          updated_at: string | null
          years_experience: number | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          expert_id?: string | null
          hourly_rate_inr?: number | null
          hourly_rate_usd?: number | null
          id?: string
          is_available?: boolean | null
          is_primary_service?: boolean | null
          proficiency_level?: string | null
          service_id?: number | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          expert_id?: string | null
          hourly_rate_inr?: number | null
          hourly_rate_usd?: number | null
          id?: string
          is_available?: boolean | null
          is_primary_service?: boolean | null
          proficiency_level?: string | null
          service_id?: number | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_service_specializations_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["id"]
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
      expert_time_slots: {
        Row: {
          availability_id: string
          created_at: string | null
          day_of_week: number | null
          end_time: string
          id: string
          is_booked: boolean | null
          specific_date: string | null
          start_time: string
        }
        Insert: {
          availability_id: string
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          is_booked?: boolean | null
          specific_date?: string | null
          start_time: string
        }
        Update: {
          availability_id?: string
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_booked?: boolean | null
          specific_date?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_time_slots_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "expert_availabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      experts: {
        Row: {
          address: string | null
          average_rating: number | null
          bio: string | null
          certificate_urls: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          experience: string | null
          id: string
          name: string
          phone: string | null
          profile_picture: string | null
          reviews_count: number | null
          selected_services: number[] | null
          specialization: string | null
          state: string | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          bio?: string | null
          certificate_urls?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          experience?: string | null
          id?: string
          name: string
          phone?: string | null
          profile_picture?: string | null
          reviews_count?: number | null
          selected_services?: number[] | null
          specialization?: string | null
          state?: string | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          bio?: string | null
          certificate_urls?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          experience?: string | null
          id?: string
          name?: string
          phone?: string | null
          profile_picture?: string | null
          reviews_count?: number | null
          selected_services?: number[] | null
          specialization?: string | null
          state?: string | null
        }
        Relationships: []
      }
      help_tickets: {
        Row: {
          admin_notes: string | null
          category: string
          created_at: string
          details: string
          id: string
          resolved_at: string | null
          screenshot_url: string | null
          status: string
          ticket_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          category: string
          created_at?: string
          details: string
          id?: string
          resolved_at?: string | null
          screenshot_url?: string | null
          status?: string
          ticket_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: string
          created_at?: string
          details?: string
          id?: string
          resolved_at?: string | null
          screenshot_url?: string | null
          status?: string
          ticket_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      incoming_call_requests: {
        Row: {
          agora_token: string | null
          agora_uid: number | null
          call_session_id: string | null
          call_type: string
          channel_name: string
          created_at: string
          estimated_cost_inr: number | null
          estimated_cost_usd: number | null
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
          estimated_cost_inr?: number | null
          estimated_cost_usd?: number | null
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
          estimated_cost_inr?: number | null
          estimated_cost_usd?: number | null
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
      moderation_actions: {
        Row: {
          action_type: Database["public"]["Enums"]["moderation_action_type"]
          admin_id: string
          created_at: string
          id: string
          message: string
          notes: string | null
          report_id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["moderation_action_type"]
          admin_id: string
          created_at?: string
          id?: string
          message: string
          notes?: string | null
          report_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["moderation_action_type"]
          admin_id?: string
          created_at?: string
          id?: string
          message?: string
          notes?: string | null
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_actions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "moderation_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: Database["public"]["Enums"]["report_reason"]
          reporter_id: string
          reporter_type: string
          session_id: string | null
          status: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: Database["public"]["Enums"]["report_reason"]
          reporter_id: string
          reporter_type: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["report_reason"]
          reporter_id?: string
          reporter_type?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: string
          target_type?: string
          updated_at?: string
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
          wallet_balance: number | null
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
          wallet_balance?: number | null
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
          wallet_balance?: number | null
        }
        Relationships: []
      }
      program_enrollments: {
        Row: {
          amount_paid: number
          enrollment_date: string
          id: string
          payment_method: string
          payment_status: string
          program_id: number
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          enrollment_date?: string
          id?: string
          payment_method: string
          payment_status: string
          program_id: number
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          enrollment_date?: string
          id?: string
          payment_method?: string
          payment_status?: string
          program_id?: number
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          enrollments: number | null
          id: number
          image: string
          price: number
          programType: Database["public"]["Enums"]["program_type"]
          sessions: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          duration: string
          enrollments?: number | null
          id?: number
          image: string
          price: number
          programType?: Database["public"]["Enums"]["program_type"]
          sessions: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          enrollments?: number | null
          id?: number
          image?: string
          price?: number
          programType?: Database["public"]["Enums"]["program_type"]
          sessions?: number
          title?: string
        }
        Relationships: []
      }
      referral_settings: {
        Row: {
          active: boolean
          description: string | null
          id: string
          referred_reward: number
          referrer_reward: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          description?: string | null
          id?: string
          referred_reward?: number
          referrer_reward?: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          description?: string | null
          id?: string
          referred_reward?: number
          referrer_reward?: number
          updated_at?: string | null
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
          service_id: number | null
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
          service_id?: number | null
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
          service_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_pricing_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_accounts"
            referencedColumns: ["id"]
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
          id: number
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
          id?: number
          name: string
          rate_eur?: number | null
          rate_inr: number
          rate_usd: number
        }
        Update: {
          category?: string | null
          description?: string | null
          duration?: number | null
          featured?: boolean | null
          id?: number
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
          created_at: string
          date: string
          id: string
          image_url: string
          location: string
          name: string
          rating: number
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          image_url: string
          location: string
          name: string
          rating: number
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          image_url?: string
          location?: string
          name?: string
          rating?: number
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_courses: {
        Row: {
          completed: boolean | null
          enrollment_date: string
          expert_id: number
          expert_name: string
          id: string
          progress: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          enrollment_date: string
          expert_id: number
          expert_name: string
          id?: string
          progress?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          enrollment_date?: string
          expert_id?: number
          expert_name?: string
          id?: string
          progress?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_expert_services: {
        Row: {
          amount: number
          created_at: string
          expert_id: string
          id: string
          service_id: number
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          expert_id: string
          id?: string
          service_id: number
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          expert_id?: string
          id?: string
          service_id?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_expert_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
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
            referencedRelation: "experts"
            referencedColumns: ["id"]
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
          ip_address: unknown | null
          user_id: string | null
        }
        Insert: {
          country_code?: string | null
          country_name?: string | null
          currency?: string | null
          detected_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
        }
        Update: {
          country_code?: string | null
          country_name?: string | null
          currency?: string | null
          detected_at?: string | null
          id?: string
          ip_address?: unknown | null
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
      user_reports: {
        Row: {
          date: string
          details: string | null
          expert_id: number
          id: string
          reason: string
          status: string
          user_id: string | null
        }
        Insert: {
          date: string
          details?: string | null
          expert_id: number
          id?: string
          reason: string
          status: string
          user_id?: string | null
        }
        Update: {
          date?: string
          details?: string | null
          expert_id?: number
          id?: string
          reason?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reviews: {
        Row: {
          comment: string | null
          date: string
          expert_id: number
          id: string
          rating: number
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          comment?: string | null
          date: string
          expert_id: number
          id?: string
          rating: number
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          comment?: string | null
          date?: string
          expert_id?: number
          id?: string
          rating?: number
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reward_transactions: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          points: number
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          points: number
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          points?: number
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_transactions: {
        Row: {
          amount: number
          currency: string
          date: string
          description: string | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          currency: string
          date: string
          description?: string | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          currency?: string
          date?: string
          description?: string | null
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_transactions_user_id_fkey"
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
          preferences: Json | null
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
          id: string
          marketing_consent?: boolean | null
          name?: string | null
          occupation?: string | null
          phone?: string | null
          preferences?: Json | null
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
          preferences?: Json | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      armor: {
        Args: { "": string }
        Returns: string
      }
      authenticate_admin: {
        Args: { p_username: string; p_password: string }
        Returns: Json
      }
      check_if_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      dearmor: {
        Args: { "": string }
        Returns: string
      }
      expire_old_call_requests: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      gen_random_bytes: {
        Args: { "": number }
        Returns: string
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gen_salt: {
        Args: { "": string }
        Returns: string
      }
      get_admin_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_reviews_with_experts: {
        Args: { user_id_param: string }
        Returns: {
          review_id: string
          expert_id: number
          rating: number
          comment: string
          date: string
          verified: boolean
          user_name: string
          expert_name: string
        }[]
      }
      handle_completed_referral: {
        Args: { p_referral_id: string }
        Returns: boolean
      }
      increment_program_enrollments: {
        Args: { program_id: number }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_any_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_superadmin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      mark_away_message_read: {
        Args: { message_id: string }
        Returns: undefined
      }
      pgp_armor_headers: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      pgp_key_id: {
        Args: { "": string }
        Returns: string
      }
      update_expert_away_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      moderation_action_type: "warning" | "suspension" | "ban" | "no_action"
      program_type:
        | "wellness"
        | "academic"
        | "business"
        | "productivity"
        | "leadership"
      report_reason:
        | "misleading_information"
        | "off_platform_redirection"
        | "inappropriate_behavior"
        | "bad_behavior"
        | "foul_language"
        | "other"
      report_status: "pending" | "under_review" | "resolved" | "dismissed"
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
    Enums: {
      moderation_action_type: ["warning", "suspension", "ban", "no_action"],
      program_type: [
        "wellness",
        "academic",
        "business",
        "productivity",
        "leadership",
      ],
      report_reason: [
        "misleading_information",
        "off_platform_redirection",
        "inappropriate_behavior",
        "bad_behavior",
        "foul_language",
        "other",
      ],
      report_status: ["pending", "under_review", "resolved", "dismissed"],
    },
  },
} as const
