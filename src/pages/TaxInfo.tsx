import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Calculator, Info } from "lucide-react";

const TaxInfo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Tax Information
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Understanding tax benefits and documentation for your charitable donations in the Philippines.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              
              {/* Tax Deductions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-primary" />
                    Tax Deductions in the Philippines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Under the Philippine Tax Code, donations to qualified institutions may be eligible for tax deductions:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Donations to government and qualified non-profit organizations</li>
                    <li>Maximum deduction of 10% of taxable income before deductions</li>
                    <li>Must have proper documentation and receipts</li>
                    <li>Organization must be accredited by the Bureau of Internal Revenue (BIR)</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    Required Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    To claim tax deductions, you'll need the following documents:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">For Cash Donations:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 text-sm">
                        <li>Official donation receipt</li>
                        <li>Organization's BIR accreditation</li>
                        <li>Proof of payment</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">For In-Kind Donations:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 text-sm">
                        <li>Donation acknowledgment letter</li>
                        <li>Fair market value assessment</li>
                        <li>Item description and condition</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Center */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-6 h-6 text-primary" />
                    Download Center
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Access your donation history and tax documents:
                  </p>
                  <div className="space-y-3">
                    <button className="flex items-center gap-2 w-full p-3 border border-border rounded-lg hover:bg-card-hover transition-colors text-left">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground">Annual Donation Summary</div>
                        <div className="text-sm text-muted-foreground">Complete record of your yearly donations</div>
                      </div>
                    </button>
                    <button className="flex items-center gap-2 w-full p-3 border border-border rounded-lg hover:bg-card-hover transition-colors text-left">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground">Individual Receipts</div>
                        <div className="text-sm text-muted-foreground">Download receipts for specific donations</div>
                      </div>
                    </button>
                    <button className="flex items-center gap-2 w-full p-3 border border-border rounded-lg hover:bg-card-hover transition-colors text-left">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground">Tax Deduction Worksheet</div>
                        <div className="text-sm text-muted-foreground">Template to help calculate your deductions</div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-6 h-6 text-primary" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Disclaimer:</strong> This information is provided for educational purposes only and should not be considered as tax advice. Tax laws and regulations may change. Please consult with a qualified tax professional or accountant for advice specific to your situation.
                    </p>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Keep all donation receipts and documentation for at least 3 years</li>
                    <li>Verify that organizations are BIR-accredited before claiming deductions</li>
                    <li>Report donations accurately on your income tax return</li>
                    <li>Consider consulting a tax professional for complex situations</li>
                  </ul>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TaxInfo;