'use client';

import { useState, useEffect } from 'react';

const SCROLL_THRESHOLD = 20;
const NAV_HEIGHT = 64;
const NAV_TOP_MARGIN = 8; // extra gap below nav before content

const CardNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = (items || []).map((item) => ({
    label: item.label,
    href: item.links?.[0]?.href || '#'
  }));

  const isDarkNav = (baseColor || '').toLowerCase() === '#0a1a33';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] w-full ${className}`}
        style={{ height: NAV_HEIGHT + NAV_TOP_MARGIN }}
      >
        <nav
          className="flex h-16 w-full items-center justify-start gap-4 px-4 sm:px-6 md:px-8 pt-4 transition-all duration-300"
          style={{
            backgroundColor: scrolled ? baseColor : 'transparent',
            boxShadow: scrolled
              ? '0 4px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)'
              : 'none'
          }}
        >
          <a href="/" className="flex shrink-0 items-center" aria-label={logoAlt}>
            <img src={logo} alt={logoAlt} className="h-9 brightness-0 invert" />
          </a>

          <div className="ml-auto flex items-center gap-5 sm:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium no-underline opacity-90 transition-opacity hover:opacity-100 sm:text-base"
                style={{ color: menuColor || '#000' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#contact-us"
            className="shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold border transition-colors hover:opacity-100"
            style={
              isDarkNav
                ? {
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    borderColor: '#ffffff'
                  }
                : {
                    backgroundColor: buttonBgColor,
                    color: buttonTextColor,
                    borderColor: 'transparent'
                  }
            }
          >
            Contact us
          </a>
        </nav>
      </header>
      {/* Spacer so page content is not hidden under fixed nav */}
      <div style={{ height: NAV_HEIGHT + NAV_TOP_MARGIN }} aria-hidden />
    </>
  );
};

export default CardNav;
export { NAV_HEIGHT };
