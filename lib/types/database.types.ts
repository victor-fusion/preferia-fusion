export type UserRole = 'superadmin' | 'admin' | 'user'
export type PaymentStatus = 'sin_confirmar' | 'pago_enviado' | 'confirmado'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          user_id: string
          payment_status: PaymentStatus
          payment_confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          payment_status?: PaymentStatus
          payment_confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          payment_status?: PaymentStatus
          payment_confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
        }
      }
      drinks: {
        Row: {
          id: string
          name: string
          emoji: string
          active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          emoji: string
          active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          emoji?: string
          active?: boolean
          sort_order?: number
        }
      }
      user_drink_preferences: {
        Row: {
          id: string
          user_id: string
          drink_id: string
          percentage: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          drink_id: string
          percentage: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          drink_id?: string
          percentage?: number
          updated_at?: string
        }
      }
      playlist: {
        Row: {
          id: string
          user_id: string
          spotify_url: string
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          spotify_url: string
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          spotify_url?: string
          added_at?: string
        }
      }
      norms: {
        Row: {
          id: string
          icon: string
          text: string
          sort_order: number
          active: boolean
        }
        Insert: {
          id?: string
          icon: string
          text: string
          sort_order?: number
          active?: boolean
        }
        Update: {
          id?: string
          icon?: string
          text?: string
          sort_order?: number
          active?: boolean
        }
      }
      event_settings: {
        Row: {
          id: number
          bizum_number: string
          bizum_holder: string
          updated_at: string
        }
        Insert: {
          id?: number
          bizum_number?: string
          bizum_holder?: string
          updated_at?: string
        }
        Update: {
          id?: number
          bizum_number?: string
          bizum_holder?: string
          updated_at?: string
        }
      }
    }
    Views: {
      drink_totals: {
        Row: {
          id: string
          name: string
          emoji: string
          sort_order: number
          avg_percentage: number
          voter_count: number
        }
      }
    }
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      payment_status_enum: PaymentStatus
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Attendance = Database['public']['Tables']['attendance']['Row']
export type Drink = Database['public']['Tables']['drinks']['Row']
export type UserDrinkPreference = Database['public']['Tables']['user_drink_preferences']['Row']
export type PlaylistItem = Database['public']['Tables']['playlist']['Row']
export type Norm = Database['public']['Tables']['norms']['Row']
export type EventSettings = Database['public']['Tables']['event_settings']['Row']
export type DrinkTotal = Database['public']['Views']['drink_totals']['Row']
