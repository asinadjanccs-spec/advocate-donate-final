import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UtensilsCrossed, 
  Home, 
  GraduationCap, 
  Heart, 
  Stethoscope, 
  Shirt,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { campaignService } from "@/lib/campaignService";
import { supabase } from "@/integrations/supabase/client";
import foodImage from "@/assets/food-donations.jpg";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([
    {
      icon: UtensilsCrossed,
      name: "Food Security",
      description: "Meals, groceries, and nutrition programs",
      activeCampaigns: 0,
      urgentNeeds: 0,
      totalRaised: 0,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      image: foodImage
    },
    {
      icon: Home,
      name: "Shelter & Housing", 
      description: "Emergency shelter, housing assistance",
      activeCampaigns: 0,
      urgentNeeds: 0,
      totalRaised: 0,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      image: foodImage
    },
    {
      icon: GraduationCap,
      name: "Education",
      description: "School supplies, scholarships, programs",
      activeCampaigns: 0,
      urgentNeeds: 0,
      totalRaised: 0,
      color: "text-green-600",
      bgColor: "bg-green-50",
      image: foodImage
    },
    {
      icon: Stethoscope,
      name: "Healthcare",
      description: "Medical assistance, health programs",
      activeCampaigns: 0,
      urgentNeeds: 0,
      totalRaised: 0,
      color: "text-red-600",
      bgColor: "bg-red-50",
      image: foodImage
    },
    {
      icon: Shirt,
      name: "Clothing & Essentials",
      description: "Clothing, hygiene items, basics",
      activeCampaigns: 0,
      urgentNeeds: 0,
      totalRaised: 0,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      image: foodImage
    },
    {
      icon: Heart,
      name: "Emergency Relief",
      description: "Disaster response, crisis support",
      activeCampaigns: 0,
      urgentNeeds: 0,
      totalRaised: 0,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      image: foodImage
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setLoading(true);
        const categoryNames = [
          "Food Security",
          "Shelter & Housing", 
          "Education",
          "Healthcare",
          "Clothing & Essentials",
          "Emergency Relief"
        ];

        const categoryStats = await Promise.all(
          categoryNames.map(async (categoryName) => {
            // Get campaigns count for category
            const { totalCount: activeCampaigns } = await campaignService.getCampaigns(1, 0, categoryName);
            
            // Get urgent campaigns count
            const { count: urgentCount } = await supabase
              .from('campaigns')
              .select('*', { count: 'exact', head: true })
              .eq('category', categoryName)
              .eq('status', 'active')
              .eq('is_urgent', true);

            // Get total raised for category
            const { data: campaignDonations } = await supabase
              .from('donations')
              .select('amount, campaigns!inner(category)')
              .eq('campaigns.category', categoryName)
              .eq('payment_status', 'succeeded');

            const totalRaised = campaignDonations?.reduce((sum, d) => sum + d.amount, 0) || 0;

            return {
              activeCampaigns: activeCampaigns || 0,
              urgentNeeds: urgentCount || 0,
              totalRaised
            };
          })
        );

        setCategories(prev => 
          prev.map((category, index) => ({
            ...category,
            activeCampaigns: categoryStats[index].activeCampaigns,
            urgentNeeds: categoryStats[index].urgentNeeds,
            totalRaised: categoryStats[index].totalRaised
          }))
        );
      } catch (error) {
        console.error('Error fetching category stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryStats();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Impact Categories
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose Your Cause
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From emergency relief to long-term community development, find the cause that 
            resonates with you and make a meaningful impact.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <Card key={index} className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <category.icon className="w-full h-full" />
              </div>

              <div className="p-6 relative">
                {/* Icon and Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  {category.urgentNeeds > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {category.urgentNeeds} urgent
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{loading ? '...' : category.activeCampaigns} active campaigns</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Raised</span>
                    <span className="font-medium text-success">
                      {loading ? '...' : `₱${(category.totalRaised / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-gradient-impact h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: loading ? '20%' : `${Math.min((category.totalRaised / 100000) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-impact/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-card rounded-2xl p-8 border border-border">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Can't Find Your Cause?
          </h3>
          <p className="text-muted-foreground mb-6">
            Explore all categories or search for specific organizations and campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg">
              Browse All Categories
            </Button>
            <Button variant="outline" size="lg">
              Search Organizations
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;