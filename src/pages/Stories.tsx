import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Calendar } from "lucide-react";

const Stories = () => {
  const stories = [
    {
      id: 1,
      title: "Rebuilding Lives After Typhoon Aftermath",
      organization: "Manila Relief Foundation",
      category: "Disaster Relief",
      impact: "500 families helped",
      date: "November 2024",
      excerpt: "Through community donations, we were able to provide emergency shelter and supplies to families affected by the recent typhoon, helping them rebuild their lives.",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Feeding Program Reaches Rural Communities",
      organization: "Nutrition First PH",
      category: "Food Security",
      impact: "2,000 children fed daily",
      date: "October 2024",
      excerpt: "Our school feeding program has expanded to reach remote villages, ensuring no child goes to school hungry. The impact on learning outcomes has been remarkable.",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Clean Water Access for Island Communities",
      organization: "Water for All Initiative",
      category: "Water & Sanitation",
      impact: "15 communities served",
      date: "September 2024",
      excerpt: "Installing water filtration systems in remote island communities has dramatically reduced waterborne illnesses and improved quality of life for thousands.",
      image: "/placeholder.svg"
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
              Impact Stories
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Real stories of hope, resilience, and positive change made possible by our community of donors and organizations.
            </p>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8">
              {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={story.image} 
                          alt={story.title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Badge variant="secondary">{story.category}</Badge>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            {story.date}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {story.title}
                        </h3>
                        
                        <p className="text-primary font-semibold mb-3">
                          {story.organization}
                        </p>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {story.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-6">
                          <div className="flex items-center text-success">
                            <Users className="w-5 h-5 mr-2" />
                            <span className="font-semibold">{story.impact}</span>
                          </div>
                          <button className="text-primary hover:text-primary-dark font-semibold">
                            Read Full Story →
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted text-center">
          <div className="max-w-4xl mx-auto">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Be Part of the Next Success Story
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Every donation, no matter the size, creates ripples of positive change in communities that need it most.
            </p>
            <a 
              href="/organizations" 
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-block"
            >
              Start Giving Today
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Stories;