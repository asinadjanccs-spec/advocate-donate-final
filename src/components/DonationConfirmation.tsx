import React from 'react';
import { CheckCircle, AlertCircle, Download, Share2, Heart, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface DonationResult {
  success: boolean;
  donationId?: string;
  error?: string;
  amount?: number;
  recipient?: string;
  transactionId?: string;
  receiptUrl?: string;
}

interface DonationConfirmationProps {
  result: DonationResult;
  onClose: () => void;
  onNewDonation: () => void;
  recipientType?: 'campaign' | 'organization' | 'general';
  recipientId?: string;
}

const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  result,
  onClose,
  onNewDonation,
  recipientType = 'general',
  recipientId
}) => {
  const { user } = useAuth();
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just made a donation!',
        text: `I donated ₱${result.amount} to ${result.recipient} through Advocate&Donate. Join me in making a difference!`,
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `I donated ₱${result.amount} to ${result.recipient} through Advocate&Donate. Join me in making a difference! ${window.location.origin}`;
      navigator.clipboard.writeText(text);
    }
  };

  const handleDownloadReceipt = () => {
    if (result.receiptUrl) {
      const link = document.createElement('a');
      link.href = result.receiptUrl;
      link.download = `donation-receipt-${result.donationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (result.success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-700">Thank You!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                Your donation has been processed successfully.
              </p>
              {result.recipient && (
                <p className="text-sm text-gray-500 mb-4">
                  Donation to: <span className="font-semibold">{result.recipient}</span>
                </p>
              )}
            </div>

            {/* Donor Information */}
            {user && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Donor Information</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-600">Name:</span>
                   <span className="font-medium text-gray-800">{(user.user_metadata?.full_name as string) || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-600">Email:</span>
                   <span className="font-medium text-gray-800">{user.email}</span>
                 </div>
                 {user.user_metadata?.phone && (
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-600">Phone:</span>
                     <span className="font-medium text-gray-800">{user.user_metadata.phone as string}</span>
                   </div>
                 )}
              </div>
            )}

            {/* Donation Details */}
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="font-semibold text-green-700">₱{result.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Donation ID:</span>
                <Badge variant="outline" className="text-xs">{result.donationId}</Badge>
              </div>
              {result.transactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                  <span className="text-xs font-mono">{result.transactionId}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {result.receiptUrl && (
                <Button
                  onClick={handleDownloadReceipt}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
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

              <div className="flex gap-2">
                <Button
                  onClick={onNewDonation}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Donate Again
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500 mb-2">
                Want to make a bigger impact?
              </p>
              <div className="flex gap-2 justify-center">
                {recipientType === 'campaign' && recipientId && (
                  <Link to={`/campaigns/${recipientId}`}>
                    <Button variant="link" size="sm">
                      View Campaign
                    </Button>
                  </Link>
                )}
                {recipientType === 'organization' && recipientId && (
                  <Link to={`/organizations/${recipientId}`}>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              We encountered an issue processing your donation.
            </p>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onNewDonation}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>

          {/* Help Section */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">
              Need help with your donation?
            </p>
            <div className="flex gap-2 justify-center">
              <Link to="/support">
                <Button variant="link" size="sm">
                  Contact Support
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="link" size="sm">
                  Try Different Method
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationConfirmation;