import { colors } from './theme';
import { contact } from './company-data';

export const navItems = [
  {
    label: 'Services',
    bgColor: colors.primary,
    textColor: colors.textLight,
    links: [
      {
        label: 'View all services',
        href: '#services',
        ariaLabel: 'Scroll to services',
      },
    ],
  },
  {
    label: 'Projects',
    bgColor: colors.accent1,
    textColor: colors.darkBackground,
    links: [
      {
        label: 'Explore projects',
        href: '#projects',
        ariaLabel: 'Scroll to projects',
      },
    ],
  },
  {
    label: 'Contact',
    bgColor: colors.accent2,
    textColor: colors.darkBackground,
    links: [
      {
        label: 'Get in touch',
        href: '#contact-us',
        ariaLabel: 'Scroll to contact section',
      },
    ],
  },
];

export const menuItems = [
  { label: 'Services', link: '#services', ariaLabel: 'Go to services section' },
  { label: 'Projects', link: '#projects', ariaLabel: 'Go to projects section' },
  { label: 'Contact', link: '#contact-us', ariaLabel: 'Go to contact section' },
];

export const socialItems = contact?.website
  ? [{ label: 'Website', link: contact.website }]
  : [];
