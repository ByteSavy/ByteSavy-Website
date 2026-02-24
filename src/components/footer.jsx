'use client';

import { useState } from 'react';
import Link from 'next/link';
import { company, contact, location } from '@/lib/company-data';
import { menuItems as navMenuItems } from '@/lib/nav-config';
import './footer.css';

const currentYear = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: 'What makes ByteSavy different from other GIS & AI companies?',
    answer:
      'ByteSavy uniquely combines deep GIS expertise with cutting-edge AI capabilities. We deliver end-to-end spatial intelligence solutions—from satellite image processing to custom AI dashboards—giving clients a single partner for all their geospatial needs.',
  },
  {
    question: 'How secure is my data when working with ByteSavy?',
    answer:
      'We follow industry-standard security practices including end-to-end encryption, secure cloud infrastructure, and strict access controls. All client data is handled with the utmost confidentiality and in compliance with relevant data protection regulations.',
  },
  {
    question: 'Can ByteSavy build a custom GIS solution for my organization?',
    answer:
      'Absolutely. We specialize in tailor-made GIS platforms, mapping dashboards, and spatial analytics tools built specifically for your workflows. Our team handles everything from architecture to deployment.',
  },
  {
    question: 'What sectors does ByteSavy serve?',
    answer:
      'We work across government, enterprises, research institutions, and international private-sector clients—delivering scalable solutions for urban planning, environmental monitoring, logistics, agriculture, and more.',
  },
];

