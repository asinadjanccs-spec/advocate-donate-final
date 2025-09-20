import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  Truck,
  AlertCircle,
  CheckCircle,
  Package
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { physicalDonationService } from '../lib/physicalDonationService';
import { donationTypeService } from '../lib/donationTypeService';
import DonationItemsManager from './DonationItemsManager';
import {
  PhysicalDonationFormData,
  DonationItemFormData,
  PickupPreference,
  TargetType,
  CreateDonationResponse,
  DonationItemCategory
} from '../types/donations';

interface PhysicalDonationFormProps {
  targetType: TargetType;
  targetId?: string;
  targetName: string;
  onSuccess: (result: CreateDonationResponse) => void;
  onCancel?: () => void;
  className?: string;
}

const PhysicalDonationForm: React.FC<PhysicalDonationFormProps> = ({
  targetType,
  targetId,
  targetName,
  onSuccess,
  onCancel,
  className = ''
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedCategories, setAcceptedCategories] = useState<DonationItemCategory[]>([]);

  const [formData, setFormData] = useState<PhysicalDonationFormData>({
    donorName: user?.user_metadata?.full_name || '',
    donorEmail: user?.email || '',
    donorPhone: '',
    message: '',
    isAnonymous: false,
    targetType,
    targetId,
    targetName,
    pickupPreference: 'pickup',
    pickupAddress: '',
    pickupInstructions: '',
    preferredPickupDate: '',
    preferredTimeSlot: 'flexible',
    items: []
  });

  const totalSteps = 3;
  const pickupPreferences: { value: PickupPreference; label: string; description: string }[] = [
    {
      value: 'pickup',
      label: 'Pickup from my location',
      description: 'We will coordinate to collect items from your address'
    },
    {
      value: 'delivery',
      label: 'I will deliver',
      description: 'You will bring the items to the organization'
    },
    {
      value: 'flexible',
      label: 'Flexible',
      description: 'We can discuss the best option together'
    }
  ];

  const timeSlots = [
    { value: 'morning', label: 'Morning (8AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
    { value: 'evening', label: 'Evening (5PM - 8PM)' },
    { value: 'flexible', label: 'Flexible' }
  ];

  useEffect(() => {
    const fetchAcceptedCategories = async () => {
      if (targetType && targetId) {
        const categories = await donationTypeService.getSupportedPhysicalDonationCategories(
          targetType,
          targetId
        );
        setAcceptedCategories(categories);
      }
    };

    fetchAcceptedCategories();
  }, [targetType, targetId]);

  const handleInputChange = (field: keyof PhysicalDonationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleItemsChange = (items: DonationItemFormData[]) => {
    setFormData(prev => ({
      ...prev,
      items
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.donorName.trim() &&
          formData.donorEmail.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donorEmail)
        );
      case 2:
        return formData.items.length > 0;
      case 3:
        return formData.pickupPreference !== 'delivery' ? !!formData.pickupAddress.trim() : true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await physicalDonationService.createPhysicalDonation(
        formData,
        user?.id
      );

      if (result.success) {
        onSuccess(result);
      } else {
        setError(result.error || 'Failed to submit donation');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error submitting donation:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="h-5 w-5" />;
    if (step === currentStep) return <div className="h-5 w-5 rounded-full bg-primary" />;
    return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />;
  };

  const getStepTitle = (step: number) => {
    const titles = {
      1: 'Donor Information',
      2: 'Donation Items',
      3: 'Pickup Details'
    };
    return titles[step as keyof typeof titles];
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress Header */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl">Physical Donation to {targetName}</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  step <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {getStepIcon(step)}
                  <span className="text-sm font-medium">{getStepTitle(step)}</span>
                </div>
                {step < totalSteps && (
                  <div className={`mx-4 h-px w-12 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Donor Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Your Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donorName">Full Name *</Label>
                  <Input
                    id="donorName"
                    value={formData.donorName}
                    onChange={(e) => handleInputChange('donorName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorEmail">Email Address *</Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    value={formData.donorEmail}
                    onChange={(e) => handleInputChange('donorEmail', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorPhone">Phone Number</Label>
                <Input
                  id="donorPhone"
                  type="tel"
                  value={formData.donorPhone}
                  onChange={(e) => handleInputChange('donorPhone', e.target.value)}
                  placeholder="+63 900 000 0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message to {targetName}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Share why you're donating or any special message..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAnonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => handleInputChange('isAnonymous', checked)}
                />
                <Label htmlFor="isAnonymous" className="text-sm">
                  Make this donation anonymous
                </Label>
              </div>
            </div>
          )}

          {/* Step 2: Donation Items */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Items to Donate</h3>
              </div>

              <DonationItemsManager
                items={formData.items}
                onItemsChange={handleItemsChange}
                acceptedCategories={acceptedCategories}
              />

              {formData.items.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please add at least one item to proceed with your donation.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 3: Pickup Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Pickup Coordination</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Pickup Preference *</Label>
                  {pickupPreferences.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <Checkbox
                        id={option.value}
                        checked={formData.pickupPreference === option.value}
                        onCheckedChange={() => handleInputChange('pickupPreference', option.value)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="font-medium">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.pickupPreference !== 'delivery' && (
                  <div className="space-y-2">
                    <Label htmlFor="pickupAddress">Pickup Address *</Label>
                    <Textarea
                      id="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                      placeholder="Enter your complete address for pickup..."
                      rows={3}
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredPickupDate">Preferred Date</Label>
                    <Input
                      id="preferredPickupDate"
                      type="date"
                      value={formData.preferredPickupDate}
                      onChange={(e) => handleInputChange('preferredPickupDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTimeSlot">Preferred Time</Label>
                    <Select
                      value={formData.preferredTimeSlot}
                      onValueChange={(value) => handleInputChange('preferredTimeSlot', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupInstructions">Special Instructions</Label>
                  <Textarea
                    id="pickupInstructions"
                    value={formData.pickupInstructions}
                    onChange={(e) => handleInputChange('pickupInstructions', e.target.value)}
                    placeholder="Any special instructions for pickup (e.g., gate codes, parking, best contact method)..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious} disabled={loading}>
                  Previous
                </Button>
              )}
              {onCancel && currentStep === 1 && (
                <Button variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
              )}
            </div>

            <div className="space-x-2">
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!validateStep(currentStep) || loading}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!validateStep(currentStep) || loading}
                >
                  {loading ? 'Submitting...' : 'Submit Donation'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalDonationForm;
