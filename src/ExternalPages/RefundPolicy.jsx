import React from 'react';

const RefundAndReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 mt-20">
      <h1 className="text-4xl font-bold mb-6">Refund Policy</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p className="text-justify">
          By using SocialSwap.in and engaging in any transaction through our platform, you agree to this Refund Policy.
        </p>

        <p className="text-justify font-semibold text-red-600">
          All payments made to SocialSwap are final and non-refundable under any circumstances once a transaction is completed.
        </p>

        <p className="text-justify">
          SocialSwap is not responsible for and will not issue refunds to buyers if the purchased YouTube channel is deleted, hacked, demonetised, receives copyright strikes, community guideline strikes, or is affected by reused or ineligible content after transfer.
        </p>

        <p className="text-justify">
          Similarly, SocialSwap will not make any payment or compensation to channel owners if a channel provided to us for sale is deleted, hacked, or receives strikes, policy violations, or reuse warnings while in or after our possession.
        </p>

        <p className="text-justify">
          Once ownership or access is transferred, SocialSwap bears no liability for any future issues related to the channel's performance, safety, or compliance with YouTube's terms.
        </p>

        <p className="text-justify">
          Both buyers and sellers understand and agree that it is their sole responsibility to protect their channels, adhere to YouTube policies, and secure their accounts from third-party attacks or recovery attempts by previous owners.
        </p>

        <p className="text-justify">
          SocialSwap acts solely as a mediator and cannot reverse, cancel, or refund any completed transaction. By continuing to use our services, you acknowledge and accept this no-refund policy in full.
        </p>

        <p className="text-justify font-semibold">
          All matters related to refunds or disputes shall be governed by the laws of India and fall under the exclusive jurisdiction of the courts in Pune, Maharashtra.
        </p>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
          <p>
            If you have any questions about this Refund Policy, please contact us at:
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

export default RefundAndReturnPolicy;
