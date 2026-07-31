import React from 'react';
import ContactForm from '../../Component/Contact/ContactForm';
import SEOHead from '../../Component/SEO/SEOHead';

const ContactPage = () => {
  return (
    <div className="pt-16 md:pt-24 min-h-[80vh]">
      <SEOHead title="Contact Us | SocialSwap" description="Get in touch with SocialSwap for support and inquiries." />
      <ContactForm />
    </div>
  );
};

export default ContactPage;
