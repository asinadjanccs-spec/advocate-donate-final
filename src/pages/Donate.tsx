import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Search, Filter, MapPin, Calendar, Target, CreditCard, CheckCircle, AlertCircle, Loader2, User } from "lucide-react";
import { Link } from "react-router-dom";
import { donationService, DonationFormState, DonationContext } from "@/lib/donationService";
import { MockPaymentMethod } from "@/lib/payment";
import DonationConfirmation from "@/components/DonationConfirmation";
import { useAuth } from "@/contexts/AuthContext";

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [formState, setFormState] = useState<DonationFormState>(donationService.initializeFormState());
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<MockPaymentMethod[]>([]);
  const [donationResult, setDonationResult] = useState<{ success: boolean; donationId?: string; error?: string } | null>(null);
  const [selectedCause, setSelectedCause] = useState("");
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setAvailablePaymentMethods(donationService.getAvailablePaymentMethods());
    initializeFormWithAuth();
  }, []);

  const initializeFormWithAuth = async () => {
    setIsLoadingUserData(true);
    try {
      const initialState = await donationService.initializeFormStateWithAuth();
      setFormState(initialState);
    } catch (error) {
      console.error('Error initializing form with auth:', error);
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const suggestedAmounts = donationService.getSuggestedAmounts();

  const handleQuickDonate = () => {
    const amount = parseFloat(selectedAmount);
    if (amount && selectedCause) {
      setFormState(prev => ({
        ...prev,
        amount: amount,
        isRecurring: donationType === "monthly",
        frequency: donationType === "monthly" ? "monthly" : "yearly"
      }));
      setShowDonationForm(true);
    }
  };

  const handleFormChange = (field: keyof DonationFormState, value: string | number | boolean | MockPaymentMethod) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: '' // Clear error when user starts typing
      }
    }));
  };

  const handlePaymentMethodSelect = (paymentMethod: MockPaymentMethod) => {
    setFormState(prev => ({
      ...prev,
      selectedPaymentMethod: paymentMethod
    }));
  };

  const handleSubmitDonation = async () => {
    setFormState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const context: DonationContext = {
        campaignTitle: selectedCause === "most-urgent" ? "Most Urgent Causes" : selectedCause
      };
      
      const result = await donationService.processDonation(formState, context);
      
      if (result.success) {
        setDonationResult({
          success: true,
          donationId: result.donationId
        });
      } else {
        setDonationResult({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      setDonationResult({
        success: false,
        error: "An unexpected error occurred. Please try again."
      });
    } finally {
      setFormState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const resetDonationFlow = () => {
    setShowDonationForm(false);
    setDonationResult(null);
    setFormState(donationService.initializeFormState());
    setSelectedAmount("");
    setSelectedCause("");
  };
  
  const urgentCampaigns = [
    {
      id: 1,
      title: "Emergency Food Relief for Typhoon Victims",
      organization: "Metro Manila Relief Foundation",
      category: "Disaster Relief",
      location: "Metro Manila",
      raised: 156750,
      goal: 500000,
      daysLeft: 12,
      image: "/placeholder.svg",
      urgent: true
    },
    {
      id: 2,
      title: "Children's Education Scholarship Fund",
      organization: "Education for All PH",
      category: "Education",
      location: "Cebu City",
      raised: 89200,
      goal: 200000,
      daysLeft: 25,
      image: "/placeholder.svg",
      urgent: false
    },
    {
      id: 3,
      title: "Medical Equipment for Rural Clinic",
      organization: "Healthcare Access Initiative",
      category: "Healthcare",
      location: "Davao",
      raised: 234100,
      goal: 350000,
      daysLeft: 8,
      image: "/placeholder.svg",
      urgent: true
    }
  ];

  const categories = [
    "All Categories",
    "Disaster Relief",
    "Education", 
    "Healthcare",
    "Food Security",
    "Clean Water",
    "Housing",
    "Environment",
    "Children & Youth",
    "Elderly Care"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-hero text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Make a Difference Today
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Your generosity creates ripples of positive change. Choose a cause close to your heart and see your impact in real-time.
            </p>
          </div>
        </section>

        {/* Quick Donate Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Quick Donation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Donation Type */}
                <div className="flex justify-center gap-4">
                  <Button 
                    variant={donationType === "one-time" ? "default" : "outline"}
                    onClick={() => setDonationType("one-time")}
                  >
                    One-Time
                  </Button>
                  <Button 
                    variant={donationType === "monthly" ? "default" : "outline"}
                    onClick={() => setDonationType("monthly")}
                  >
                    Monthly
                  </Button>
                </div>

                {/* Amount Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">Choose Amount</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {suggestedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount.toString() ? "default" : "outline"}
                        onClick={() => setSelectedAmount(amount.toString())}
                        className="h-12"
                      >
                        ₱{amount}
                      </Button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</span>
                    <Input 
                      placeholder="Custom amount"
                      value={selectedAmount}
                      onChange={(e) => setSelectedAmount(e.target.value)}
                      className="pl-8"
                      type="number"
                    />
                  </div>
                </div>

                {/* Cause Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">Where should we direct your donation?</h3>
                  <Select value={selectedCause} onValueChange={setSelectedCause}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose where your donation helps most" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most-urgent">Most Urgent Causes</SelectItem>
                      <SelectItem value="disaster-relief">Disaster Relief</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="food-security">Food Security</SelectItem>
                      <SelectItem value="local">My Local Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  disabled={!selectedAmount || !selectedCause}
                  onClick={handleQuickDonate}
                >
                  {donationType === "monthly" ? "Start Monthly Giving" : "Donate Now"}
                </Button>

                {/* Donation Form Modal */}
                {showDonationForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold">Complete Your Donation</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDonationForm(false)}
                          >
                            ×
                          </Button>
                        </div>

                        {donationResult ? (
                          <DonationConfirmation
                            result={{
                              success: donationResult.success,
                              donationId: donationResult.donationId,
                              error: donationResult.error,
                              amount: formState.amount,
                              recipient: selectedCause || 'General Fund'
                            }}
                            onClose={() => setShowDonationForm(false)}
                            onNewDonation={resetDonationFlow}
                            recipientType="general"
                          />
                        ) : (
                          <div className="space-y-4">
                            {/* Donation Summary */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Donation Summary</h4>
                              <div className="flex justify-between">
                                <span>Amount:</span>
                                <span className="font-semibold">₱{formState.amount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Type:</span>
                                <span>{formState.isRecurring ? 'Monthly' : 'One-time'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cause:</span>
                                <span className="text-sm">{selectedCause === "most-urgent" ? "Most Urgent Causes" : selectedCause}</span>
                              </div>
                            </div>

                            {/* Authenticated User Information */}
                            <div className="space-y-3">
                              <div className="bg-muted/50 p-4 rounded-lg border">
                                <div className="flex items-center gap-2 mb-3">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <Label className="text-sm font-medium">Donation will be made by:</Label>
                                </div>
                                {isLoadingUserData ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm text-muted-foreground">Loading your information...</span>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Name:</span>
                                      <span className="text-sm font-medium">{formState.donorName || 'Not provided'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Email:</span>
                                      <span className="text-sm font-medium">{formState.donorEmail || 'Not provided'}</span>
                                    </div>
                                    {formState.donorPhone && (
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Phone:</span>
                                        <span className="text-sm font-medium">{formState.donorPhone}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="message">Message (Optional)</Label>
                                <Textarea
                                  id="message"
                                  value={formState.message}
                                  onChange={(e) => handleFormChange('message', e.target.value)}
                                  placeholder="Leave a message with your donation"
                                  rows={3}
                                />
                              </div>
                            </div>

                            {/* Payment Methods */}
                            <div>
                              <Label>Payment Method *</Label>
                              <div className="grid grid-cols-1 gap-2 mt-2">
                                {availablePaymentMethods.map((method) => (
                                  <div
                                    key={method.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                      formState.selectedPaymentMethod?.id === method.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handlePaymentMethodSelect(method)}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <CreditCard className="w-5 h-5" />
                                      <div>
                                        <p className="font-medium">{method.type.toUpperCase()}</p>
                                        <p className="text-sm text-gray-600">**** **** **** {method.card.last4}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {formState.errors.selectedPaymentMethod && (
                                <p className="text-red-500 text-sm mt-1">{formState.errors.selectedPaymentMethod}</p>
                              )}
                            </div>

                            {/* Anonymous Donation */}
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="anonymous"
                                checked={formState.isAnonymous}
                                onCheckedChange={(checked) => handleFormChange('isAnonymous', checked)}
                              />
                              <Label htmlFor="anonymous" className="text-sm">
                                Make this donation anonymous
                              </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                              onClick={handleSubmitDonation}
                              disabled={formState.isProcessing}
                              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                              {formState.isProcessing ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                `Donate ₱${formState.amount}`
                              )}
                            </Button>

                            {/* Error Display */}
                            {Object.values(formState.errors).some(error => error) && (
                              <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-700">
                                  Please fix the errors above before proceeding.
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-center">
                  Your donation is secure and you'll receive a receipt for tax purposes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Browse Campaigns */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Browse Campaigns
              </h2>
              <p className="text-xl text-muted-foreground">
                Find specific causes and organizations that align with your values
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search campaigns, organizations, or causes..."
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="ncr">Metro Manila</SelectItem>
                  <SelectItem value="cebu">Cebu</SelectItem>
                  <SelectItem value="davao">Davao</SelectItem>
                  <SelectItem value="baguio">Baguio</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Campaign Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {urgentCampaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title}
                      className="w-full h-48 object-cover"
                    />
                    {campaign.urgent && (
                      <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{campaign.category}</Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {campaign.location}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {campaign.title}
                    </h3>
                    
                    <p className="text-primary font-medium text-sm mb-4">
                      {campaign.organization}
                    </p>
                    
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          ₱{campaign.raised.toLocaleString()} raised
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round((campaign.raised / campaign.goal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-success h-2 rounded-full" 
                          style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">
                          <Target className="w-3 h-3 inline mr-1" />
                          ₱{campaign.goal.toLocaleString()} goal
                        </span>
                        <span className="text-muted-foreground">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {campaign.daysLeft} days left
                        </span>
                      </div>
                    </div>
                    
                    <Link to={`/campaigns/${campaign.id}/donate`} className="block">
                      <Button className="w-full" variant="default">Donate Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Campaigns
              </Button>
            </div>
          </div>
        </section>

        {/* Impact Statement */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Your Impact Matters
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">₱12.5M</div>
                <div className="text-muted-foreground">Total donated this year</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">45K+</div>
                <div className="text-muted-foreground">People helped</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">280+</div>
                <div className="text-muted-foreground">Active campaigns</div>
              </div>
            </div>
            <p className="text-xl text-muted-foreground">
              Every donation creates a ripple effect of positive change in communities across the Philippines.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;