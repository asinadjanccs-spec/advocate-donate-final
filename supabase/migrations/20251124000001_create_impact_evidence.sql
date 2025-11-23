-- Create impact_evidence table
CREATE TABLE impact_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('campaign', 'organization')),
    target_id VARCHAR(255) NOT NULL, -- campaign slug or organization slug/id
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    media_urls TEXT[] NOT NULL DEFAULT '{}',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE impact_evidence ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public can view approved evidence
CREATE POLICY "Public can view approved evidence" ON impact_evidence
    FOR SELECT USING (status = 'approved' OR status = 'submitted'); -- Allow submitted for now as per plan "default to submitted"

-- Organization admins can create evidence for their org or campaigns
-- Note: This is a simplified policy. Ideally we check if the user is an admin of the target.
-- For now, we'll allow authenticated users to create, and we'll enforce permissions in the application layer or via a more complex policy if needed.
-- Given the complexity of checking org admin status via SQL in this specific schema (which might require joins), 
-- and the fact that we have `created_by`, we can start with:
CREATE POLICY "Users can create evidence" ON impact_evidence
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can update their own evidence
CREATE POLICY "Users can update their own evidence" ON impact_evidence
    FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete their own evidence
CREATE POLICY "Users can delete their own evidence" ON impact_evidence
    FOR DELETE USING (auth.uid() = created_by);

-- Service role can do everything
CREATE POLICY "Service role can manage all evidence" ON impact_evidence
    FOR ALL USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX idx_impact_evidence_target ON impact_evidence(target_type, target_id);
CREATE INDEX idx_impact_evidence_created_by ON impact_evidence(created_by);

-- Trigger for updated_at
CREATE TRIGGER update_impact_evidence_updated_at BEFORE UPDATE ON impact_evidence
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
