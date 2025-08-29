import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, CheckCircle, AlertTriangle, Users } from "lucide-react";

const Safety = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: "Organization Verification",
      description: "All organizations undergo thorough verification including document checks and background screening before being approved on our platform."
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "All transactions are processed through encrypted, PCI-compliant payment systems with industry-standard security measures."
    },
    {
      icon: Eye,
      title: "Transparent Tracking",
      description: "Every donation is tracked and documented with real-time updates and detailed receipts for complete transparency."
    },
    {
      icon: CheckCircle,
      title: "Verified Impact",
      description: "Organizations provide regular updates and impact reports that are reviewed by our team to ensure funds are used as intended."
    },
    {
      icon: Users,
      title: "Community Reporting",
      description: "Our community helps maintain platform integrity through a robust reporting system for suspicious activities."
    },
    {
      icon: AlertTriangle,
      title: "Fraud Protection",
      description: "Advanced fraud detection systems monitor all activities 24/7 to protect donors and maintain platform security."
    }
  ];

  const donorProtections = [
    "All payment information is encrypted and never stored on our servers",
    "Secure refund process for donations made to unverified organizations",
    "Regular auditing of all verified organizations and their activities",
    "Direct communication channels with organizations for transparency",
    "Detailed impact reporting requirements for all campaigns",
    "Option to designate specific use of funds when donating"
  ];

  const orgProtections = [
    "Protection against fraudulent chargebacks and disputes",
    "Secure fund disbursement with identity verification",
    "Data protection and privacy compliance (DPA 2012)",
    "Legal support for disputes and compliance issues",
    "Regular security updates and platform monitoring",
    "Backup and recovery systems for all organizational data"
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
              Safety & Trust
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your security and trust are our top priorities. Learn about the measures we take to ensure a safe and transparent giving experience.
            </p>
          </div>
        </section>

        {/* Safety Features */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              How We Keep You Safe
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safetyFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
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

        {/* Donor Protection */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Donor Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  We implement multiple layers of protection to ensure your donations reach legitimate causes and your personal information remains secure.
                </p>
                <div className="grid gap-4">
                  {donorProtections.map((protection, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{protection}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Organization Protection */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Lock className="w-6 h-6 text-primary" />
                  Organization Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Verified organizations receive comprehensive protection and support to focus on their mission while we handle security and compliance.
                </p>
                <div className="grid gap-4">
                  {orgProtections.map((protection, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{protection}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Verification Process */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Our Verification Process
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">1</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Document Review
                </h3>
                <p className="text-muted-foreground text-sm">
                  Comprehensive review of registration documents, tax status, and legal compliance
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">2</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Background Check
                </h3>
                <p className="text-muted-foreground text-sm">
                  Verification of leadership, operational history, and reputation within the community
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">3</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Site Validation
                </h3>
                <p className="text-muted-foreground text-sm">
                  On-site or virtual inspection to confirm operational capacity and legitimate activities
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Verification Complete
                </h3>
                <p className="text-muted-foreground text-sm">
                  Approved organizations receive verified status and access to all platform features
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reporting & Security */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Report Suspicious Activity
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Help us maintain a safe platform by reporting any suspicious activities, fraudulent campaigns, or security concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Report an Issue
              </button>
              <a 
                href="/contact" 
                className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Contact Security Team
              </a>
            </div>
          </div>
        </section>

        {/* Compliance & Certifications */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Compliance & Certifications
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  PCI DSS Compliant
                </h3>
                <p className="text-muted-foreground text-sm">
                  Payment Card Industry Data Security Standard certified for secure payment processing
                </p>
              </div>
              <div>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  DPA 2012 Compliant
                </h3>
                <p className="text-muted-foreground text-sm">
                  Full compliance with Philippines Data Privacy Act for personal information protection
                </p>
              </div>
              <div>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  BSP Registered
                </h3>
                <p className="text-muted-foreground text-sm">
                  Registered with Bangko Sentral ng Pilipinas for financial service compliance
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Safety;