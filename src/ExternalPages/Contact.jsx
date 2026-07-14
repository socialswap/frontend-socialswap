import React from 'react';

const ContactUs = () => {
  return (
    <div className="max-w-[800px] mx-auto p-5 font-sans mt-16" style={{ marginTop: '4rem' }}>
      <h1 className="text-center text-[#333] dark:text-white text-3xl font-bold mb-6">Contact Us</h1>

      {/* Contact Information Section */}
      <section className="mb-5">
        <h2 className="text-2xl font-semibold mb-3">Get in Touch</h2>
        <p className="text-[16px] leading-[1.6] mb-4">
          Have any questions or need assistance? Feel free to reach out to us via email.
        </p>
        <p className="text-[16px] leading-[1.6] mb-4">
          <strong>Email:</strong>{' '}
          <a href="mailto:contact@socialswap.in" className="text-[#007bff] no-underline hover:underline">contact@socialswap.in</a>
        </p>
        <p className="text-[16px] leading-[1.6] mb-4">
          Or give us a call at <strong>+91 8010803291</strong>.
        </p>
      </section>
    </div>
  );
};

export default ContactUs;
