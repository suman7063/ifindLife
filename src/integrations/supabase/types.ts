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
      call_pricing: {
        Row: {
          active: boolean | null
          created_at: string | null
          duration_minutes: number
          id: string
          price_inr: number
          price_usd: number
          tier: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          price_inr: number
          price_usd: number
          tier?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          price_inr?: number
          price_usd?: number
          tier?: string | null
        }
        Relationships: []
      }
      call_sessions: {
        Row: {
          analytics_data: Json | null
          call_type: string
          channel_name: string
          cost: number | null
          created_at: string | null
          currency: string | null
          duration: number | null
          end_time: string | null
          expert_id: number
          id: string
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
          analytics_data?: Json | null
          call_type: string
          channel_name: string
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          duration?: number | null
          end_time?: string | null
          expert_id: number
          id: string
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
          analytics_data?: Json | null
          call_type?: string
          channel_name?: string
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          duration?: number | null
          end_time?: string | null
          expert_id?: number
          id?: string
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
        Relationships: []
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
          status: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          auth_id?: string | null
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
          status?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          auth_id?: string | null
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
      services: {
        Row: {
          description: string | null
          id: number
          name: string
          rate_inr: number
          rate_usd: number
        }
        Insert: {
          description?: string | null
          id: number
          name: string
          rate_inr: number
          rate_usd: number
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
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
          email: string | null
          id: string
          name: string | null
          phone: string | null
          profile_picture: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
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
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
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
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_if_table_exists: {
        Args: { table_name: string }
        Returns: boolean
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
