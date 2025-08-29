import { Button } from "@/components/ui/button";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "For Donors",
      links: [
        { label: "Browse Organizations", href: "/organizations" },
        { label: "Active Campaigns", href: "/campaigns" },
        { label: "Impact Stories", href: "/stories" },
        { label: "Tax Information", href: "/tax-info" }
      ]
    },
    {
      title: "For Organizations",
      links: [
        { label: "Get Verified", href: "/verify" },
        { label: "Create Campaign", href: "/create-campaign" },
        { label: "Resources", href: "/resources" },
        { label: "Support Center", href: "/support" }
      ]
    },
    {
      title: "Platform",
      links: [
        { label: "How It Works", href: "/how-it-works" },
        { label: "Safety & Trust", href: "/safety" },
        { label: "Community Guidelines", href: "/guidelines" },
        { label: "API Documentation", href: "/api" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Bridge Needs", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press Kit", href: "/press" },
        { label: "Contact Us", href: "/contact" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Bridge Needs</span>
              </div>
              <p className="text-white/80 mb-6 max-w-md">
                Connecting generosity with genuine need. Building stronger communities 
                through transparent, impactful giving in the Philippines and beyond.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-white/80">
                  <Mail className="w-4 h-4 mr-3" />
                  <span className="text-sm">hello@bridgeneeds.ph</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Phone className="w-4 h-4 mr-3" />
                  <span className="text-sm">+63 2 1234 5678</span>
                </div>
                <div className="flex items-center text-white/80">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span className="text-sm">Manila, Philippines</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                    asChild
                  >
                    <a href={social.href} aria-label={social.label}>
                      <social.icon className="w-5 h-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-white/80 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-white/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Stay Connected
              </h3>
              <p className="text-white/80 text-sm">
                Get updates on new campaigns, impact stories, and platform features.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[280px]"
              />
              <Button variant="hero" className="bg-white text-primary hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-white/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-white/60 text-sm">
              © 2024 Bridge Needs. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-white/60 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-white/60 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;