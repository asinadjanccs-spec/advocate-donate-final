-- Create donation types extension for Advocate&Donate platform
-- This migration adds support for physical donations alongside cash donations

-- Create physical_donations table
CREATE TABLE physical_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(20),
    message TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Donation target (campaign, organization, or general)
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('campaign', 'organization', 'general')),
    target_id VARCHAR(255), -- Can be campaign ID, organization slug, or null for general
    target_name VARCHAR(255) NOT NULL, -- Display name of the target
    
    -- Foreign key references
    user_id UUID REFERENCES user_profiles(id),
    organization_id UUID REFERENCES organizations(id),
    campaign_id UUID REFERENCES campaigns(id),
    
    -- Pickup/delivery preferences
    pickup_preference VARCHAR(20) NOT NULL DEFAULT 'pickup' CHECK (pickup_preference IN ('pickup', 'delivery', 'flexible')),
    pickup_address TEXT,
    pickup_instructions TEXT,
    preferred_pickup_date TIMESTAMP WITH TIME ZONE,
    preferred_time_slot VARCHAR(50), -- e.g., "morning", "afternoon", "evening", "flexible"
    
    -- Status tracking
    donation_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
        donation_status IN ('pending', 'confirmed', 'in_transit', 'received', 'cancelled', 'declined')
    ),
    coordinator_notes TEXT,
    
    -- Total estimated value (optional, for tax purposes)
    estimated_value DECIMAL(10,2) CHECK (estimated_value >= 0),
    currency VARCHAR(3) DEFAULT 'PHP',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    received_at TIMESTAMP WITH TIME ZONE
);

-- Create donation_items table for individual items in physical donations
CREATE TABLE donation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_donation_id UUID NOT NULL REFERENCES physical_donations(id) ON DELETE CASCADE,
    
    -- Item details
    category VARCHAR(100) NOT NULL, -- e.g., "clothing", "food", "books", "electronics", "medical_supplies"
    subcategory VARCHAR(100), -- e.g., "shirts", "canned_goods", "textbooks"
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Quantity and condition
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit VARCHAR(50) DEFAULT 'pieces', -- e.g., "pieces", "kg", "boxes", "liters"
    condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor')),
    
    -- Value estimation
    estimated_value_per_unit DECIMAL(10,2) CHECK (estimated_value_per_unit >= 0),
    total_estimated_value DECIMAL(10,2) GENERATED ALWAYS AS (quantity * COALESCE(estimated_value_per_unit, 0)) STORED,
    
    -- Special handling
    special_handling_notes TEXT,
    expiry_date DATE, -- for perishable items
    is_fragile BOOLEAN DEFAULT FALSE,
    requires_refrigeration BOOLEAN DEFAULT FALSE,
    
    -- Item status
    item_status VARCHAR(20) DEFAULT 'pending' CHECK (
        item_status IN ('pending', 'accepted', 'declined', 'received')
    ),
    decline_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add donation type preferences to organizations table
ALTER TABLE organizations 
    ADD COLUMN accepts_cash_donations BOOLEAN DEFAULT TRUE,
    ADD COLUMN accepts_physical_donations BOOLEAN DEFAULT FALSE,
    ADD COLUMN physical_donation_categories TEXT[] DEFAULT '{}', -- Array of accepted categories
    ADD COLUMN physical_donation_instructions TEXT,
    ADD COLUMN pickup_address TEXT,
    ADD COLUMN pickup_schedule JSONB DEFAULT '{}'; -- Operating hours and availability

-- Add donation type preferences to campaigns table  
ALTER TABLE campaigns
    ADD COLUMN donation_types_override BOOLEAN DEFAULT FALSE, -- Whether to override org settings
    ADD COLUMN accepts_cash_donations BOOLEAN, -- NULL means inherit from organization
    ADD COLUMN accepts_physical_donations BOOLEAN, -- NULL means inherit from organization
    ADD COLUMN physical_donation_categories TEXT[], -- NULL means inherit from organization
    ADD COLUMN physical_donation_instructions TEXT; -- Campaign-specific instructions

-- Create indexes for better performance
CREATE INDEX idx_physical_donations_donor_email ON physical_donations(donor_email);
CREATE INDEX idx_physical_donations_target ON physical_donations(target_type, target_id);
CREATE INDEX idx_physical_donations_created_at ON physical_donations(created_at);
CREATE INDEX idx_physical_donations_status ON physical_donations(donation_status);
CREATE INDEX idx_physical_donations_user_id ON physical_donations(user_id);
CREATE INDEX idx_physical_donations_organization_id ON physical_donations(organization_id);
CREATE INDEX idx_physical_donations_campaign_id ON physical_donations(campaign_id);

CREATE INDEX idx_donation_items_physical_donation_id ON donation_items(physical_donation_id);
CREATE INDEX idx_donation_items_category ON donation_items(category);
CREATE INDEX idx_donation_items_status ON donation_items(item_status);
CREATE INDEX idx_donation_items_expiry_date ON donation_items(expiry_date) WHERE expiry_date IS NOT NULL;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_physical_donations_updated_at 
    BEFORE UPDATE ON physical_donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_items_updated_at 
    BEFORE UPDATE ON donation_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE physical_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_items ENABLE ROW LEVEL SECURITY;

-- Physical donations policies - donors can view their own donations
CREATE POLICY "Donors can view their own physical donations" ON physical_donations
    FOR SELECT USING (donor_email = auth.jwt() ->> 'email' OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create physical donations" ON physical_donations
    FOR INSERT WITH CHECK (
        donor_email = auth.jwt() ->> 'email' OR 
        auth.uid() = user_id OR
        auth.uid() IS NOT NULL
    );

-- Organizations can view and manage donations made to them
CREATE POLICY "Organizations can view their received physical donations" ON physical_donations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM organizations o
            WHERE o.id = physical_donations.organization_id 
            AND o.user_id = auth.uid()
        )
    );

CREATE POLICY "Organizations can update their received physical donations" ON physical_donations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organizations o
            WHERE o.id = physical_donations.organization_id 
            AND o.user_id = auth.uid()
        )
    );

-- Donation items policies - accessible by donation owners and receiving organizations
CREATE POLICY "Donation items viewable by donation owners and organizations" ON donation_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM physical_donations pd
            WHERE pd.id = donation_items.physical_donation_id 
            AND (
                pd.donor_email = auth.jwt() ->> 'email' OR
                pd.user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM organizations o
                    WHERE o.id = pd.organization_id AND o.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Donation items manageable by donation owners" ON donation_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM physical_donations pd
            WHERE pd.id = donation_items.physical_donation_id 
            AND (pd.donor_email = auth.jwt() ->> 'email' OR pd.user_id = auth.uid())
        )
    );

CREATE POLICY "Organizations can update donation items for their donations" ON donation_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM physical_donations pd
            JOIN organizations o ON o.id = pd.organization_id
            WHERE pd.id = donation_items.physical_donation_id 
            AND o.user_id = auth.uid()
        )
    );

-- Service role can manage all donation types
CREATE POLICY "Service role can manage all physical donations" ON physical_donations
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all donation items" ON donation_items
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to get effective donation types for an organization or campaign
CREATE OR REPLACE FUNCTION get_effective_donation_types(
    target_type TEXT,
    target_id TEXT
) RETURNS JSONB AS $$
DECLARE
    result JSONB;
    org_record organizations%ROWTYPE;
    campaign_record campaigns%ROWTYPE;
