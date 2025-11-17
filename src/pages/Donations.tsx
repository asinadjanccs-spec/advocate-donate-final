import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Calendar, 
  Target, 
  Download, 
  RefreshCw, 
  ArrowLeft,
  DollarSign,
  Repeat,
  Building2,
  Users,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { donationService, DonationHistory } from '@/lib/donationService';
import { format } from 'date-fns';

const Donations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<DonationHistory[]>([]);
  const [stats, setStats] = useState({
    totalDonated: 0,
    donationCount: 0,
    recurringDonations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDonations = async () => {
    try {
      setError(null);
      const [donationsResult, statsResult] = await Promise.all([
        donationService.getUserDonations(50, 0),
        donationService.getUserDonationStats()
      ]);

      if (donationsResult.error) {
        setError(donationsResult.error);
      } else {
        setDonations(donationsResult.donations);
      }

      if (statsResult.error && !donationsResult.error) {
        setError(statsResult.error);
      } else if (!statsResult.error) {
        setStats({
          totalDonated: statsResult.totalDonated,
          donationCount: statsResult.donationCount,
          recurringDonations: statsResult.recurringDonations
        });
      }
    } catch (err) {
      setError('Failed to load donation data. Please try again.');
      console.error('Error loading donations:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDonations();
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTargetTypeIcon = (targetType: string) => {
    switch (targetType) {
      case 'campaign':
        return <Target className="w-4 h-4" />;
      case 'organization':
        return <Building2 className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case 'campaign':
        return 'Campaign';
      case 'organization':
        return 'Organization';
      default:
        return 'General Fund';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading your donations...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} 
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donations</h1>
                <p className="text-gray-600">Track your giving history and impact</p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalDonated)}</div>
                <p className="text-xs text-muted-foreground">Lifetime contributions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.donationCount}</div>
                <p className="text-xs text-muted-foreground">Individual donations made</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recurring Donations</CardTitle>
                <Repeat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recurringDonations}</div>
                <p className="text-xs text-muted-foreground">Active subscriptions</p>
              </CardContent>
            </Card>
          </div>

          {/* Donations List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Donation History
              </CardTitle>
              <CardDescription>
                Your complete donation history and receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
                  <p className="text-gray-500 mb-6">Start making a difference by donating to causes you care about.</p>
                  <Link to="/donate">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Heart className="w-4 h-4 mr-2" />
                      Make Your First Donation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div 
                      key={donation.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTargetTypeIcon(donation.target_type)}
                            <h3 className="font-semibold text-gray-900">{donation.target_name}</h3>
                            <Badge variant="outline">
                              {getTargetTypeLabel(donation.target_type)}
                            </Badge>
                            {donation.is_recurring && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Repeat className="w-3 h-3" />
                                {donation.frequency || 'Recurring'}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(donation.created_at), 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {formatCurrency(donation.amount, donation.currency)}
                            </div>
                          </div>
                          
                          {donation.message && (
                            <p className="text-sm text-gray-600 italic">"{ donation.message}"</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Badge 
                            variant={donation.payment_status === 'succeeded' ? 'default' : 'destructive'}
                          >
                            {donation.payment_status}
                          </Badge>
                          
                          {donation.target_type === 'campaign' && donation.target_id && (
                            <Link to={`/campaigns/${donation.target_id}`}>
                              <Button variant="outline" size="sm">
                                View Campaign
                              </Button>
                            </Link>
                          )}
                          
                          {donation.target_type === 'organization' && donation.target_id && (
                            <Link to={`/organizations/${donation.target_id}`}>
                              <Button variant="outline" size="sm">
                                View Organization
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Continue your giving journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/donate">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Make a Donation</span>
                    <span className="text-xs text-gray-500">Support a cause today</span>
                  </Button>
                </Link>
                
                <Link to="/campaigns">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Browse Campaigns</span>
                    <span className="text-xs text-gray-500">Find new causes to support</span>
                  </Button>
                </Link>
                
                <Link to="/organizations">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Building2 className="w-5 h-5" />
                    <span className="font-medium">Explore Organizations</span>
                    <span className="text-xs text-gray-500">Discover verified nonprofits</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Donations;