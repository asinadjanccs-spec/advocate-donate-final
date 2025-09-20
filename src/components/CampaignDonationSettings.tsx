import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import {
  CreditCard,
  Package,
  Settings,
  ChevronDown,
  ChevronRight,
  Info,
  AlertCircle,
  CheckCircle,
  Settings2
} from 'lucide-react';
import { donationTypeService } from '../lib/donationTypeService';
import {
  CampaignDonationSettingsForm,
  CampaignDonationSettingsResponse,
  OrganizationDonationSettings
} from '../types/organizations';
import { DonationItemCategory, DONATION_ITEM_CATEGORIES } from '../types/donations';

interface CampaignDonationSettingsProps {
  campaignId?: string; // Optional for new campaigns
  organizationId: string;
  value: CampaignDonationSettingsForm;
  onChange: (settings: CampaignDonationSettingsForm) => void;
  className?: string;
  showInheritedSettings?: boolean;
}

const CampaignDonationSettings: React.FC<CampaignDonationSettingsProps> = ({
  campaignId,
  organizationId,
  value,
  onChange,
  className = '',
  showInheritedSettings = true
}) => {
  const [organizationSettings, setOrganizationSettings] = useState<OrganizationDonationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(value.donation_types_override);

  useEffect(() => {
    loadOrganizationSettings();
  }, [organizationId]);

  useEffect(() => {
    setShowAdvanced(value.donation_types_override);
  }, [value.donation_types_override]);

  const loadOrganizationSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await donationTypeService.getOrganizationDonationSettings(organizationId);
      
      if (response.success && response.settings) {
        setOrganizationSettings(response.settings);
      } else {
        setError(response.error || 'Failed to load organization settings');
      }
    } catch (err) {
      setError('Failed to load organization settings');
      console.error('Error loading organization settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (field: keyof CampaignDonationSettingsForm, newValue: any) => {
    const updatedSettings = {
      ...value,
      [field]: newValue
    };

    onChange(updatedSettings);
  };

  const handleCategoryToggle = (category: DonationItemCategory, checked: boolean) => {
    const updatedCategories = checked
      ? [...(value.physical_donation_categories || []), category]
      : (value.physical_donation_categories || []).filter(cat => cat !== category);
    
    handleSettingChange('physical_donation_categories', updatedCategories);
  };

  const getEffectiveSettings = () => {
    if (!organizationSettings) return null;

    if (value.donation_types_override) {
      return {
        accepts_cash_donations: value.accepts_cash_donations ?? true,
        accepts_physical_donations: value.accepts_physical_donations ?? false,
        physical_donation_categories: value.physical_donation_categories || [],
        physical_donation_instructions: value.physical_donation_instructions || ''
      };
    }

    return {
      accepts_cash_donations: organizationSettings.accepts_cash_donations,
      accepts_physical_donations: organizationSettings.accepts_physical_donations,
      physical_donation_categories: organizationSettings.physical_donation_categories || [],
      physical_donation_instructions: organizationSettings.physical_donation_instructions || ''
    };
  };

  const effectiveSettings = getEffectiveSettings();

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Donation Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Campaign Donation Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Override Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-muted">
                <Settings2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Donation Type Settings</h4>
                <p className="text-sm text-muted-foreground">
                  {value.donation_types_override 
                    ? 'Using custom settings for this campaign'
                    : 'Inheriting from organization settings'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={value.donation_types_override}
              onCheckedChange={(checked) => {
                handleSettingChange('donation_types_override', checked);
                if (!checked) {
                  // Reset override fields when disabling
                  handleSettingChange('accepts_cash_donations', undefined);
                  handleSettingChange('accepts_physical_donations', undefined);
                  handleSettingChange('physical_donation_categories', undefined);
                  handleSettingChange('physical_donation_instructions', '');
                }
              }}
            />
          </div>

          {!value.donation_types_override && showInheritedSettings && organizationSettings && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Inherited settings from organization:</strong></p>
                  <div className="flex flex-wrap gap-2">
                    {organizationSettings.accepts_cash_donations && (
                      <Badge variant="outline">Cash donations</Badge>
                    )}
                    {organizationSettings.accepts_physical_donations && (
                      <Badge variant="outline">Physical donations</Badge>
                    )}
                    {organizationSettings.physical_donation_categories?.map(category => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Custom Settings */}
        {value.donation_types_override && (
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <span className="font-medium">Campaign-Specific Settings</span>
                {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-6 pt-4">
              {/* Donation Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cash Donations */}
                <Card className={`cursor-pointer transition-colors ${
                  value.accepts_cash_donations ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        value.accepts_cash_donations ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Cash Donations</span>
                          <Switch
                            checked={value.accepts_cash_donations ?? true}
                            onCheckedChange={(checked) => 
                              handleSettingChange('accepts_cash_donations', checked)
                            }
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Accept monetary contributions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Physical Donations */}
                <Card className={`cursor-pointer transition-colors ${
                  value.accepts_physical_donations ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        value.accepts_physical_donations ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Physical Donations</span>
                          <Switch
                            checked={value.accepts_physical_donations ?? false}
                            onCheckedChange={(checked) => 
                              handleSettingChange('accepts_physical_donations', checked)
                            }
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Accept donated items and goods
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Validation Alert */}
              {(!value.accepts_cash_donations && !value.accepts_physical_donations) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    At least one donation type must be enabled.
                  </AlertDescription>
                </Alert>
              )}

              {/* Physical Donation Settings */}
              {value.accepts_physical_donations && (
                <div className="space-y-4 p-4 border-l-4 border-primary/20 bg-primary/5 rounded-r-lg">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Physical Donation Configuration</span>
                  </h4>

                  {/* Accepted Categories */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Accepted Item Categories</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {DONATION_ITEM_CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`campaign-${category}`}
                            checked={(value.physical_donation_categories || []).includes(category)}
                            onCheckedChange={(checked) => 
                              handleCategoryToggle(category, checked as boolean)
                            }
                          />
                          <Label htmlFor={`campaign-${category}`} className="text-sm">
                            {category.replace('_', ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {(!value.physical_donation_categories || value.physical_donation_categories.length === 0) && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Please select at least one category for physical donations.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Campaign-specific Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="campaign-instructions">Campaign-Specific Instructions</Label>
                    <Textarea
                      id="campaign-instructions"
                      value={value.physical_donation_instructions || ''}
                      onChange={(e) => 
                        handleSettingChange('physical_donation_instructions', e.target.value)
                      }
                      placeholder="Any additional instructions specific to this campaign..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      These instructions will be shown in addition to your organization's general instructions.
                    </p>
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Effective Settings Summary */}
        {effectiveSettings && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Active Donation Settings</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Cash donations:</span>
                <Badge variant={effectiveSettings.accepts_cash_donations ? "default" : "secondary"}>
                  {effectiveSettings.accepts_cash_donations ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Physical donations:</span>
                <Badge variant={effectiveSettings.accepts_physical_donations ? "default" : "secondary"}>
                  {effectiveSettings.accepts_physical_donations ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              {effectiveSettings.accepts_physical_donations && effectiveSettings.physical_donation_categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-muted-foreground text-xs">Categories:</span>
                  {effectiveSettings.physical_donation_categories.map(category => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignDonationSettings;
