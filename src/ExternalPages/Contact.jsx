import React from 'react';
import './contact.css'
const ContactUs = () => {
  return (
    <div className="contact-us mt-16" style={{marginTop:'4rem'}}>
      <h1>Contact Us</h1>

      {/* Contact Information Section */}
      <section>
        <h2>Get in Touch</h2>
        <p>
          Have any questions or need assistance? Feel free to reach out to us via email.
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:contact@socialswap.in">contact@socialswap.in</a>
        </p>
        <p>
          Or give us a call at <strong>+91 8010803291</strong>.
        </p>
      </section>
    </div>
  );
};

export default ContactUs;
