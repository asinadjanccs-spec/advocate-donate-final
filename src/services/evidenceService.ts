import { supabase } from '@/integrations/supabase/client';
import { ImpactEvidence } from '@/types/organizations';

export const evidenceService = {
    /**
     * Submit new impact evidence
     */
    async submitEvidence(evidence: Omit<ImpactEvidence, 'id' | 'submitted_at' | 'created_at' | 'updated_at' | 'status'>) {
        // Cast to any to bypass type check for new table
        const { data, error } = await (supabase
            .from('impact_evidence' as any)
            .insert({
                target_type: evidence.target_type,
                target_id: evidence.target_id,
                title: evidence.title,
                description: evidence.description,
                media_urls: evidence.media_urls,
                created_by: evidence.created_by,
                status: 'submitted'
            })
            .select()
            .single());

        if (error) throw error;
        return data;
    },

    /**
     * Get evidence for a specific target (campaign or organization)
     */
    async getEvidenceForTarget(targetType: 'campaign' | 'organization', targetId: string) {
        // Cast to any to bypass type check for new table
        const { data, error } = await (supabase
            .from('impact_evidence' as any)
            .select('*')
            .eq('target_type', targetType)
            .eq('target_id', targetId)
            .order('submitted_at', { ascending: false }));

        if (error) throw error;
        return data as unknown as ImpactEvidence[];
    }
};
