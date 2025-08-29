import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Search, HandHeart, CheckCircle, Users, Globe, Shield } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Discover",
      description: "Browse verified organizations and active campaigns in your area or causes you care about."
    },
    {
      icon: Heart,
      title: "Connect",
      description: "Choose how you want to help - donate money, pledge items, or volunteer your time."
    },
    {
      icon: HandHeart,
      title: "Give",
      description: "Make secure donations or coordinate item pickups directly through our platform."
    },
    {
      icon: CheckCircle,
      title: "Track Impact",
      description: "See real-time updates on how your contributions are making a difference."
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Organizations",
      description: "All organizations undergo verification to ensure your donations reach legitimate causes."
    },
    {
      icon: Globe,
      title: "Transparent Tracking",
      description: "Real-time updates and receipts for every donation, so you know exactly where your help goes."
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Join a community of givers and see the collective impact we're making together."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              How Bridge Needs Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connecting generosity with genuine need through a simple, secure, and transparent platform.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Simple Steps to Make a Difference
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Why Choose Bridge Needs?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to Start Making a Difference?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of donors and organizations creating positive change in communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Get Started
              </a>
              <a href="/organizations" className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                Browse Organizations
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;