export default function Footer() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleFaqToggle = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  };

  const footerLinks = navMenuItems?.length
    ? navMenuItems
    : [
      { label: 'Services', link: '#services' },
      { label: 'Solutions', link: '#solutions' },
      { label: 'Contact', link: '#contact-us' },
    ];

  return (
    <footer id="footer" className="bs-footer">
      {/* ───────────── CONTACT US ───────────── */}
      <section id="contact-us" className="bs-contact-section">
        <div className="bs-container">
          <div className="bs-contact-grid">
            {/* Left – text */}
            <div className="bs-contact-left">
              <h2 className="bs-contact-heading">Contact Us</h2>
              <p className="bs-contact-sub">
                Email, call, or complete the form to learn how ByteSavy can solve your spatial
                challenges.
              </p>
              <div className="bs-contact-info-list">
                <a
                  href={contact?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bs-contact-link"
                >
                  {contact?.website?.replace(/^https?:\/\//, '')}
                </a>
                <a href={`tel:${contact?.phone}`} className="bs-contact-link">
                  {contact?.phone}
                </a>
                {contact?.email && (
                  <a href={`mailto:${contact.email}`} className="bs-contact-link">
                    {contact.email}
                  </a>
                )}
              </div>

              <div className="bs-contact-categories">
                <div className="bs-contact-category">
                  <p className="bs-cat-title">Customer Support</p>
                  <p className="bs-cat-desc">
                    Our team is available around the clock to address any concerns or queries you
                    may have.
                  </p>
                </div>
                <div className="bs-contact-category">
                  <p className="bs-cat-title">Feedback & Suggestions</p>
                  <p className="bs-cat-desc">
                    We value your feedback and are continuously working to improve ByteSavy.
                  </p>
                </div>
                <div className="bs-contact-category">
                  <p className="bs-cat-title">Media Inquiries</p>
                  <p className="bs-cat-desc">
                    For media-related questions, please contact us at{' '}
                    <a href="mailto:media@bytesavy.tech" className="bs-cat-link">
                      media@bytesavy.tech
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right – form card */}
            <div className="bs-contact-right">
              <div className="bs-form-card">
                <h3 className="bs-form-title">Get in Touch</h3>
                <p className="bs-form-sub">You can reach us anytime</p>
                {submitted ? (
                  <div className="bs-form-success">
                    <span className="bs-form-success-icon">✓</span>
                    <p>Thanks! We'll be in touch shortly.</p>
                  </div>
                ) : (
                  <form className="bs-form" onSubmit={handleSubmit}>
                    <div className="bs-form-row">
                      <div className="bs-form-group">
                        <input
                          id="contact-firstName"
                          type="text"
                          name="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="bs-input"
                          required
                        />
                      </div>
                      <div className="bs-form-group">
                        <input
                          id="contact-lastName"
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="bs-input"
                          required
                        />
                      </div>
                    </div>
                    <div className="bs-form-group bs-input-icon-wrap">
                      <span className="bs-input-icon">✉</span>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bs-input bs-input-with-icon"
                        required
                      />
                    </div>
                    <div className="bs-form-group">
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bs-input"
                      />
                    </div>
                    <div className="bs-form-group">
                      <textarea
                        id="contact-message"
                        name="message"
                        placeholder="How can we help?"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bs-input bs-textarea"
                        rows={3}
                        required
                      />
                    </div>
                    <button id="contact-submit" type="submit" className="bs-submit-btn">
                      Submit
                    </button>
                    <p className="bs-form-legal">
                      By contacting us, you agree to our{' '}
                      <a href="#" className="bs-form-legal-link">
                        Terms of service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="bs-form-legal-link">
                        Privacy Policy
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── LOCATION ───────────── */}
      <section id="location" className="bs-location-section">
        <div className="bs-container">
          <div className="bs-location-grid">
            {/* Map embed */}
            <div className="bs-map-wrap">
              <iframe
                title="ByteSavy HQ"
                className="bs-map-iframe"
                src="https://maps.google.com/maps?q=NSTP+NUST+Islamabad+Pakistan&t=m&z=14&output=embed&iwloc=near"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Location info */}
            <div className="bs-location-info">
              <p className="bs-location-label">Our Location</p>
              <h2 className="bs-location-heading">Connecting Near and Far</h2>
              <div className="bs-location-block">
                <p className="bs-location-block-title">Headquarters</p>
                <p className="bs-location-block-name">{company?.brand_name}</p>
                <p className="bs-location-block-addr">
                  {location?.headquarters?.address_line}
                  <br />
                  {location?.headquarters?.city}, {location?.headquarters?.country}{' '}
                  {location?.headquarters?.postal_code}
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=NSTP+NUST+Islamabad+Pakistan"
                target="_blank"
                rel="noopener noreferrer"
                className="bs-map-link"
              >
                Open Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── FAQS ───────────── */}
      <section id="faqs" className="bs-faq-section">
        <div className="bs-container">
          <div className="bs-faq-grid">
            {/* Left – heading */}
            <div className="bs-faq-left">
              <p className="bs-faq-label">FAQ</p>
              <h2 className="bs-faq-heading">Do you have any questions for us?</h2>
              <p className="bs-faq-sub">
                If there are any questions you want to ask, we will answer all of your questions.
              </p>
              <form className="bs-faq-email-form" onSubmit={(e) => e.preventDefault()}>
                <div className="bs-faq-email-input-wrap">
                  <span className="bs-faq-email-icon">✉</span>
                  <input
                    id="faq-email"
                    type="email"
                    placeholder="Enter your email"
                    className="bs-faq-email-input"
                  />
                </div>
                <button id="faq-submit" type="submit" className="bs-faq-submit-btn">
                  Submit
                </button>
              </form>
            </div>

            {/* Right – accordion */}
            <div className="bs-faq-right">
              {FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className={`bs-faq-item ${openFaq === idx ? 'bs-faq-item--open' : ''}`}
                >
                  <button
                    id={`faq-item-${idx}`}
                    className="bs-faq-question"
                    onClick={() => handleFaqToggle(idx)}
                    aria-expanded={openFaq === idx}
                  >
                    <span>{item.question}</span>
                    <span className="bs-faq-chevron">{openFaq === idx ? '−' : '+'}</span>
                  </button>
                  <div className="bs-faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── CTA BANNER ───────────── */}
      <section className="bs-cta-section">
        <div className="bs-cta-overlay" />
        <div className="bs-cta-content">
          <h2 className="bs-cta-heading">
            Ready to experience the power of<br />Spatial Intelligence with ByteSavy?
          </h2>
          <div className="bs-cta-btns">
            <a href="#contact-us" id="cta-get-started" className="bs-cta-btn bs-cta-btn--primary">
              Get Started
            </a>
            <a href="#location" id="cta-learn-more" className="bs-cta-btn bs-cta-btn--ghost">
              Learn more →
            </a>
          </div>
        </div>
      </section>

      {/* ───────────── BOTTOM FOOTER BAR ───────────── */}
      <div className="bs-footer-bar">
        <div className="bs-container bs-footer-bar-inner">
          {/* Logo + App store badges */}
          <div className="bs-footer-brand">
            <Link href="#hero" aria-label="ByteSavy home">
              <img src="/main-logo.png" alt={company?.brand_name || 'ByteSavy'} className="bs-footer-logo" />
            </Link>
            <div className="bs-store-badges">
              <a href="#" id="footer-appstore" className="bs-store-badge" aria-label="Download on App Store">
                <div className="bs-badge-inner">
                  <span className="bs-badge-icon">🍎</span>
                  <div>
                    <span className="bs-badge-sub">Download on the</span>
                    <span className="bs-badge-main">App Store</span>
                  </div>
                </div>
              </a>
              <a href="#" id="footer-playstore" className="bs-store-badge" aria-label="Get it on Google Play">
                <div className="bs-badge-inner">
                  <span className="bs-badge-icon">▶</span>
                  <div>
                    <span className="bs-badge-sub">Get it on</span>
                    <span className="bs-badge-main">Google Play</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="bs-footer-cols">
            <div className="bs-footer-col">
              <p className="bs-footer-col-title">What we do</p>
              <ul className="bs-footer-col-list">
                <li><Link href="#services">GIS Development</Link></li>
                <li><Link href="#services">AI Analytics</Link></li>
                <li><Link href="#services">Remote Sensing</Link></li>
                <li><Link href="#services">Consulting</Link></li>
              </ul>
            </div>
            <div className="bs-footer-col">
              <p className="bs-footer-col-title">Use ByteSavy</p>
              <ul className="bs-footer-col-list">
                <li><Link href="#hero">Web App</Link></li>
                <li><a href="#">Android</a></li>
                <li><a href="#">iPhone</a></li>
                <li><a href="#">Desktop</a></li>
              </ul>
            </div>
            <div className="bs-footer-col">
              <p className="bs-footer-col-title">About</p>
              <ul className="bs-footer-col-list">
                <li><Link href="#hero">Blog</Link></li>
                <li><Link href="#hero">Meet the Team</Link></li>
                <li><Link href="#contact-us">Contact Us</Link></li>
              </ul>
            </div>
            <div className="bs-footer-col">
              <p className="bs-footer-col-title">Social Media</p>
              <ul className="bs-footer-col-list">
                <li>
                  <a href={contact?.website} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li><a href="#">Twitter / X</a></li>
                <li><a href="#">GitHub</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bs-footer-copy">
          <div className="bs-container">
            <p>© {currentYear} {company?.brand_name || 'ByteSavy'}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
