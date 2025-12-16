import Link from "next/link";
import { AuroraLogo } from "@/components/icons";

interface NavLink {
  label: string;
  linkType: "internal" | "external" | "relative" | "anchor";
  internalLink?: {
    _type?: string;
    slug: {
      current: string;
    };
  };
  externalUrl?: string;
  relativeUrl?: string;
  anchor?: string;
}

interface LinkColumn {
  title: string;
  links: NavLink[];
}

interface FooterNavigation {
  description?: string;
  linkColumns?: LinkColumn[];
  socialLinks?: Array<{ platform: string; url: string }>;
  bottomLinks?: NavLink[];
  copyrightText?: string;
}

export interface FooterProps {
  settings?: {
    title?: string;
    description?: string;
    footerNavigation?: FooterNavigation;
    // Legacy fields for backwards compatibility
    socialLinks?: Array<{ platform: string; url: string }>;
    footerText?: string;
  };
}

// Fallback link columns when none configured
const defaultLinkColumns: LinkColumn[] = [
  { title: "Product", links: [
    { label: "Features", linkType: "anchor", anchor: "#features" },
    { label: "Pricing", linkType: "anchor", anchor: "#pricing" },
    { label: "Changelog", linkType: "anchor", anchor: "#changelog" },
  ]},
  { title: "Company", links: [
    { label: "About", linkType: "anchor", anchor: "#about" },
    { label: "Blog", linkType: "internal" },
    { label: "Careers", linkType: "anchor", anchor: "#careers" },
  ]},
  { title: "Resources", links: [
    { label: "Documentation", linkType: "anchor", anchor: "#docs" },
    { label: "Support", linkType: "anchor", anchor: "#support" },
  ]},
  { title: "Legal", links: [
    { label: "Privacy", linkType: "anchor", anchor: "#privacy" },
    { label: "Terms", linkType: "anchor", anchor: "#terms" },
  ]},
];

const currentYear = new Date().getFullYear();

export function Footer({ settings }: FooterProps) {
  const getInternalLinkHref = (internalLink?: NavLink["internalLink"]) => {
    if (!internalLink?.slug?.current) return "/";

    const slug = internalLink.slug.current;

    // Route based on document type
    switch (internalLink._type) {
      case "product":
        return `/products/${slug}`;
      case "collection":
        return `/collections/${slug}`;
      case "page":
      default:
        return `/${slug}`;
    }
  };

  const getHref = (item: NavLink) => {
    switch (item.linkType) {
      case "internal":
        return getInternalLinkHref(item.internalLink);
      case "external":
        return item.externalUrl || "#";
      case "relative":
        return item.relativeUrl || "#";
      case "anchor":
        return item.anchor || "#";
      default:
        return "#";
    }
  };

  // Use new structure with fallback to legacy fields
  const footerNav = settings?.footerNavigation;
  const description = footerNav?.description || settings?.description;
  const socialLinks = footerNav?.socialLinks || settings?.socialLinks || [];
  const linkColumns = footerNav?.linkColumns || defaultLinkColumns;
  const bottomLinks = footerNav?.bottomLinks || [];
  const copyrightText = footerNav?.copyrightText || settings?.footerText;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <AuroraLogo className="mb-4" />
            <p className="text-[var(--foreground-muted)] mb-6">
              {description || "The modern platform for building exceptional digital experiences."}
            </p>
            <div className="flex gap-4">
              {socialLinks.length > 0 ? (
                socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors capitalize"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.platform}
                  </a>
                ))
              ) : (
                ["Twitter", "GitHub", "Discord"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {social}
                  </a>
                ))
              )}
            </div>
          </div>

          {linkColumns.map((column, colIndex) => (
            <div key={colIndex}>
              <h4 className="footer-heading">{column.title}</h4>
              <ul className="space-y-1">
                {column.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={getHref(link)}
                      className="footer-link"
                      target={link.linkType === "external" ? "_blank" : undefined}
                      rel={link.linkType === "external" ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>{copyrightText ? `© ${currentYear} ${copyrightText}` : `© ${currentYear} Aurora. All rights reserved.`}</p>
          <div className="flex items-center gap-6">
            {bottomLinks.length > 0 ? (
              bottomLinks.map((link, index) => (
                <Link
                  key={index}
                  href={getHref(link)}
                  className="hover:text-[var(--foreground)] transition-colors"
                  target={link.linkType === "external" ? "_blank" : undefined}
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <>
                <Link href="#" className="hover:text-[var(--foreground)] transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-[var(--foreground)] transition-colors">
                  Terms of Service
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
