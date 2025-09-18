import { Link } from "wouter";

export default function Footer() {
  const footerSections = [
    {
      title: "Marketplace",
      links: [
        { href: "/marketplace", label: "Browse Products" },
        { href: "/marketplace?category=all", label: "Categories" },
        { href: "/artists", label: "Featured Artists" },
      ],
    },
    {
      title: "For Artisans",
      links: [
        { href: "/dashboard", label: "Sell Your Work" },
        { href: "/resources", label: "Artist Resources" },
        { href: "/success-stories", label: "Success Stories" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/help", label: "Help Center" },
        { href: "/contact", label: "Contact Us" },
        { href: "/privacy", label: "Privacy Policy" },
      ],
    },
  ];

  return (
    <footer className="bg-card/50 py-12 mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-mono font-bold mb-4 gradient-text" data-testid="text-footer-logo">
              ArtisanAI
            </h3>
            <p className="text-muted-foreground" data-testid="text-footer-description">
              Connecting artisans with art lovers through AI-powered discovery.
            </p>
          </div>
          
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4" data-testid={`text-footer-section-${section.title.toLowerCase().replace(" ", "-")}`}>
                {section.title}
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p data-testid="text-footer-copyright">
            &copy; 2024 ArtisanAI. All rights reserved. Made with ❤️ for artisans worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
