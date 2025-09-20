import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userService, UserProfileWithOrganization } from '@/lib/userService';
import OrganizationDonationSettings from '@/components/OrganizationDonationSettings';

const OrganizationDonationPreferences: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileWithOrganization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: profile, error: profileError } = await userService.getCurrentUserProfile();
        
        if (profileError) {
          throw new Error(profileError);
        }

        if (!profile?.organization) {
          setError('No organization found. Please complete organization setup first.');
          return;
        }

        setUserProfile(profile);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading donation preferences...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button asChild>
                <Link to="/organization-setup">
                  Complete Organization Setup
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userProfile?.organization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to set up your organization first before configuring donation preferences.
              </AlertDescription>
            </Alert>
            <Button asChild>
              <Link to="/organization-setup">
                Set Up Organization
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Donation Preferences</h1>
                <p className="text-gray-600">
                  Configure what types of donations {userProfile.organization.name} accepts
                </p>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                {userProfile.organization.name}
              </CardTitle>
              <CardDescription>
                Organization ID: {userProfile.organization.id}
                <br />
                Status: <span className="capitalize font-medium text-green-600">
                  {userProfile.organization.verification_status}
                </span>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Important Notice */}
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Important:</strong> These settings control donations made directly to your organization.</p>
                <p>Individual campaigns can have their own separate donation settings that override these preferences.</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Donation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Organization Donation Settings
              </CardTitle>
              <CardDescription>
                Configure the types of donations your organization accepts and manage pickup preferences for physical donations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationDonationSettings
                organizationId={userProfile.organization.id}
                className=""
              />
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Cash Donations</h4>
                  <p className="text-sm text-muted-foreground">
                    Monetary contributions processed securely through our payment system. 
                    Funds are transferred directly to your verified bank account.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Physical Donations</h4>
                  <p className="text-sm text-muted-foreground">
                    Goods and items donated by supporters. You can specify categories, 
                    pickup schedules, and special instructions for handling.
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Questions?</strong> Contact our support team for assistance with donation settings.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/support">Contact Support</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/guidelines">View Guidelines</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrganizationDonationPreferences;
