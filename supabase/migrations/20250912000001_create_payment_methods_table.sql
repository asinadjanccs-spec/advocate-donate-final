-- Create payment methods table for Bridge-Needs platform
-- This migration creates a table to store user payment methods securely

-- Create payment_methods table
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Payment provider details
    provider_payment_method_id VARCHAR(255) NOT NULL, -- Stripe payment method ID or similar
    provider VARCHAR(50) NOT NULL DEFAULT 'stripe',
    
    -- Payment method type and details
    type VARCHAR(20) NOT NULL CHECK (type IN ('card', 'bank_account', 'digital_wallet')),
    
    -- Card details (for display purposes only - never store full card numbers)
    card_brand VARCHAR(50), -- visa, mastercard, amex, etc.
    card_last4 VARCHAR(4),
    card_exp_month INTEGER CHECK (card_exp_month >= 1 AND card_exp_month <= 12),
    card_exp_year INTEGER CHECK (card_exp_year >= 2024),
    card_funding VARCHAR(20), -- credit, debit, prepaid, unknown
    
    -- Bank account details (for display purposes only)
    bank_name VARCHAR(255),
    bank_account_last4 VARCHAR(4),
    bank_account_type VARCHAR(20), -- checking, savings
    
    -- User-defined details
    nickname VARCHAR(100), -- User-friendly name like "Personal Card"
    billing_address JSONB, -- Billing address for the payment method
    
    -- Status and preferences
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Security and compliance
    is_verified BOOLEAN DEFAULT FALSE,
    verification_data JSONB, -- Store verification metadata if needed
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_provider_id ON payment_methods(provider_payment_method_id);
CREATE INDEX idx_payment_methods_is_default ON payment_methods(user_id, is_default) WHERE is_default = TRUE;
CREATE INDEX idx_payment_methods_is_active ON payment_methods(is_active);

-- Update trigger for updated_at
CREATE TRIGGER update_payment_methods_updated_at 
    BEFORE UPDATE ON payment_methods 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Users can only see their own payment methods
CREATE POLICY "Users can view their own payment methods" ON payment_methods
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own payment methods
CREATE POLICY "Users can insert their own payment methods" ON payment_methods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own payment methods
CREATE POLICY "Users can update their own payment methods" ON payment_methods
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own payment methods
CREATE POLICY "Users can delete their own payment methods" ON payment_methods
    FOR DELETE USING (auth.uid() = user_id);

-- Function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
    -- If this payment method is being set as default
    IF NEW.is_default = TRUE THEN
        -- Remove default flag from all other payment methods for this user
        UPDATE payment_methods 
        SET is_default = FALSE 
        WHERE user_id = NEW.user_id 
          AND id != NEW.id 
          AND is_default = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure only one default payment method per user
CREATE TRIGGER ensure_single_default_payment_method_trigger
    BEFORE INSERT OR UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_payment_method();

-- Function to update last_used_at when payment method is used
CREATE OR REPLACE FUNCTION update_payment_method_last_used()
RETURNS TRIGGER AS $$
BEGIN
    -- Update last_used_at for the payment method used in this donation
    IF NEW.payment_method_id IS NOT NULL THEN
        UPDATE payment_methods 
        SET last_used_at = NOW()
        WHERE provider_payment_method_id = NEW.payment_method_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update payment method last_used_at on successful donations
CREATE TRIGGER update_payment_method_last_used_trigger
    AFTER INSERT OR UPDATE ON donations
    FOR EACH ROW
    WHEN (NEW.payment_status = 'succeeded')
    EXECUTE FUNCTION update_payment_method_last_used();

-- Add helpful comments
COMMENT ON TABLE payment_methods IS 'Stores user payment methods for secure and convenient donations';
COMMENT ON COLUMN payment_methods.provider_payment_method_id IS 'External payment provider ID (e.g., Stripe payment method ID)';
COMMENT ON COLUMN payment_methods.card_last4 IS 'Last 4 digits of card for display purposes only';
COMMENT ON COLUMN payment_methods.billing_address IS 'JSONB field storing billing address: {line1, line2, city, state, postal_code, country}';
COMMENT ON COLUMN payment_methods.verification_data IS 'JSONB field for storing verification metadata and compliance data';
