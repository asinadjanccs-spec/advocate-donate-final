import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Shield, FileText, Clock } from "lucide-react";

const Verify = () => {
  const requirements = [
    {
      icon: FileText,
      title: "Official Registration",
      description: "Valid business or non-profit registration documents"
    },
    {
      icon: Shield,
      title: "BIR Accreditation",
      description: "Bureau of Internal Revenue tax-exempt status (if applicable)"
    },
    {
      icon: CheckCircle,
      title: "Operational History",
      description: "Minimum 1 year of documented organizational activities"
    }
  ];

  const benefits = [
    "Verified badge on your organization profile",
    "Increased donor trust and confidence",
    "Higher visibility in search results",
    "Access to premium fundraising tools",
    "Detailed analytics and reporting",
    "Priority customer support"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Get Verified
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build trust with donors by verifying your organization. Our verification process ensures transparency and credibility.
            </p>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Verification Requirements
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {requirements.map((req, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <req.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {req.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {req.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Verification Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Organization Name *
                    </label>
                    <Input placeholder="Enter organization name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Registration Number *
                    </label>
                    <Input placeholder="SEC/BIR registration number" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Contact Person *
                    </label>
                    <Input placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Position/Title *
                    </label>
                    <Input placeholder="e.g., Executive Director" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input type="email" placeholder="contact@organization.org" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <Input type="tel" placeholder="+63 XXX XXX XXXX" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Organization Address *
                  </label>
                  <Textarea placeholder="Complete address including city and postal code" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mission Statement *
                  </label>
                  <Textarea placeholder="Describe your organization's mission and primary activities" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Website URL
                  </label>
                  <Input placeholder="https://your-organization.org" />
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">Upload Documents</h4>
                  <p className="text-muted-foreground mb-4">
                    Please upload your registration documents, BIR accreditation (if applicable), and any other supporting materials.
                  </p>
                  <Button variant="outline">Choose Files</Button>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="terms" className="rounded border-border" />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I certify that all information provided is accurate and complete. I understand that Advocate&Donate will verify this information.
                  </label>
                </div>

                <Button className="w-full" size="lg">
                  Submit Verification Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Verification Benefits
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Verification Process
            </h2>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground">5-10 business days review</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-muted-foreground">Email notification of status</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Verify;