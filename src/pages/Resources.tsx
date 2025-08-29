import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Video, FileText, Users, TrendingUp, Shield, MessageSquare } from "lucide-react";

const Resources = () => {
  const resourceCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "bg-primary",
      resources: [
        { title: "Organization Setup Guide", type: "PDF", badge: "Essential" },
        { title: "First Campaign Best Practices", type: "Article", badge: "Popular" },
        { title: "Verification Process Walkthrough", type: "Video", badge: "New" }
      ]
    },
    {
      title: "Fundraising Success",
      icon: TrendingUp,
      color: "bg-success",
      resources: [
        { title: "Campaign Strategy Template", type: "Template", badge: "Downloadable" },
        { title: "Donor Communication Templates", type: "Template", badge: "Downloadable" },
        { title: "Social Media Toolkit", type: "Toolkit", badge: "Popular" }
      ]
    },
    {
      title: "Compliance & Legal",
      icon: Shield,
      color: "bg-warning",
      resources: [
        { title: "BIR Compliance Checklist", type: "PDF", badge: "Essential" },
        { title: "Financial Reporting Guidelines", type: "Guide", badge: "Updated" },
        { title: "Data Privacy Best Practices", type: "Article", badge: "Important" }
      ]
    },
    {
      title: "Community Building",
      icon: Users,
      color: "bg-impact",
      resources: [
        { title: "Volunteer Management Guide", type: "Guide", badge: "Comprehensive" },
        { title: "Donor Engagement Strategies", type: "Webinar", badge: "Live" },
        { title: "Impact Storytelling Workshop", type: "Video", badge: "Popular" }
      ]
    }
  ];

  const webinars = [
    {
      title: "Maximizing Your Fundraising Impact",
      date: "December 15, 2024",
      time: "2:00 PM PHT",
      speaker: "Maria Santos, Fundraising Expert",
      status: "upcoming"
    },
    {
      title: "Digital Marketing for Nonprofits",
      date: "November 28, 2024",
      time: "10:00 AM PHT",
      speaker: "Carlos Rodriguez, Digital Strategist",
      status: "recorded"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Resources
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Everything you need to succeed on Bridge Needs. Guides, templates, best practices, and expert advice to maximize your impact.
            </p>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8">
              {resourceCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {category.resources.map((resource, idx) => (
                        <div key={idx} className="border border-border rounded-lg p-4 hover:bg-card-hover transition-colors cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground text-sm">{resource.title}</h4>
                            <Badge variant="secondary" className="text-xs">{resource.badge}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {resource.type === 'PDF' && <FileText className="w-4 h-4 text-muted-foreground" />}
                            {resource.type === 'Video' && <Video className="w-4 h-4 text-muted-foreground" />}
                            {resource.type === 'Article' && <BookOpen className="w-4 h-4 text-muted-foreground" />}
                            {(resource.type === 'Template' || resource.type === 'Toolkit') && <Download className="w-4 h-4 text-muted-foreground" />}
                            {resource.type === 'Guide' && <FileText className="w-4 h-4 text-muted-foreground" />}
                            {resource.type === 'Webinar' && <Video className="w-4 h-4 text-muted-foreground" />}
                            <span className="text-xs text-muted-foreground">{resource.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Webinars Section */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Upcoming Webinars & Training
            </h2>
            <div className="space-y-4">
              {webinars.map((webinar, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Video className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-foreground">{webinar.title}</h3>
                          <Badge variant={webinar.status === 'upcoming' ? 'default' : 'secondary'}>
                            {webinar.status === 'upcoming' ? 'Upcoming' : 'Recorded'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-1">
                          {webinar.date} at {webinar.time}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Speaker: {webinar.speaker}
                        </p>
                      </div>
                      <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                        {webinar.status === 'upcoming' ? 'Register' : 'Watch'}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    How long does the verification process take?
                  </h3>
                  <p className="text-muted-foreground">
                    The verification process typically takes 5-10 business days once all required documents are submitted. We'll notify you via email once your organization is verified.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    What percentage does Bridge Needs take from donations?
                  </h3>
                  <p className="text-muted-foreground">
                    Bridge Needs charges a small platform fee to cover payment processing and platform maintenance. For verified organizations, this is 2.9% + ₱15 per transaction for most payment methods.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Can I edit my campaign after it's published?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, you can edit most campaign details even after publication. However, changes to the fundraising goal require approval if the campaign has already received significant donations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto text-center">
            <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Need More Help?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our support team is here to help you succeed. Get in touch for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/support" 
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="/contact" 
                className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Schedule a Call
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;