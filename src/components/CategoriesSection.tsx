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
import foodImage from "@/assets/food-donations.jpg";

const CategoriesSection = () => {
  const categories = [
    {
      icon: UtensilsCrossed,
      name: "Food Security",
      description: "Meals, groceries, and nutrition programs",
      activeCampaigns: 23,
      urgentNeeds: 8,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      image: foodImage
    },
    {
      icon: Home,
      name: "Shelter & Housing",
      description: "Emergency shelter, housing assistance",
      activeCampaigns: 15,
      urgentNeeds: 4,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      image: foodImage
    },
    {
      icon: GraduationCap,
      name: "Education",
      description: "School supplies, scholarships, programs",
      activeCampaigns: 31,
      urgentNeeds: 12,
      color: "text-green-600",
      bgColor: "bg-green-50",
      image: foodImage
    },
    {
      icon: Stethoscope,
      name: "Healthcare",
      description: "Medical assistance, health programs",
      activeCampaigns: 18,
      urgentNeeds: 6,
      color: "text-red-600",
      bgColor: "bg-red-50",
      image: foodImage
    },
    {
      icon: Shirt,
      name: "Clothing & Essentials",
      description: "Clothing, hygiene items, basics",
      activeCampaigns: 27,
      urgentNeeds: 9,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      image: foodImage
    },
    {
      icon: Heart,
      name: "Emergency Relief",
      description: "Disaster response, crisis support",
      activeCampaigns: 12,
      urgentNeeds: 15,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      image: foodImage
    }
  ];

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
                  <span>{category.activeCampaigns} active campaigns</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-medium text-success">₱{(Math.random() * 50 + 10).toFixed(0)}K raised</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-gradient-impact h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.random() * 60 + 20}%` }}
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