import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Heart, AlertTriangle, CheckCircle, X } from "lucide-react";

const Guidelines = () => {
  const principles = [
    {
      icon: Heart,
      title: "Authentic Impact",
      description: "All campaigns must serve genuine humanitarian needs with clear, measurable impact goals."
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "Organizations must provide clear information about their mission, use of funds, and regular progress updates."
    },
    {
      icon: Users,
      title: "Respect & Dignity",
      description: "Treat all community members with respect, regardless of background, beliefs, or circumstances."
    },
    {
      icon: CheckCircle,
      title: "Accountability",
      description: "Take responsibility for your actions and commitments to donors and beneficiaries."
    }
  ];

  const allowedActivities = [
    "Fundraising for registered charitable organizations",
    "Disaster relief and emergency response campaigns",
    "Educational and scholarship programs",
    "Healthcare and medical assistance",
    "Food security and nutrition programs",
    "Housing and shelter initiatives",
    "Environmental conservation projects",
    "Community development programs",
    "Support for vulnerable populations",
    "Infrastructure and public benefit projects"
  ];

  const prohibitedActivities = [
    "Fraudulent or misleading campaigns",
    "Personal expenses or non-charitable purposes",
    "Political campaigns or partisan activities",
    "Discriminatory practices based on race, religion, gender, or orientation",
    "Illegal activities or services",
    "Gambling, contests, or sweepstakes",
    "Adult content or services",
    "Hate speech or harassment",
    "Pyramid schemes or multi-level marketing",
    "Campaigns for banned or restricted items"
  ];

  const violations = [
    {
      severity: "Minor Violation",
      consequences: "Warning and request to correct the issue",
      examples: ["Incomplete campaign information", "Late impact reports", "Minor policy violations"]
    },
    {
      severity: "Major Violation", 
      consequences: "Campaign suspension and review period",
      examples: ["Misleading information", "Misuse of funds", "Repeated policy violations"]
    },
    {
      severity: "Severe Violation",
      consequences: "Account termination and legal action if necessary",
      examples: ["Fraud or scams", "Criminal activity", "Intentional deception of donors"]
    }
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
              Community Guidelines
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our guidelines ensure Advocate&Donate remains a safe, trustworthy platform where genuine causes can thrive and donors can give with confidence.
            </p>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Our Core Principles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {principles.map((principle, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <principle.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {principle.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What's Allowed */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 text-success">
                  <CheckCircle className="w-6 h-6" />
                  What's Allowed on Advocate&Donate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  We welcome legitimate charitable activities that make a positive impact in communities. Here's what's allowed on our platform:
                </p>
                <div className="grid gap-3">
                  {allowedActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What's Prohibited */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
                  <X className="w-6 h-6" />
                  What's Not Allowed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  To maintain trust and safety, the following activities are strictly prohibited on Advocate&Donate:
                </p>
                <div className="grid gap-3">
                  {prohibitedActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enforcement */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Guidelines Enforcement
            </h2>
            <div className="grid gap-8">
              {violations.map((violation, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <AlertTriangle className={`w-8 h-8 ${
                          violation.severity === 'Minor Violation' ? 'text-warning' :
                          violation.severity === 'Major Violation' ? 'text-impact' :
                          'text-destructive'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {violation.severity}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          <strong>Consequences:</strong> {violation.consequences}
                        </p>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Examples:</strong>
                          </p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                            {violation.examples.map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Reporting */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  Reporting Violations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Help us maintain community standards by reporting violations. All reports are reviewed by our moderation team.
                </p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">How to Report:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    <li>Use the "Report" button on any campaign or organization page</li>
                    <li>Contact our support team with detailed information</li>
                    <li>Email violations@bridgeneeds.ph with evidence</li>
                    <li>Provide specific details and supporting documentation</li>
                  </ul>
                </div>
                
                <div className="bg-success-light p-4 rounded-lg border border-success">
                  <p className="text-sm text-foreground">
                    <strong>Anonymous Reporting:</strong> All violation reports can be submitted anonymously. 
                    We protect the identity of reporters and take all concerns seriously.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Appeals Process */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Appeals Process
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              If you believe your account or campaign was unfairly sanctioned, you can appeal our decision through our formal appeals process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Submit Appeal
              </button>
              <a 
                href="/support" 
                className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Guidelines;