BEGIN
    IF target_type = 'organization' THEN
        SELECT * INTO org_record FROM organizations WHERE slug = target_id OR id::text = target_id;
        
        result := jsonb_build_object(
            'accepts_cash_donations', COALESCE(org_record.accepts_cash_donations, true),
            'accepts_physical_donations', COALESCE(org_record.accepts_physical_donations, false),
            'physical_donation_categories', COALESCE(org_record.physical_donation_categories, '{}'),
            'physical_donation_instructions', org_record.physical_donation_instructions,
            'pickup_address', org_record.pickup_address,
            'pickup_schedule', COALESCE(org_record.pickup_schedule, '{}')
        );
        
    ELSIF target_type = 'campaign' THEN
        -- First get the campaign record
        SELECT * INTO campaign_record FROM campaigns WHERE slug = target_id OR id::text = target_id;
        
        -- Then get the organization record
        SELECT * INTO org_record FROM organizations WHERE id = campaign_record.organization_id;
        
        -- If campaign overrides donation types, use campaign settings; otherwise inherit from org
        IF campaign_record.donation_types_override = true THEN
            result := jsonb_build_object(
                'accepts_cash_donations', COALESCE(campaign_record.accepts_cash_donations, true),
                'accepts_physical_donations', COALESCE(campaign_record.accepts_physical_donations, false),
                'physical_donation_categories', COALESCE(campaign_record.physical_donation_categories, '{}'),
                'physical_donation_instructions', campaign_record.physical_donation_instructions,
                'pickup_address', org_record.pickup_address,
                'pickup_schedule', COALESCE(org_record.pickup_schedule, '{}')
            );
        ELSE
            result := jsonb_build_object(
                'accepts_cash_donations', COALESCE(org_record.accepts_cash_donations, true),
                'accepts_physical_donations', COALESCE(org_record.accepts_physical_donations, false),
                'physical_donation_categories', COALESCE(org_record.physical_donation_categories, '{}'),
                'physical_donation_instructions', org_record.physical_donation_instructions,
                'pickup_address', org_record.pickup_address,
                'pickup_schedule', COALESCE(org_record.pickup_schedule, '{}')
            );
        END IF;
        
    ELSE
        -- For general donations, default to cash only
        result := jsonb_build_object(
            'accepts_cash_donations', true,
            'accepts_physical_donations', false,
            'physical_donation_categories', '{}',
            'physical_donation_instructions', null,
            'pickup_address', null,
            'pickup_schedule', '{}'
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate donation type configuration
CREATE OR REPLACE FUNCTION validate_donation_types(
    accepts_cash BOOLEAN,
    accepts_physical BOOLEAN
) RETURNS BOOLEAN AS $$
BEGIN
    -- At least one donation type must be enabled
    RETURN (accepts_cash = true OR accepts_physical = true);
END;
$$ LANGUAGE plpgsql;

-- Add check constraints to ensure at least one donation type is enabled
ALTER TABLE organizations 
    ADD CONSTRAINT organizations_donation_types_check 
    CHECK (validate_donation_types(accepts_cash_donations, accepts_physical_donations));

-- For campaigns, we only validate if override is enabled
ALTER TABLE campaigns
    ADD CONSTRAINT campaigns_donation_types_check 
    CHECK (
        donation_types_override = false OR 
        validate_donation_types(
            COALESCE(accepts_cash_donations, true), 
            COALESCE(accepts_physical_donations, false)
        )
    );

-- Sample data for testing (optional - can be removed in production)
-- Enable physical donations for sample organizations
UPDATE organizations 
SET accepts_physical_donations = true,
    physical_donation_categories = ARRAY['clothing', 'food', 'books', 'toys'],
    physical_donation_instructions = 'Please ensure all items are clean and in good condition. Contact us to schedule pickup.',
    pickup_address = 'Same as organization address'
WHERE slug IN ('hope-community-center');

-- Insert sample physical donation
INSERT INTO physical_donations (
    donor_name, donor_email, donor_phone, message, target_type, target_id, target_name,
    pickup_preference, pickup_address, estimated_value, donation_status
) VALUES (
    'Maria Santos', 'maria.santos@example.com', '+63917123456',
    'Donating clothes for typhoon victims', 'organization', 'hope-community-center',
    'Hope Community Center', 'pickup', '123 Donor Street, Manila', 500.00, 'pending'
);

-- Insert sample donation items
INSERT INTO donation_items (
    physical_donation_id, category, subcategory, item_name, description,
    quantity, unit, condition, estimated_value_per_unit, special_handling_notes
) VALUES 
(
    (SELECT id FROM physical_donations WHERE donor_email = 'maria.santos@example.com' LIMIT 1),
    'clothing', 'shirts', 'Adult T-Shirts', 'Various sizes, clean and gently used',
    10, 'pieces', 'good', 25.00, 'Mixed sizes S-XL'
),
(
    (SELECT id FROM physical_donations WHERE donor_email = 'maria.santos@example.com' LIMIT 1),
    'clothing', 'pants', 'Children Jeans', 'Kids jeans in various sizes',
    5, 'pieces', 'excellent', 50.00, 'Sizes 4-12 years'
);
