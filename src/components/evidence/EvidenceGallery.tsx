import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ImpactEvidence } from '@/types/organizations';
import { evidenceService } from '@/services/evidenceService';
import { Loader2, Calendar } from "lucide-react";
import { format } from 'date-fns';

interface EvidenceGalleryProps {
    targetType: 'campaign' | 'organization';
    targetId: string;
    refreshTrigger?: number; // Prop to trigger refresh from parent
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({ targetType, targetId, refreshTrigger }) => {
    const [evidence, setEvidence] = useState<ImpactEvidence[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvidence = async () => {
            try {
                const data = await evidenceService.getEvidenceForTarget(targetType, targetId);
                setEvidence(data);
            } catch (error) {
                console.error('Error fetching evidence:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvidence();
    }, [targetType, targetId, refreshTrigger]);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (evidence.length === 0) {
        return (
            <div className="text-center p-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No impact evidence submitted yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evidence.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video relative bg-muted">
                        {item.media_urls[0] ? (
                            <img
                                src={item.media_urls[0]}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No Image
                            </div>
                        )}
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                            {item.description}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(item.submitted_at), 'MMM d, yyyy')}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
