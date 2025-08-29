import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Target, Calendar, DollarSign, Image as ImageIcon } from "lucide-react";

const CreateCampaign = () => {
  const categories = [
    "Food & Nutrition",
    "Healthcare",
    "Education",
    "Disaster Relief",
    "Housing & Shelter",
    "Clean Water",
    "Children & Youth",
    "Elderly Care",
    "Environment",
    "Community Development"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Create Campaign
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Launch a fundraising campaign to support your cause and connect with generous donors in your community.
            </p>
          </div>
        </section>

        {/* Campaign Form */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Campaign Title *
                    </label>
                    <Input placeholder="Enter a compelling campaign title" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Short Description *
                    </label>
                    <Input placeholder="Brief description that will appear in search results" />
                  </div>
                </div>

                {/* Campaign Story */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Campaign Story</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tell Your Story *
                    </label>
                    <Textarea 
                      placeholder="Share the compelling story behind your campaign. Explain the problem, your solution, and the impact donations will make."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      How Funds Will Be Used *
                    </label>
                    <Textarea 
                      placeholder="Be specific about how donations will be allocated. Transparency builds trust with donors."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Financial Goals */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Financial Goals
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Fundraising Goal *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="50000" className="pl-10" type="number" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Currency
                      </label>
                      <Select defaultValue="php">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="php">PHP (Philippine Peso)</SelectItem>
                          <SelectItem value="usd">USD (US Dollar)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Campaign End Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="date" className="pl-10" />
                    </div>
                  </div>
                </div>

                {/* Media Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Campaign Media
                  </h3>
                  
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-foreground mb-2">Upload Campaign Images</h4>
                    <p className="text-muted-foreground mb-4">
                      Add photos that tell your story. High-quality images increase donor engagement.
                    </p>
                    <Button variant="outline">Choose Images</Button>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold text-foreground">Preview</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Campaign Preview</p>
                    <div className="bg-card p-4 rounded border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Category</Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">Your Campaign Title</h4>
                      <p className="text-sm text-muted-foreground mb-3">Your short description will appear here...</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">₱0 raised of ₱0 goal</span>
                        <span className="text-muted-foreground">0 days left</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <input type="checkbox" id="terms" className="rounded border-border" />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and confirm that all information is accurate.
                    </label>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1">
                      Save as Draft
                    </Button>
                    <Button className="flex-1">
                      Launch Campaign
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCampaign;