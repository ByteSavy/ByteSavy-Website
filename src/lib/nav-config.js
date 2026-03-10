import { colors } from './theme';
import { contact } from './company-data';

export const navItems = [
  {
    label: 'How we work',
    bgColor: colors.primary,
    textColor: colors.textLight,
    links: [
      {
        label: 'How we work',
        href: '#how-we-work',
        ariaLabel: 'Scroll to how we work section',
      },
    ],
  },
  {
    label: 'Our services',
    bgColor: colors.accent1,
    textColor: colors.darkBackground,
    links: [
      {
        label: 'Our services',
        href: '#services',
        ariaLabel: 'Scroll to services section',
      },
    ],
  },
  {
    label: 'Our work',
    bgColor: colors.accent2,
    textColor: colors.darkBackground,
    links: [
      {
        label: 'Our work',
        href: '#projects',
        ariaLabel: 'Scroll to projects section',
      },
    ],
  },
  {
    label: 'Map what’s next',
    bgColor: colors.primary,
    textColor: colors.textLight,
    links: [
      {
        label: 'Map what’s next',
        href: '#framer6',
        ariaLabel: 'Scroll to Ready to map what’s next section',
      },
    ],
  },
  {
    label: 'FAQs',
    bgColor: colors.accent1,
    textColor: colors.darkBackground,
    links: [
      {
        label: 'FAQs',
        href: '#faqs',
        ariaLabel: 'Scroll to FAQs section',
      },
    ],
  },
];

export const menuItems = [
  { label: 'How we work', link: '#how-we-work', ariaLabel: 'Go to how we work section' },
  { label: 'Our services', link: '#services', ariaLabel: 'Go to services section' },
  { label: 'Our work', link: '#projects', ariaLabel: 'Go to projects section' },
  { label: 'Map what’s next', link: '#framer6', ariaLabel: 'Go to Ready to map what’s next section' },
  { label: 'FAQs', link: '#faqs', ariaLabel: 'Go to FAQs section' },
];

export const socialItems = contact?.website
  ? [{ label: 'Website', link: contact.website }]
  : [];
