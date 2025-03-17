
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
      experts: {
        Row: {
          id: number
          name: string
          email: string
          phone: string
          password: string
          address: string
          city: string
          state: string
          country: string
          specialization: string
          experience: string
          bio: string
          certificate_urls: string[] | null
          profile_picture: string | null
          selected_services: number[]
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone: string
          password: string
          address: string
          city: string
          state: string
          country: string
          specialization: string
          experience: string
          bio: string
          certificate_urls?: string[] | null
          profile_picture?: string | null
          selected_services: number[]
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string
          password?: string
          address?: string
          city?: string
          state?: string
          country?: string
          specialization?: string
          experience?: string
          bio?: string
          certificate_urls?: string[] | null
          profile_picture?: string | null
          selected_services?: number[]
          created_at?: string
          updated_at?: string | null
        }
      }
      expert_reports: {
        Row: {
          id: string
          expert_id: number
          user_id: string
          user_name: string
          reason: string
          details: string
          date: string
          status: string
        }
        Insert: {
          id?: string
          expert_id: number
          user_id: string
          user_name: string
          reason: string
          details: string
          date?: string
          status?: string
        }
        Update: {
          id?: string
          expert_id?: number
          user_id?: string
          user_name?: string
          reason?: string
          details?: string
          date?: string
          status?: string
        }
      }
      services: {
        Row: {
          id: number
          name: string
          description: string
          rate_usd: number
          rate_inr: number
        }
        Insert: {
          id?: number
          name: string
          description: string
          rate_usd: number
          rate_inr: number
        }
        Update: {
          id?: number
          name?: string
          description?: string
          rate_usd?: number
          rate_inr?: number
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          password: string
          country: string
          city: string | null
          currency: string
          profile_picture: string | null
          wallet_balance: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          password: string
          country: string
          city?: string | null
          currency: string
          profile_picture?: string | null
          wallet_balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          password?: string
          country?: string
          city?: string | null
          currency?: string
          profile_picture?: string | null
          wallet_balance?: number
          created_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          expert_id: number
        }
        Insert: {
          id?: string
          user_id: string
          expert_id: number
        }
        Update: {
          id?: string
          user_id?: string
          expert_id?: number
        }
      }
      user_transactions: {
        Row: {
          id: string
          user_id: string
          date: string
          type: string
          amount: number
          currency: string
          description: string
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          type: string
          amount: number
          currency: string
          description: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          type?: string
          amount?: number
          currency?: string
          description?: string
        }
      }
      user_reviews: {
        Row: {
          id: string
          user_id: string
          expert_id: number
          rating: number
          comment: string
          date: string
        }
        Insert: {
          id?: string
          user_id: string
          expert_id: number
          rating: number
          comment: string
          date?: string
        }
        Update: {
          id?: string
          user_id?: string
          expert_id?: number
          rating?: number
          comment?: string
          date?: string
        }
      }
      user_reports: {
        Row: {
          id: string
          user_id: string
          expert_id: number
          reason: string
          details: string
          date: string
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          expert_id: number
          reason: string
          details: string
          date?: string
          status?: string
        }
        Update: {
          id?: string
          user_id?: string
          expert_id?: number
          reason?: string
          details?: string
          date?: string
          status?: string
        }
      }
      user_courses: {
        Row: {
          id: string
          user_id: string
          title: string
          expert_id: number
          expert_name: string
          enrollment_date: string
          progress: number
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          expert_id: number
          expert_name: string
          enrollment_date?: string
          progress?: number
          completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          expert_id?: number
          expert_name?: string
          enrollment_date?: string
          progress?: number
          completed?: boolean
        }
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
