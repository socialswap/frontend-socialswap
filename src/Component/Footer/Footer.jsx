import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaInstagram,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPlay,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/blogs' || location.pathname === '/blogs/') {
    return null;
  }

  const handleMakeOffer = () => {
    const message = encodeURIComponent(
      `Hello, I'm interested in buying the YouTube channel. Can we discuss the details?`
    );
    const whatsappUrl = `https://wa.me/+919423523291?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const linkSections = [
    {
      title: 'COMPANY',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', action: handleMakeOffer },
      ],
    },
    {
      title: 'POLICIES',
      links: [
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms & Conditions', to: '/terms-and-conditions' },
        { label: 'Refund Policy', to: '/refund-policy' },
      ],
    },
    {
      title: 'INFORMATION',
      links: [
        { label: 'My Account', to: '/profile' },
        { label: 'Login', to: '/login' },
        { label: 'My Cart', to: '/cart' },
        { label: 'Wishlist', to: '/wishlist', disabled: true },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'All Channels', to: '/channels' },
        { label: 'Sell Channel', to: '/user/upload-channel' },
        { label: 'How To', to: '/how-to' },
        { label: 'Grow Your Channels', to: '/grow' },
      ],
    },
  ];

  const contactDetails = [
    {
      Icon: FaMapMarkerAlt,
      label: 'Baner, Pune',
    },
    {
      Icon: FaPhone,
      label: '+91 9423523291',
    },
    {
      Icon: FaEnvelope,
      label: (
        <div className="space-y-1">
          <p>4spalkarbusiness@gmail.com</p>
          <p>shubham@socialswap.in</p>
        </div>
      ),
    },
  ];

  const socialLinks = [
    {
      href: 'https://youtube.com/@shubhzlord?si=BiP10uT0YN3Zm0nq',
      Icon: FaYoutube,
      label: 'YouTube',
    },
    {
      href: 'https://www.instagram.com/socialswap.in?igsh=ZDhwNWtpczNjcDlp&utm_source=qr',
      Icon: FaInstagram,
      label: 'Instagram',
    },
    {
      href: 'https://wa.me/919423523291',
      Icon: FaWhatsapp,
      label: 'WhatsApp',
    },
    {
      href: 'https://twitter.com',
      Icon: FaTwitter,
      label: 'Twitter',
    },
  ];

  const renderLink = (link) => {
    const baseClasses =
      'group relative inline-flex items-center text-sm font-semibold uppercase tracking-[0.16em] text-text-secondary transition-colors duration-300 hover:text-text-primary';

    const underline = (
      <span className="pointer-events-none absolute left-0 -bottom-2 h-[3px] w-0 rounded-full bg-purple-primary shadow-[0_0_0_rgba(124,58,237,0)] transition-all duration-300 ease-out group-hover:w-full group-hover:shadow-purple-glow" />
    );

    if (link.disabled) {
      return (
        <span
          key={link.label}
          className="inline-flex items-center text-sm uppercase tracking-[0.16em] text-text-disabled"
        >
          {link.label}
        </span>
      );
    }

    if (link.action) {
      return (
        <button
          key={link.label}
          type="button"
          onClick={link.action}
          className={`${baseClasses} focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary`}
        >
          <span>{link.label}</span>
          {underline}
        </button>
      );
    }

    return (
      <Link
        key={link.label}
        to={link.to}
        className={`${baseClasses} focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary`}
      >
        <span>{link.label}</span>
        {underline}
      </Link>
    );
  };

  return (
    <footer className="relative overflow-hidden bg-bg-secondary px-4 pt-16 pb-12 text-text-secondary border-t border-border-color/20 sm:px-6 lg:px-8 transition-all duration-300">
      <FaPlay
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 text-[36rem] text-purple-primary/5 dark:text-purple-primary/10"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bg-secondary via-transparent to-bg-secondary opacity-60" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 grid gap-12 lg:grid-cols-[1.3fr,1fr]">
          <div className="relative">
            <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-purple-primary opacity-20 blur-3xl" />
            <Link to="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-tight text-text-primary">
                Social<span className="text-purple-primary">Swap</span>
              </span>
            </Link>
            <p className="mt-4 max-w-lg text-base text-text-secondary">
              Empowering YouTube Creators to Grow, Sell, and Succeed.
            </p>

            <div className="mt-6 space-y-4 text-text-secondary">
              {contactDetails.map(({ Icon, label }) => (
                <div key={Icon.displayName || label} className="flex items-start gap-3">
                  <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-purple-primary" />
                  <div className="text-sm md:text-base">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {linkSections.map(({ title, links }) => (
              <div key={title} className="space-y-4">
                <h3 className="relative inline-block text-sm font-semibold uppercase tracking-[0.3em] text-text-primary">
                  {title}
                  <span className="absolute left-0 -bottom-2 h-[2px] w-full rounded-full bg-purple-primary shadow-purple-glow" />
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>{renderLink(link)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm font-medium text-text-primary sm:text-base">
          <span>Baner, Pune</span>
          <span className="h-2 w-2 rounded-full bg-purple-primary opacity-80" />
          <span>+91 9423523291</span>
          <span className="h-2 w-2 rounded-full bg-purple-primary opacity-80" />
          <span>4spalkarbusiness@gmail.com</span>
          <span className="h-2 w-2 rounded-full bg-purple-primary opacity-80" />
          <span>shubham@socialswap.in</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          {socialLinks.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-purple-primary/40 text-text-primary transition-all duration-300 hover:scale-105 hover:border-purple-primary hover:text-purple-primary hover:shadow-purple-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              <Icon className="h-6 w-6" />
            </a>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-text-secondary">
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-purple-primary shadow-purple-glow" />
          <p className="text-text-muted">
            © 2025 SocialSwap. All rights reserved.
          </p>
          <p className="mt-2 text-text-muted">Built for creators, powered by trust.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;