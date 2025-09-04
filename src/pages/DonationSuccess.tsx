import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, Share2, Heart, ArrowLeft, Calendar, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface DonationDetails {
  id: string;
  amount: number;
  recipient: string;
  recipientType: 'campaign' | 'organization' | 'general';
  recipientId?: string;
  transactionId: string;
  timestamp: string;
  paymentMethod: string;
  isRecurring: boolean;
  frequency?: string;
  receiptUrl?: string;
  impactMessage?: string;
}

const DonationSuccess: React.FC = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<DonationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch donation details from an API
    // For now, we'll simulate with mock data
    const fetchDonationDetails = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock donation data
        const mockDonation: DonationDetails = {
          id: donationId || 'DON-2024-001',
          amount: 500,
          recipient: 'Emergency Food Relief for Typhoon Victims',
          recipientType: 'campaign',
          recipientId: '1',
          transactionId: 'TXN-' + Date.now(),
          timestamp: new Date().toISOString(),
          paymentMethod: 'Credit Card',
          isRecurring: false,
          receiptUrl: '/api/receipts/' + donationId,
          impactMessage: 'Your donation can provide meals for 10 families for one week.'
        };
        
        setDonation(mockDonation);
      } catch (error) {
        console.error('Failed to fetch donation details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, [donationId]);

  const handleShare = () => {
    if (!donation) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'I just made a donation!',
        text: `I donated ₱${donation.amount.toLocaleString()} to ${donation.recipient} through Bridge Needs. Join me in making a difference!`,
        url: window.location.origin
      });
    } else {
      const text = `I donated ₱${donation.amount.toLocaleString()} to ${donation.recipient} through Bridge Needs. Join me in making a difference! ${window.location.origin}`;
      navigator.clipboard.writeText(text);
    }
  };

  const handleDownloadReceipt = () => {
    if (donation?.receiptUrl) {
      const link = document.createElement('a');
      link.href = donation.receiptUrl;
      link.download = `donation-receipt-${donation.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading donation details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16">
            <Card>
              <CardContent className="text-center py-16">
                <h1 className="text-2xl font-bold text-foreground mb-4">Donation Not Found</h1>
                <p className="text-muted-foreground mb-6">
                  We couldn't find the donation details you're looking for.
                </p>
                <Button onClick={() => navigate('/donate')}>
                  Make a New Donation
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Success Header */}
        <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-green-700 mb-4">
              Thank You for Your Generosity!
            </h1>
            <p className="text-xl text-green-600 mb-2">
              Your donation has been processed successfully
            </p>
            <Badge variant="outline" className="bg-white text-green-700 border-green-200">
              Donation ID: {donation.id}
            </Badge>
          </div>
        </section>

        {/* Donation Details */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Main Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Donation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₱{donation.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold">
                      {donation.isRecurring ? `Monthly Recurring` : 'One-time'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Recipient</p>
                  <p className="font-semibold">{donation.recipient}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(donation.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{donation.paymentMethod}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {donation.transactionId}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Impact Message */}
            {donation.impactMessage && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">Your Impact</h3>
                      <p className="text-blue-700">{donation.impactMessage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {donation.receiptUrl && (
                <Button
                  onClick={handleDownloadReceipt}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Tax Receipt
                </Button>
              )}
              
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Impact
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => navigate('/donate')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Donate Again
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Stay Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive updates on how your donation is making an impact.
                    </p>
                  </div>
                </div>
                
                {donation.isRecurring && (
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Recurring Donation</h4>
                      <p className="text-sm text-muted-foreground">
                        Your next donation will be processed on the same date next month.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Actions */}
            <div className="text-center pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Want to make an even bigger impact?
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {donation.recipientType === 'campaign' && donation.recipientId && (
                  <Link to={`/campaigns/${donation.recipientId}`}>
                    <Button variant="link" size="sm">
                      View Campaign Details
                    </Button>
                  </Link>
                )}
                {donation.recipientType === 'organization' && donation.recipientId && (
                  <Link to={`/organizations/${donation.recipientId}`}>
                    <Button variant="link" size="sm">
                      View Organization
                    </Button>
                  </Link>
                )}
                <Link to="/campaigns">
                  <Button variant="link" size="sm">
                    Browse More Causes
                  </Button>
                </Link>
                <Link to="/organizations">
                  <Button variant="link" size="sm">
                    Find Organizations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DonationSuccess;