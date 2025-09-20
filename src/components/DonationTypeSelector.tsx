import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { 
  CreditCard, 
  Package, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { donationTypeService } from '../lib/donationTypeService';
import { DonationTypePreferences, DonationType } from '../types/donations';

interface DonationTypeSelectorProps {
  targetType: 'organization' | 'campaign';
  targetId: string;
  targetName: string;
  selectedType?: DonationType;
  onTypeSelect: (type: DonationType) => void;
  className?: string;
}

const DonationTypeSelector: React.FC<DonationTypeSelectorProps> = ({
  targetType,
  targetId,
  targetName,
  selectedType,
  onTypeSelect,
  className = ''
}) => {
  const [donationTypes, setDonationTypes] = useState<DonationTypePreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationTypes = async () => {
      setLoading(true);
      setError(null);

      try {
        const types = await donationTypeService.getEffectiveDonationTypes(targetType, targetId);
        if (types) {
          setDonationTypes(types);
          
          // Auto-select the first available type if none selected
          if (!selectedType) {
            if (types.accepts_cash_donations) {
              onTypeSelect('cash');
            } else if (types.accepts_physical_donations) {
              onTypeSelect('physical');
            }
          }
        } else {
          setError('Unable to load donation types');
        }
      } catch (err) {
        setError('Failed to fetch donation types');
        console.error('Error fetching donation types:', err);
      } finally {
        setLoading(false);
      }
    };

    if (targetId) {
      fetchDonationTypes();
    }
  }, [targetType, targetId, selectedType, onTypeSelect]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-lg font-semibold">Choose Donation Type</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !donationTypes) {
    return (
      <Alert className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Unable to load donation options'}
        </AlertDescription>
      </Alert>
    );
  }

  const availableTypes = [];
  if (donationTypes.accepts_cash_donations) {
    availableTypes.push('cash');
  }
  if (donationTypes.accepts_physical_donations) {
    availableTypes.push('physical');
  }

  if (availableTypes.length === 0) {
    return (
      <Alert className={className}>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {targetName} is currently not accepting donations.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Donation Type</h3>
        <p className="text-sm text-muted-foreground">
          Select how you'd like to contribute to {targetName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cash Donation Option */}
        {donationTypes.accepts_cash_donations && (
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedType === 'cash' 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => onTypeSelect('cash')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${
                    selectedType === 'cash' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Cash Donation</CardTitle>
                </div>
                {selectedType === 'cash' && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              <CardDescription>
                Make an instant monetary contribution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Instant processing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>Tax-deductible receipt</span>
              </div>
              <Badge variant={selectedType === 'cash' ? 'default' : 'secondary'} className="w-fit">
                Recommended
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Physical Donation Option */}
        {donationTypes.accepts_physical_donations && (
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedType === 'physical' 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => onTypeSelect('physical')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${
                    selectedType === 'physical' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Package className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Physical Donation</CardTitle>
                </div>
                {selectedType === 'physical' && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              <CardDescription>
                Donate items and goods directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Pickup available</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Coordination required</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Item condition verified</span>
              </div>
              
              {/* Show accepted categories */}
              {donationTypes.physical_donation_categories && 
               donationTypes.physical_donation_categories.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    Accepted items:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {donationTypes.physical_donation_categories.slice(0, 3).map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category.replace('_', ' ')}
                      </Badge>
                    ))}
                    {donationTypes.physical_donation_categories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{donationTypes.physical_donation_categories.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Information */}
      {donationTypes.physical_donation_instructions && selectedType === 'physical' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Special Instructions:</strong> {donationTypes.physical_donation_instructions}
          </AlertDescription>
        </Alert>
      )}

      {/* Single type auto-selection message */}
      {availableTypes.length === 1 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {targetName} currently accepts {availableTypes[0]} donations only.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DonationTypeSelector;
