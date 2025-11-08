import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 mt-20">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p className="text-justify">
          By using SocialSwap.in, you agree to this Privacy Policy, which explains how SocialSwap ("we", "our", or "us") collects, uses, stores, and protects your personal information.
        </p>

        <p className="text-justify">
          We may collect personal data such as your name, email address, phone number, KYC documents, payment details, and communication records to verify users, process transactions, and improve our services. By submitting your information, you grant SocialSwap full rights to use this data for identity verification, fraud prevention, marketing, and business analysis, as permitted by law.
        </p>

        <p className="text-justify">
          We are not responsible for any unauthorised access, hacking, data breach, or technical failure that may result in data loss or disclosure. While we take reasonable security measures, users understand and accept that no system is completely secure.
        </p>

        <p className="text-justify">
          SocialSwap may share user information with trusted partners, payment processors, or verification agencies when required for business operations or legal compliance, and by using our services, you consent to such sharing. We are not liable for how third-party service providers or communication channels (including WhatsApp, Gmail, or YouTube) handle or store your data.
        </p>

        <p className="text-justify">
          Users are solely responsible for keeping their login details confidential and for any actions taken through their accounts. SocialSwap reserves the right to retain, modify, or delete user data at its discretion for security, audit, or legal purposes without prior notice. We do not guarantee permanent data storage or retrieval.
        </p>

        <p className="text-justify">
          By continuing to use our website, you consent to our collection and processing of your personal data as described herein.
        </p>

        <p className="text-justify font-semibold">
          This Privacy Policy is governed by the laws of India, and any disputes shall be subject exclusively to the jurisdiction of the courts in Pune, Maharashtra.
        </p>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <span className="font-semibold">Email: </span>
            <a href="mailto:shubham@socialswap.in" className="text-blue-600 hover:text-blue-800 underline">
              shubham@socialswap.in
            </a>
          </p>
          <p>
            <span className="font-semibold">Phone: </span>
            +91 9423523291
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
