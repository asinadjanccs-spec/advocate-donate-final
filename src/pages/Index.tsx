import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedOrganizations from "@/components/FeaturedOrganizations";
import CategoriesSection from "@/components/CategoriesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturedOrganizations />
      <CategoriesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
};

export default Index;
