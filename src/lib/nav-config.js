import { colors } from './theme';
import { contact } from './company-data';

export const navItems = [
  {
    label: 'Services',
    bgColor: colors.primary,
    textColor: colors.textLight,
    links: [{ label: 'View all services', href: '#services', ariaLabel: 'Scroll to services' }, 
   
    { label: 'Web Development', href: '#web-development', ariaLabel: 'Scroll to web development' },
    { label: 'GIS Analysis', href: '#graphic-design', ariaLabel: 'Scroll to graphic design' },
   
   
    ],
  },
  {
    label: 'Solutions',
    bgColor: colors.accent1,
    textColor: colors.darkBackground,
    links: [{ label: 'Explore solutions', href: '#solutions', ariaLabel: 'Scroll to solutions' }],
  },
  {
    label: 'Contact',
    bgColor: colors.accent2,
    textColor: colors.darkBackground,
    links: [{ label: 'Get in touch', href: contact?.website || '#', ariaLabel: 'Visit website' }],
  },
];

export const menuItems = [
  { label: 'Services', link: '#services', ariaLabel: 'Go to services section' },
  { label: 'Solutions', link: '#solutions', ariaLabel: 'Go to solutions section' },
  { label: 'Contact', link: contact?.website || '#', ariaLabel: 'Visit website' },
];

export const socialItems = contact?.website
  ? [{ label: 'Website', link: contact.website }]
  : [];
