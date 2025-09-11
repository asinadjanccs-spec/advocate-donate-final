import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  AlertCircle,
  ArrowLeft, 
  Loader2,
  Save 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { userService, UserProfile } from '@/lib/userService';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  // Email notifications
  emailDonationReceipts: boolean;
  emailCampaignUpdates: boolean;
  emailWeeklyDigest: boolean;
  emailMarketingUpdates: boolean;
  emailSecurityAlerts: boolean;
  
  // Push notifications
  pushDonationConfirmation: boolean;
  pushCampaignMilestones: boolean;
  pushNewCampaigns: boolean;
  pushUrgentAlerts: boolean;
  
  // In-app notifications
  inAppMessages: boolean;
  inAppUpdates: boolean;
  inAppReminders: boolean;
}

const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    // Email notifications
    emailDonationReceipts: true,
    emailCampaignUpdates: true,
    emailWeeklyDigest: false,
    emailMarketingUpdates: false,
    emailSecurityAlerts: true,
    
    // Push notifications
    pushDonationConfirmation: true,
    pushCampaignMilestones: false,
    pushNewCampaigns: false,
    pushUrgentAlerts: true,
    
    // In-app notifications
    inAppMessages: true,
    inAppUpdates: true,
    inAppReminders: false,
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: profile, error } = await userService.getCurrentUserProfile();
        
        if (error || !profile) {
          toast({
            title: "Error",
            description: error || "Failed to load profile",
            variant: "destructive"
          });
          return;
        }

        setUserProfile(profile);
        
        // Parse notification settings from database
        const privacySettings = profile.privacy_settings as any || {};
        const notificationPrefs = privacySettings.notifications || {};
        
        setSettings(prev => ({
          ...prev,
          ...notificationPrefs,
          // Override with database values for basic notifications
          emailDonationReceipts: profile.email_notifications ?? true,
          pushDonationConfirmation: profile.push_notifications ?? true,
        }));
      } catch (err) {
        console.error('Error loading user profile:', err);
        toast({
          title: "Error",
          description: "Failed to load notification settings",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user, toast]);

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!userProfile) return;

    setSaving(true);
    try {
      const privacySettings = userProfile.privacy_settings as any || {};
      const updatedPrivacySettings = {
        ...privacySettings,
        notifications: settings
      };

      const { error } = await userService.updateUserProfile({
        privacy_settings: updatedPrivacySettings,
        email_notifications: settings.emailDonationReceipts,
        push_notifications: settings.pushDonationConfirmation,
      });

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (err) {
      console.error('Error saving notification settings:', err);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Loading notification settings...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-gray-600 mt-2">
              Choose how and when you want to receive updates and notifications
            </p>
          </div>

          {/* Email Notifications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="email-receipts">Donation receipts</Label>
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Receive email receipts for tax purposes when you make donations
                  </p>
                </div>
                <Switch
                  id="email-receipts"
                  checked={settings.emailDonationReceipts}
                  onCheckedChange={(checked) => handleSettingChange('emailDonationReceipts', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-campaign-updates">Campaign updates</Label>
                  <p className="text-sm text-gray-500">
                    Get updates when campaigns you've supported reach milestones
                  </p>
                </div>
                <Switch
                  id="email-campaign-updates"
                  checked={settings.emailCampaignUpdates}
                  onCheckedChange={(checked) => handleSettingChange('emailCampaignUpdates', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-weekly-digest">Weekly digest</Label>
                  <p className="text-sm text-gray-500">
                    Weekly summary of new campaigns and impact stories
                  </p>
                </div>
                <Switch
                  id="email-weekly-digest"
                  checked={settings.emailWeeklyDigest}
                  onCheckedChange={(checked) => handleSettingChange('emailWeeklyDigest', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-marketing">Marketing updates</Label>
                  <p className="text-sm text-gray-500">
                    Occasional updates about new features and platform improvements
                  </p>
                </div>
                <Switch
                  id="email-marketing"
                  checked={settings.emailMarketingUpdates}
                  onCheckedChange={(checked) => handleSettingChange('emailMarketingUpdates', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="email-security">Security alerts</Label>
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Important security notifications about your account
                  </p>
                </div>
                <Switch
                  id="email-security"
                  checked={settings.emailSecurityAlerts}
                  onCheckedChange={(checked) => handleSettingChange('emailSecurityAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="push-donation-confirmation">Donation confirmations</Label>
                  <p className="text-sm text-gray-500">
                    Instant confirmation when your donation is successfully processed
                  </p>
                </div>
                <Switch
                  id="push-donation-confirmation"
                  checked={settings.pushDonationConfirmation}
                  onCheckedChange={(checked) => handleSettingChange('pushDonationConfirmation', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="push-milestones">Campaign milestones</Label>
                  <p className="text-sm text-gray-500">
                    When campaigns you support reach important funding goals
                  </p>
                </div>
                <Switch
                  id="push-milestones"
                  checked={settings.pushCampaignMilestones}
                  onCheckedChange={(checked) => handleSettingChange('pushCampaignMilestones', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="push-new-campaigns">New campaigns</Label>
                  <p className="text-sm text-gray-500">
                    Notifications about new campaigns from organizations you follow
                  </p>
                </div>
                <Switch
                  id="push-new-campaigns"
                  checked={settings.pushNewCampaigns}
                  onCheckedChange={(checked) => handleSettingChange('pushNewCampaigns', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="push-urgent-alerts">Urgent alerts</Label>
                  <p className="text-sm text-gray-500">
                    Time-sensitive notifications about emergencies and urgent needs
                  </p>
                </div>
                <Switch
                  id="push-urgent-alerts"
                  checked={settings.pushUrgentAlerts}
                  onCheckedChange={(checked) => handleSettingChange('pushUrgentAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* In-App Notifications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                In-App Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="inapp-messages">Messages</Label>
                  <p className="text-sm text-gray-500">
                    Show messages from organizations and platform updates
                  </p>
                </div>
                <Switch
                  id="inapp-messages"
                  checked={settings.inAppMessages}
                  onCheckedChange={(checked) => handleSettingChange('inAppMessages', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="inapp-updates">Activity updates</Label>
                  <p className="text-sm text-gray-500">
                    Show updates about your donations and followed campaigns
                  </p>
                </div>
                <Switch
                  id="inapp-updates"
                  checked={settings.inAppUpdates}
                  onCheckedChange={(checked) => handleSettingChange('inAppUpdates', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="inapp-reminders">Donation reminders</Label>
                  <p className="text-sm text-gray-500">
                    Gentle reminders about campaigns ending soon
                  </p>
                </div>
                <Switch
                  id="inapp-reminders"
                  checked={settings.inAppReminders}
                  onCheckedChange={(checked) => handleSettingChange('inAppReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Frequency */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Notification Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Mail className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <h4 className="font-medium text-blue-900 mb-1">Email</h4>
                  <p className="text-sm text-blue-700">
                    {Object.entries(settings).filter(([key, value]) => 
                      key.startsWith('email') && value
                    ).length} enabled
                  </p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Bell className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <h4 className="font-medium text-green-900 mb-1">Push</h4>
                  <p className="text-sm text-green-700">
                    {Object.entries(settings).filter(([key, value]) => 
                      key.startsWith('push') && value
                    ).length} enabled
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <h4 className="font-medium text-purple-900 mb-1">In-App</h4>
                  <p className="text-sm text-purple-700">
                    {Object.entries(settings).filter(([key, value]) => 
                      key.startsWith('inApp') && value
                    ).length} enabled
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900 mb-1">Important Notice</h3>
                  <p className="text-sm text-amber-700">
                    Some notifications like donation receipts and security alerts cannot be disabled 
                    for your account security and compliance with tax regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="min-w-32"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
