import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethodDB {
  id: string;
  user_id: string;
  provider_payment_method_id: string;
  provider: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  card_funding?: string;
  bank_name?: string;
  bank_account_last4?: string;
  bank_account_type?: string;
  nickname?: string;
  billing_address?: any;
  is_default: boolean;
  is_active: boolean;
  is_verified: boolean;
  verification_data?: any;
  created_at: string;
  updated_at: string;
  last_used_at?: string;
}

export interface PaymentMethodInsert {
  provider_payment_method_id: string;
  provider?: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  card_funding?: string;
  bank_name?: string;
  bank_account_last4?: string;
  bank_account_type?: string;
  nickname?: string;
  billing_address?: any;
  is_default?: boolean;
  is_active?: boolean;
  is_verified?: boolean;
  verification_data?: any;
}

export interface PaymentMethodUpdate {
  nickname?: string;
  billing_address?: any;
  is_default?: boolean;
  is_active?: boolean;
  is_verified?: boolean;
  verification_data?: any;
}

/**
 * Payment method service for managing user payment methods
 */
export const paymentMethodService = {
  /**
   * Get all payment methods for the current user
   */
  async getUserPaymentMethods(): Promise<{
    data: PaymentMethodDB[] | null;
    error: string | null;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as PaymentMethodDB[], error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  /**
   * Add a new payment method
   */
  async addPaymentMethod(paymentMethodData: PaymentMethodInsert): Promise<{
    data: PaymentMethodDB | null;
    error: string | null;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          ...paymentMethodData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as PaymentMethodDB, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  /**
   * Update a payment method
   */
  async updatePaymentMethod(id: string, updates: PaymentMethodUpdate): Promise<{
    data: PaymentMethodDB | null;
    error: string | null;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as PaymentMethodDB, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  /**
   * Set a payment method as default
   */
  async setDefaultPaymentMethod(id: string): Promise<{
    success: boolean;
    error: string | null;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  /**
   * Remove (deactivate) a payment method
   */
  async removePaymentMethod(id: string): Promise<{
    success: boolean;
    error: string | null;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: false, is_default: false })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  /**
   * Get the default payment method for the current user
   */
  async getDefaultPaymentMethod(): Promise<{
    data: PaymentMethodDB | null;
    error: string | null;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        return { data: null, error: error.message };
      }

      return { data: data as PaymentMethodDB || null, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
};
