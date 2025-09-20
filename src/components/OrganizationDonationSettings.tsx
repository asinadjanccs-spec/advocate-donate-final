import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import {
  CreditCard,
  Package,
  Settings,
  MapPin,
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { donationTypeService } from '../lib/donationTypeService';
import {
  OrganizationDonationSettingsForm,
  OrganizationDonationSettingsResponse
} from '../types/organizations';
import { DonationItemCategory, DONATION_ITEM_CATEGORIES } from '../types/donations';

interface OrganizationDonationSettingsProps {
  organizationId: string;
  className?: string;
}

const OrganizationDonationSettings: React.FC<OrganizationDonationSettingsProps> = ({
  organizationId,
  className = ''
}) => {
  const [settings, setSettings] = useState<OrganizationDonationSettingsForm>(
    donationTypeService.getDefaultOrganizationSettings()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await donationTypeService.getOrganizationDonationSettings(organizationId);
      
      if (response.success && response.settings) {
        setSettings({
          accepts_cash_donations: response.settings.accepts_cash_donations,
          accepts_physical_donations: response.settings.accepts_physical_donations,
          physical_donation_categories: response.settings.physical_donation_categories || [],
          physical_donation_instructions: response.settings.physical_donation_instructions || '',
          pickup_address: response.settings.pickup_address || '',
          pickup_schedule: response.settings.pickup_schedule || {},
          special_notes: ''
        });
      } else {
        setError(response.error || 'Failed to load settings');
      }
    } catch (err) {
      setError('Failed to load donation settings');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await donationTypeService.updateOrganizationDonationSettings(
        organizationId,
        settings
      );

      if (response.success) {
        setSuccess(true);
        setHasUnsavedChanges(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (field: keyof OrganizationDonationSettingsForm, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
    setError(null);
    setSuccess(false);
  };

  const handleCategoryToggle = (category: DonationItemCategory, checked: boolean) => {
    const updatedCategories = checked
      ? [...settings.physical_donation_categories, category]
      : settings.physical_donation_categories.filter(cat => cat !== category);
    
    handleSettingChange('physical_donation_categories', updatedCategories);
  };

  const handleScheduleChange = (day: string, field: string, value: any) => {
    const updatedSchedule = {
      ...settings.pickup_schedule,
      [day]: {
        ...settings.pickup_schedule[day],
        [field]: value
      }
    };
    handleSettingChange('pickup_schedule', updatedSchedule);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Donation Settings</span>
          </CardTitle>
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Donation Settings</span>
          </div>
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-xs">
              Unsaved changes
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success/Error Alerts */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Donation settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Donation Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Accepted Donation Types</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cash Donations */}
            <Card className={`cursor-pointer transition-colors ${
              settings.accepts_cash_donations ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    settings.accepts_cash_donations ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Cash Donations</span>
                      <Switch
                        checked={settings.accepts_cash_donations}
                        onCheckedChange={(checked) => 
                          handleSettingChange('accepts_cash_donations', checked)
                        }
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Accept monetary contributions online
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Physical Donations */}
            <Card className={`cursor-pointer transition-colors ${
              settings.accepts_physical_donations ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    settings.accepts_physical_donations ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Physical Donations</span>
                      <Switch
                        checked={settings.accepts_physical_donations}
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
          {!settings.accepts_cash_donations && !settings.accepts_physical_donations && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                At least one donation type must be enabled.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Physical Donation Settings */}
        {settings.accepts_physical_donations && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Physical Donation Settings</h3>

              {/* Accepted Categories */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Accepted Item Categories</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DONATION_ITEM_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={settings.physical_donation_categories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoryToggle(category, checked as boolean)
                        }
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
                {settings.physical_donation_categories.length === 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Please select at least one category for physical donations.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <Label htmlFor="instructions">Donation Instructions</Label>
                <Textarea
                  id="instructions"
                  value={settings.physical_donation_instructions}
                  onChange={(e) => 
                    handleSettingChange('physical_donation_instructions', e.target.value)
                  }
                  placeholder="Special instructions for donors (e.g., item condition requirements, preparation guidelines)..."
                  rows={3}
                />
              </div>

              {/* Pickup Address */}
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup/Drop-off Address</Label>
                <Textarea
                  id="pickupAddress"
                  value={settings.pickup_address}
                  onChange={(e) => 
                    handleSettingChange('pickup_address', e.target.value)
                  }
                  placeholder="Enter the address where items can be picked up or dropped off..."
                  rows={3}
                />
              </div>

              {/* Pickup Schedule */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Pickup Schedule</Label>
                <div className="space-y-3">
                  {daysOfWeek.map(({ key, label }) => {
                    const daySchedule = settings.pickup_schedule[key] || {
                      available: false,
                      start: '09:00',
                      end: '17:00'
                    };

                    return (
                      <div key={key} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-20">
                          <Checkbox
                            id={`${key}-available`}
                            checked={daySchedule.available}
                            onCheckedChange={(checked) => 
                              handleScheduleChange(key, 'available', checked)
                            }
                          />
                          <Label htmlFor={`${key}-available`} className="ml-2 text-sm">
                            {label}
                          </Label>
                        </div>
                        
                        {daySchedule.available && (
                          <div className="flex items-center space-x-2 flex-1">
                            <Input
                              type="time"
                              value={daySchedule.start}
                              onChange={(e) => 
                                handleScheduleChange(key, 'start', e.target.value)
                              }
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={daySchedule.end}
                              onChange={(e) => 
                                handleScheduleChange(key, 'end', e.target.value)
                              }
                              className="w-24"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving || (!settings.accepts_cash_donations && !settings.accepts_physical_donations)}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationDonationSettings;
