import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 mt-20">
      <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p className="text-justify">
          By using SocialSwap.in, you agree that SocialSwap acts only as a mediator platform for buying and selling YouTube channels. Sellers must transfer full ownership of their YouTube channel to SocialSwap before receiving payment, and buyers must make full payment in advance before channel access is shared through WhatsApp or another secure method. Once the channel credentials are transferred to the buyer, the transaction is considered final and non-refundable.
        </p>

        <p className="text-justify">
          SocialSwap is not affiliated with YouTube, Google, or Alphabet Inc., and is not responsible for any deletion, copyright strikes, community guideline strikes, reuse content issues, demonetisation, suspension, or hacking that may occur before, during, or after the transaction.
        </p>

        <p className="text-justify">
          If SocialSwap takes access of any channel temporarily for verification or review without paying the seller immediately, we are not responsible for any loss, deletion, strike, or policy violation during that period.
        </p>

        <p className="text-justify">
          Sellers confirm that they are the rightful owners of the channels and that all provided information is accurate. Buyers acknowledge that they are purchasing the channel "as is" and accept all associated risks.
        </p>

        <p className="text-justify">
          SocialSwap reserves the right to charge a commission between 5% to 15% per transaction, and all payments made are final. SocialSwap is not liable for any loss of data, revenue, or access after transfer, and users agree to indemnify SocialSwap and its team against any claims arising from the use of the service.
        </p>

        <p className="text-justify font-semibold">
          All matters related to refunds or disputes shall be governed by the laws of India and fall under the exclusive jurisdiction of the courts in Pune, Maharashtra.
        </p>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
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

export default TermsAndConditions;
