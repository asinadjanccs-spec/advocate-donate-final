import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar, LogOut, Heart, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { donationService, DonationHistory } from '@/lib/donationService';

const Dashboard: React.FC = () => {
  const { user, signOut, isEmailVerified } = useAuth();
  const [recentDonations, setRecentDonations] = useState<DonationHistory[]>([]);
  const [donationStats, setDonationStats] = useState({
    totalDonated: 0,
    donationCount: 0,
    recurringDonations: 0
  });
  const [loadingDonations, setLoadingDonations] = useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserRole = () => {
    return user?.user_metadata?.userType || user?.app_metadata?.userType || 'User';
  };

  const getJoinDate = () => {
    if (user?.created_at) {
      return new Date(user.created_at as string).toLocaleDateString();
    }
    return 'Unknown';
  };

  const loadDonationData = async () => {
    try {
      const [donationsResult, statsResult] = await Promise.all([
        donationService.getUserDonations(3, 0), // Get last 3 donations
        donationService.getUserDonationStats()
      ]);

      if (!donationsResult.error) {
        setRecentDonations(donationsResult.donations);
      }

      if (!statsResult.error) {
        setDonationStats({
          totalDonated: statsResult.totalDonated,
          donationCount: statsResult.donationCount,
          recurringDonations: statsResult.recurringDonations
        });
      }
    } catch (error) {
      console.error('Error loading donation data:', error);
    } finally {
      setLoadingDonations(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    loadDonationData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.user_metadata?.fullName || user?.email}</p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={isEmailVerified() ? 'default' : 'destructive'}>
                        {isEmailVerified() ? 'Verified' : 'Unverified'}
                      </Badge>
                      {!isEmailVerified() && (
                        <Link to="/email-verification" className="text-sm text-blue-600 hover:underline">
                          Verify now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Role</p>
                    <Badge variant="outline">{getUserRole()}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Member since</p>
                    <p className="text-sm text-gray-600">{getJoinDate()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">User ID</p>
                    <p className="text-sm text-gray-600 font-mono">{user?.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donations Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                My Donations
              </CardTitle>
              <CardDescription>
                Your giving history and impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDonations ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading donations...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-900">{formatCurrency(donationStats.totalDonated)}</p>
                        <p className="text-sm text-green-700">Total Donated</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <Heart className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-blue-900">{donationStats.donationCount}</p>
                        <p className="text-sm text-blue-700">Donations Made</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-purple-900">{donationStats.recurringDonations}</p>
                        <p className="text-sm text-purple-700">Recurring</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Donations */}
                  {recentDonations.length > 0 ? (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recent Donations</h4>
                      <div className="space-y-3">
                        {recentDonations.map((donation) => (
                          <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Heart className="h-4 w-4 text-red-500" />
                              <div>
                                <p className="font-medium text-gray-900">{donation.target_name}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(donation.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(donation.amount, donation.currency)}
                              </p>
                              <Badge variant={donation.payment_status === 'succeeded' ? 'default' : 'destructive'} className="text-xs">
                                {donation.payment_status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h4>
                      <p className="text-gray-500 mb-4">Start making a difference by donating to causes you care about.</p>
                      <Link to="/donate">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Heart className="w-4 h-4 mr-2" />
                          Make Your First Donation
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* View All Link */}
                  {recentDonations.length > 0 && (
                    <div className="flex justify-center">
                      <Link to="/donations">
                        <Button variant="outline" className="flex items-center gap-2">
                          View All Donations
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/create-campaign">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <span className="font-medium">Create Campaign</span>
                    <span className="text-xs text-gray-500">Start a new fundraising campaign</span>
                  </Button>
                </Link>
                
                <Link to="/organizations">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <span className="font-medium">Browse Organizations</span>
                    <span className="text-xs text-gray-500">Discover verified nonprofits</span>
                  </Button>
                </Link>
                
                <Link to="/campaigns">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <span className="font-medium">View Campaigns</span>
                    <span className="text-xs text-gray-500">Explore active campaigns</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your account settings and security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                {!isEmailVerified() && (
                  <Link to="/email-verification">
                    <Button variant="default">
                      Verify Email
                    </Button>
                  </Link>
                )}
                
                <Link to="/reset-password">
                  <Button variant="outline">
                    Change Password
                  </Button>
                </Link>
                
                <Button 
                  variant="destructive" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;