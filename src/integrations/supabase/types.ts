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
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          target_id: string | null
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          accepts_anonymous_donations: boolean | null
          accepts_cash_donations: boolean | null
          accepts_physical_donations: boolean | null
          beneficiaries_count: number | null
          category: string
          completed_at: string | null
          created_at: string | null
          currency: string | null
          deadline_type: string | null
          description: string
          donation_types_override: boolean | null
          end_date: string | null
          featured_image_url: string | null
          fund_usage_description: string | null
          goal_amount: number
          id: string
          images: string[] | null
          impact_description: string | null
          is_featured: boolean | null
          is_urgent: boolean | null
          minimum_donation: number | null
          organization_id: string | null
          physical_donation_categories: string[] | null
          physical_donation_instructions: string | null
          published_at: string | null
          raised_amount: number | null
          shares_count: number | null
          short_description: string | null
          slug: string
          start_date: string | null
          status: string | null
          subcategory: string | null
          suggested_amounts: number[] | null
          supporters_count: number | null
          target_audience: string | null
          title: string
          updated_at: string | null
          updates: Json | null
          videos: string[] | null
          views_count: number | null
        }
        Insert: {
          accepts_anonymous_donations?: boolean | null
          accepts_cash_donations?: boolean | null
          accepts_physical_donations?: boolean | null
          beneficiaries_count?: number | null
          category: string
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          deadline_type?: string | null
          description: string
          donation_types_override?: boolean | null
          end_date?: string | null
          featured_image_url?: string | null
          fund_usage_description?: string | null
          goal_amount: number
          id?: string
          images?: string[] | null
          impact_description?: string | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          minimum_donation?: number | null
          organization_id?: string | null
          physical_donation_categories?: string[] | null
          physical_donation_instructions?: string | null
          published_at?: string | null
          raised_amount?: number | null
          shares_count?: number | null
          short_description?: string | null
          slug: string
          start_date?: string | null
          status?: string | null
          subcategory?: string | null
          suggested_amounts?: number[] | null
          supporters_count?: number | null
          target_audience?: string | null
          title: string
          updated_at?: string | null
          updates?: Json | null
          videos?: string[] | null
          views_count?: number | null
        }
        Update: {
          accepts_anonymous_donations?: boolean | null
          accepts_cash_donations?: boolean | null
          accepts_physical_donations?: boolean | null
          beneficiaries_count?: number | null
          category?: string
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          deadline_type?: string | null
          description?: string
          donation_types_override?: boolean | null
          end_date?: string | null
          featured_image_url?: string | null
          fund_usage_description?: string | null
          goal_amount?: number
          id?: string
          images?: string[] | null
          impact_description?: string | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          minimum_donation?: number | null
          organization_id?: string | null
          physical_donation_categories?: string[] | null
          physical_donation_instructions?: string | null
          published_at?: string | null
          raised_amount?: number | null
          shares_count?: number | null
          short_description?: string | null
          slug?: string
          start_date?: string | null
          status?: string | null
          subcategory?: string | null
          suggested_amounts?: number[] | null
          supporters_count?: number | null
          target_audience?: string | null
          title?: string
          updated_at?: string | null
          updates?: Json | null
          videos?: string[] | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_items: {
        Row: {
          category: string
          condition: string | null
          created_at: string | null
          decline_reason: string | null
          description: string | null
          estimated_value_per_unit: number | null
          expiry_date: string | null
          id: string
          is_fragile: boolean | null
          item_name: string
          item_status: string | null
          physical_donation_id: string
          quantity: number
          requires_refrigeration: boolean | null
          special_handling_notes: string | null
          subcategory: string | null
          total_estimated_value: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          condition?: string | null
          created_at?: string | null
          decline_reason?: string | null
          description?: string | null
          estimated_value_per_unit?: number | null
          expiry_date?: string | null
          id?: string
          is_fragile?: boolean | null
          item_name: string
          item_status?: string | null
          physical_donation_id: string
          quantity?: number
          requires_refrigeration?: boolean | null
          special_handling_notes?: string | null
          subcategory?: string | null
          total_estimated_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          condition?: string | null
          created_at?: string | null
          decline_reason?: string | null
          description?: string | null
          estimated_value_per_unit?: number | null
          expiry_date?: string | null
          id?: string
          is_fragile?: boolean | null
          item_name?: string
          item_status?: string | null
          physical_donation_id?: string
          quantity?: number
          requires_refrigeration?: boolean | null
          special_handling_notes?: string | null
          subcategory?: string | null
          total_estimated_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_items_physical_donation_id_fkey"
            columns: ["physical_donation_id"]
            isOneToOne: false
            referencedRelation: "physical_donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_receipts: {
        Row: {
          created_at: string | null
          donation_id: string
          id: string
          receipt_number: string
          receipt_url: string | null
          sent_at: string | null
          tax_deductible_amount: number
        }
        Insert: {
          created_at?: string | null
          donation_id: string
          id?: string
          receipt_number: string
          receipt_url?: string | null
          sent_at?: string | null
          tax_deductible_amount: number
        }
        Update: {
          created_at?: string | null
          donation_id?: string
          id?: string
          receipt_number?: string
          receipt_url?: string | null
          sent_at?: string | null
          tax_deductible_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "donation_receipts_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string | null
          currency: string
          donor_email: string
          donor_name: string
          donor_phone: string | null
          frequency: string | null
          id: string
          is_anonymous: boolean | null
          is_recurring: boolean | null
          message: string | null
          organization_id: string | null
          payment_intent_id: string
          payment_method_id: string | null
          payment_status: string
          processed_at: string | null
          target_id: string | null
          target_name: string
          target_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string
          donor_email: string
          donor_name: string
          donor_phone?: string | null
          frequency?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_recurring?: boolean | null
          message?: string | null
          organization_id?: string | null
          payment_intent_id: string
          payment_method_id?: string | null
          payment_status?: string
          processed_at?: string | null
          target_id?: string | null
          target_name: string
          target_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string
          donor_email?: string
          donor_name?: string
          donor_phone?: string | null
          frequency?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_recurring?: boolean | null
          message?: string | null
          organization_id?: string | null
          payment_intent_id?: string
          payment_method_id?: string | null
          payment_status?: string
          processed_at?: string | null
          target_id?: string | null
          target_name?: string
          target_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          accepts_cash_donations: boolean | null
          accepts_direct_donations: boolean | null
          accepts_physical_donations: boolean | null
          active_campaigns_count: number | null
          address: string | null
          banner_url: string | null
          beneficiaries_served: number | null
          category: string
          city: string | null
          country: string | null
          created_at: string | null
          description: string
          email: string
          founded_year: number | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          logo_url: string | null
          mission_statement: string | null
          name: string
          phone: string | null
          physical_donation_categories: string[] | null
          physical_donation_instructions: string | null
          pickup_address: string | null
          pickup_schedule: Json | null
          postal_code: string | null
          registration_number: string
          slug: string
          social_media: Json | null
          state: string | null
          subcategories: string[] | null
          tax_id: string | null
          total_raised: number | null
          updated_at: string | null
          user_id: string | null
          verification_documents: Json | null
          verification_status: string | null
          verified_at: string | null
          website: string | null
        }
        Insert: {
          accepts_cash_donations?: boolean | null
          accepts_direct_donations?: boolean | null
          accepts_physical_donations?: boolean | null
          active_campaigns_count?: number | null
          address?: string | null
          banner_url?: string | null
          beneficiaries_served?: number | null
          category: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          description: string
          email: string
          founded_year?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          mission_statement?: string | null
          name: string
          phone?: string | null
          physical_donation_categories?: string[] | null
          physical_donation_instructions?: string | null
          pickup_address?: string | null
          pickup_schedule?: Json | null
          postal_code?: string | null
          registration_number: string
          slug: string
          social_media?: Json | null
          state?: string | null
          subcategories?: string[] | null
          tax_id?: string | null
          total_raised?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          accepts_cash_donations?: boolean | null
          accepts_direct_donations?: boolean | null
          accepts_physical_donations?: boolean | null
          active_campaigns_count?: number | null
          address?: string | null
          banner_url?: string | null
          beneficiaries_served?: number | null
          category?: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string
          email?: string
          founded_year?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          mission_statement?: string | null
          name?: string
          phone?: string | null
          physical_donation_categories?: string[] | null
          physical_donation_instructions?: string | null
          pickup_address?: string | null
          pickup_schedule?: Json | null
          postal_code?: string | null
          registration_number?: string
          slug?: string
          social_media?: Json | null
          state?: string | null
          subcategories?: string[] | null
          tax_id?: string | null
          total_raised?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          bank_account_last4: string | null
          bank_account_type: string | null
          bank_name: string | null
          billing_address: Json | null
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_funding: string | null
          card_last4: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          is_verified: boolean | null
          last_used_at: string | null
          nickname: string | null
          provider: string
          provider_payment_method_id: string
          type: string
          updated_at: string | null
          user_id: string | null
          verification_data: Json | null
        }
        Insert: {
          bank_account_last4?: string | null
          bank_account_type?: string | null
          bank_name?: string | null
          billing_address?: Json | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_funding?: string | null
          card_last4?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_verified?: boolean | null
          last_used_at?: string | null
          nickname?: string | null
          provider?: string
          provider_payment_method_id: string
          type: string
          updated_at?: string | null
          user_id?: string | null
          verification_data?: Json | null
        }
        Update: {
          bank_account_last4?: string | null
          bank_account_type?: string | null
          bank_name?: string | null
          billing_address?: Json | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_funding?: string | null
          card_last4?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_verified?: boolean | null
          last_used_at?: string | null
          nickname?: string | null
          provider?: string
          provider_payment_method_id?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
          verification_data?: Json | null
        }
        Relationships: []
      }
      physical_donations: {
        Row: {
          campaign_id: string | null
          confirmed_at: string | null
          coordinator_notes: string | null
          created_at: string | null
          currency: string | null
          donation_status: string
          donor_email: string
          donor_name: string
          donor_phone: string | null
          estimated_value: number | null
          id: string
          is_anonymous: boolean | null
          message: string | null
          organization_id: string | null
          pickup_address: string | null
          pickup_instructions: string | null
          pickup_preference: string
          preferred_pickup_date: string | null
          preferred_time_slot: string | null
          received_at: string | null
          target_id: string | null
          target_name: string
          target_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          confirmed_at?: string | null
          coordinator_notes?: string | null
          created_at?: string | null
          currency?: string | null
          donation_status?: string
          donor_email: string
          donor_name: string
          donor_phone?: string | null
          estimated_value?: number | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          organization_id?: string | null
          pickup_address?: string | null
          pickup_instructions?: string | null
          pickup_preference?: string
          preferred_pickup_date?: string | null
          preferred_time_slot?: string | null
          received_at?: string | null
          target_id?: string | null
          target_name: string
          target_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          confirmed_at?: string | null
          coordinator_notes?: string | null
          created_at?: string | null
          currency?: string | null
          donation_status?: string
          donor_email?: string
          donor_name?: string
          donor_phone?: string | null
          estimated_value?: number | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          organization_id?: string | null
          pickup_address?: string | null
          pickup_instructions?: string | null
          pickup_preference?: string
          preferred_pickup_date?: string | null
          preferred_time_slot?: string | null
          received_at?: string | null
          target_id?: string | null
          target_name?: string
          target_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "physical_donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physical_donations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physical_donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          canceled_at: string | null
          created_at: string | null
          currency: string
          customer_email: string
          customer_name: string
          donation_id: string
          frequency: string
          id: string
          next_payment_date: string | null
          status: string
          subscription_id: string
          target_id: string | null
          target_name: string
          target_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          canceled_at?: string | null
          created_at?: string | null
          currency?: string
          customer_email: string
          customer_name: string
          donation_id: string
          frequency: string
          id?: string
          next_payment_date?: string | null
          status?: string
          subscription_id: string
          target_id?: string | null
          target_name: string
          target_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          canceled_at?: string | null
          created_at?: string | null
          currency?: string
          customer_email?: string
          customer_name?: string
          donation_id?: string
          frequency?: string
          id?: string
          next_payment_date?: string | null
          status?: string
          subscription_id?: string
          target_id?: string | null
          target_name?: string
          target_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_tiers: {
        Row: {
          badge_color: string
          badge_icon: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          minimum_amount: number
          tier_name: string
          tier_order: number
          updated_at: string | null
        }
        Insert: {
          badge_color: string
          badge_icon: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          minimum_amount: number
          tier_name: string
          tier_order: number
          updated_at?: string | null
        }
        Update: {
          badge_color?: string
          badge_icon?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          minimum_amount?: number
          tier_name?: string
          tier_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          created_at: string | null
          current_tier: string
          first_donation_date: string | null
          id: string
          last_tier_upgrade_date: string | null
          organizations_supported_count: number
          privacy_settings: Json | null
          tier_minimum_amount: number
          tier_upgrade_history: Json[] | null
          total_donation_amount: number
          total_donations_count: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_tier?: string
          first_donation_date?: string | null
          id?: string
          last_tier_upgrade_date?: string | null
          organizations_supported_count?: number
          privacy_settings?: Json | null
          tier_minimum_amount?: number
          tier_upgrade_history?: Json[] | null
          total_donation_amount?: number
          total_donations_count?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_tier?: string
          first_donation_date?: string | null
          id?: string
          last_tier_upgrade_date?: string | null
          organizations_supported_count?: number
          privacy_settings?: Json | null
          tier_minimum_amount?: number
          tier_upgrade_history?: Json[] | null
          total_donation_amount?: number
          total_donations_count?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email_notifications: boolean | null
          full_name: string
          id: string
          location: string | null
          organization_category: string | null
          organization_description: string | null
          organization_logo_url: string | null
          organization_name: string | null
          phone_number: string | null
          privacy_settings: Json | null
          profile_picture_url: string | null
          push_notifications: boolean | null
          registration_number: string | null
          role: string | null
          show_public_badge: boolean | null
          tax_id: string | null
          updated_at: string | null
          user_type: string
          verification_documents: Json | null
          verification_status: string | null
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email_notifications?: boolean | null
          full_name: string
          id: string
          location?: string | null
          organization_category?: string | null
          organization_description?: string | null
          organization_logo_url?: string | null
          organization_name?: string | null
          phone_number?: string | null
          privacy_settings?: Json | null
          profile_picture_url?: string | null
          push_notifications?: boolean | null
          registration_number?: string | null
          role?: string | null
          show_public_badge?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          user_type: string
          verification_documents?: Json | null
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email_notifications?: boolean | null
          full_name?: string
          id?: string
          location?: string | null
          organization_category?: string | null
          organization_description?: string | null
          organization_logo_url?: string | null
          organization_name?: string | null
          phone_number?: string | null
          privacy_settings?: Json | null
          profile_picture_url?: string | null
          push_notifications?: boolean | null
          registration_number?: string | null
          role?: string | null
          show_public_badge?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          user_type?: string
          verification_documents?: Json | null
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_achievements_with_tiers: {
        Row: {
          badge_color: string
          badge_icon: string
          created_at: string | null
          current_tier: string
          first_donation_date: string | null
          id: string
          last_tier_upgrade_date: string | null
          next_tier_badge_color: string | null
          next_tier_badge_icon: string | null
          next_tier_description: string | null
          next_tier_minimum_amount: number | null
          next_tier_name: string | null
          organizations_supported_count: number
          privacy_settings: Json | null
          progress_percentage: number
          tier_description: string | null
          tier_minimum_amount: number
          tier_order: number
          tier_upgrade_history: Json[] | null
          total_donation_amount: number
          total_donations_count: number
          updated_at: string | null
          user_id: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_user_tier: {
        Args: {
          donation_amount: number
        }
        Returns: string
      }
      generate_receipt_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_effective_donation_types: {
        Args: { target_id: string; target_type: string }
        Returns: Json
      }
      update_user_achievements_after_donation: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      validate_donation_types: {
        Args: { accepts_cash: boolean; accepts_physical: boolean }
        Returns: boolean
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
