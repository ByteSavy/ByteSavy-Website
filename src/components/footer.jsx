'use client';

import Link from 'next/link';
import { company, contact } from '@/lib/company-data';
import { menuItems as navMenuItems } from '@/lib/nav-config';
import { colors } from '@/lib/theme';

const currentYear = new Date().getFullYear();

export default function Footer() {
  const footerLinks = navMenuItems?.length
    ? navMenuItems
    : [
        { label: 'Services', link: '#services', ariaLabel: 'Go to services section' },
        { label: 'Solutions', link: '#solutions', ariaLabel: 'Go to solutions section' },
        { label: 'Contact', link: contact?.website || '#', ariaLabel: 'Visit website' },
      ];

  return (
    <footer
      className="py-10 sm:pt-16 lg:pt-24 bg-white border-t border-gray-200"
      style={{ borderTopColor: colors.primary + '20' }}
    >
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {/* Logo & tagline */}
          <div className="lg:col-span-2 lg:pr-8">
            <Link href="#hero" className="inline-block" aria-label={`${company?.brand_name || 'ByteSavy'} home`}>
              <img
                className="w-auto h-16 sm:h-20"
                src="/main-logo.png"
                alt={company?.brand_name || 'ByteSavy'}
              />
            </Link>
            <p className="text-base leading-relaxed mt-6 max-w-md" style={{ color: colors.darkBackground }}>
              {company?.one_liner || company?.tagline || 'Mapping innovation. Coding intelligence. Driving impact.'}
            </p>
            {contact?.website && (
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-sm font-medium transition-colors hover:underline"
                style={{ color: colors.primary }}
              >
                {contact.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-semibold tracking-wider uppercase opacity-80" style={{ color: colors.darkBackground }}>
              Quick links
            </p>
            <ul className="mt-6 space-y-3">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.link}
                    className="text-base transition-colors hover:underline"
                    style={{ color: colors.darkBackground }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = colors.primary;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = colors.darkBackground;
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="#hero"
                  className="text-base transition-colors hover:underline"
                  style={{ color: colors.darkBackground }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = colors.darkBackground;
                  }}
                >
                  Top
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold tracking-wider uppercase opacity-80" style={{ color: colors.darkBackground }}>
              Contact
            </p>
            <ul className="mt-6 space-y-3">
              {contact?.website && (
                <li>
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base transition-colors hover:underline"
                    style={{ color: colors.darkBackground }}
                  >
                    Website
                  </a>
                </li>
              )}
              {contact?.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="text-base transition-colors hover:underline"
                    style={{ color: colors.darkBackground }}
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <hr className="mt-16 mb-8 border-gray-200" style={{ borderColor: colors.primary + '20' }} />

        <p className="text-sm text-center opacity-80" style={{ color: colors.darkBackground }}>
          © {currentYear} {company?.brand_name || 'ByteSavy'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
