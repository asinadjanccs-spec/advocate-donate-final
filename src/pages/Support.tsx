import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Phone, Mail, Clock, Search, BookOpen } from "lucide-react";

const Support = () => {
  const supportChannels = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      availability: "Mon-Fri, 9AM-6PM PHT"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      action: "Send Email",
      availability: "Response within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support specialists",
      action: "Call Now",
      availability: "Mon-Fri, 10AM-5PM PHT"
    }
  ];

  const faqCategories = [
    {
      title: "Account & Setup",
      questions: [
        "How do I create an organization account?",
        "What documents do I need for verification?",
        "How do I reset my password?",
        "Can I change my organization type?"
      ]
    },
    {
      title: "Campaigns & Donations",
      questions: [
        "How do I create a fundraising campaign?",
        "What payment methods do you accept?",
        "How long does it take to receive donations?",
        "Can I edit my campaign after publishing?"
      ]
    },
    {
      title: "Fees & Pricing",
      questions: [
        "What are the platform fees?",
        "When are fees deducted?",
        "Are there any hidden charges?",
        "How do I get lower fees?"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Support Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're here to help you succeed. Find answers, get assistance, and make the most of Bridge Needs.
            </p>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search for help articles, guides, and FAQs..." 
                className="pl-12 py-4 text-lg"
              />
            </div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Get Help Your Way
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {supportChannels.map((channel, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <channel.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {channel.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {channel.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{channel.availability}</span>
                    </div>
                    <Button className="w-full">
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Support Category *
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account & Setup</SelectItem>
                        <SelectItem value="campaigns">Campaigns & Donations</SelectItem>
                        <SelectItem value="technical">Technical Issues</SelectItem>
                        <SelectItem value="billing">Billing & Fees</SelectItem>
                        <SelectItem value="verification">Verification</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Priority Level
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <Input placeholder="Brief description of your issue" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea 
                    placeholder="Please provide as much detail as possible about your issue or question..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button className="w-full" size="lg">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {faqCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.questions.map((question, idx) => (
                        <li key={idx}>
                          <a 
                            href="#" 
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {question}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Other Ways to Reach Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">support@bridgeneeds.ph</p>
              </div>
              <div>
                <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-muted-foreground">+63 2 1234 5678</p>
              </div>
              <div>
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                <p className="text-muted-foreground">Mon-Fri, 9AM-6PM PHT</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;