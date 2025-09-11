import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Users, Mail, Bell, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { userService, UserProfile } from '@/lib/userService';
import { useToast } from '@/hooks/use-toast';

interface PrivacySettingsData {
  profileVisibility: boolean;
  donationHistory: boolean;
  contactInfo: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const PrivacySettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PrivacySettingsData>({
    profileVisibility: true,
    donationHistory: false,
    contactInfo: false,
    emailNotifications: true,
    pushNotifications: true,
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
        
        // Parse privacy settings from database
        const privacySettings = profile.privacy_settings as any || {};
        setSettings({
          profileVisibility: privacySettings.profileVisibility ?? true,
          donationHistory: privacySettings.donationHistory ?? false,
          contactInfo: privacySettings.contactInfo ?? false,
          emailNotifications: profile.email_notifications ?? true,
          pushNotifications: profile.push_notifications ?? true,
        });
      } catch (err) {
        console.error('Error loading user profile:', err);
        toast({
          title: "Error",
          description: "Failed to load privacy settings",
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

  const handleSettingChange = (key: keyof PrivacySettingsData, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!userProfile) return;

    setSaving(true);
    try {
      const privacySettings = {
        profileVisibility: settings.profileVisibility,
        donationHistory: settings.donationHistory,
        contactInfo: settings.contactInfo,
      };

      const { error } = await userService.updateUserProfile({
        privacy_settings: privacySettings,
        email_notifications: settings.emailNotifications,
        push_notifications: settings.pushNotifications,
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
        description: "Privacy settings updated successfully",
      });
    } catch (err) {
      console.error('Error saving privacy settings:', err);
      toast({
        title: "Error",
        description: "Failed to save privacy settings",
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
                <p className="text-sm text-muted-foreground">Loading privacy settings...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Privacy Settings</h1>
            <p className="text-gray-600 mt-2">
              Control how your information is shared and who can see your activity
            </p>
          </div>

          {/* Profile Privacy */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Profile Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="profile-visibility">Make my profile public</Label>
                  <p className="text-sm text-gray-500">
                    Allow others to find and view your basic profile information
                  </p>
                </div>
                <Switch
                  id="profile-visibility"
                  checked={settings.profileVisibility}
                  onCheckedChange={(checked) => handleSettingChange('profileVisibility', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="contact-info">Show contact information</Label>
                  <p className="text-sm text-gray-500">
                    Display your email and phone number on your profile
                  </p>
                </div>
                <Switch
                  id="contact-info"
                  checked={settings.contactInfo}
                  onCheckedChange={(checked) => handleSettingChange('contactInfo', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Donation Privacy */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Donation Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="donation-history">Show donation history</Label>
                  <p className="text-sm text-gray-500">
                    Allow organizations to see your donation history publicly
                  </p>
                </div>
                <Switch
                  id="donation-history"
                  checked={settings.donationHistory}
                  onCheckedChange={(checked) => handleSettingChange('donationHistory', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications">Email notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive updates about donations, campaigns, and important account information
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="push-notifications">Push notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive real-time notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data & Security */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Your data is secure</h4>
                  <p className="text-sm text-blue-700">
                    We use industry-standard encryption to protect your personal information. 
                    Your payment data is never stored on our servers and is processed securely through trusted payment providers.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Data export & deletion</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    You can request a copy of your data or delete your account at any time.
                  </p>
                  <div className="space-x-3">
                    <Button variant="outline" size="sm">Export Data</Button>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                  </div>
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
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
