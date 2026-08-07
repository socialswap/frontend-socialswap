import React from 'react';
import SEOHead from '../Component/SEO/SEOHead';

const RefundAndReturnPolicy = () => {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <SEOHead title="Refund Policy | SocialSwap" />
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl relative">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#6E4BFF] to-[#F4B6D2]">
          Refund Policy
        </h1>
        
        <div className="backdrop-blur-2xl bg-white/40 dark:bg-[#110C1F]/60 border border-white/40 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] text-text-secondary">
          
          <p className="text-lg mb-8 font-medium text-text-primary">
            Effective Date: This Refund Policy governs purchases and sales completed through SocialSwap.
          </p>

          <div className="space-y-8">
            
            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">General Policy</h2>
              <p className="leading-relaxed">
                SocialSwap operates as an escrow-based marketplace facilitating YouTube channel transactions. Except where required by applicable law, completed transactions are final.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Before Completion</h2>
              <p className="leading-relaxed">
                If a transaction cannot proceed because the seller fails verification, cannot transfer ownership, or SocialSwap cancels the transaction due to fraud, policy violations, or security concerns before completion, any eligible buyer funds held by SocialSwap may be refunded after review.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">After Completion</h2>
              <p className="leading-relaxed">
                Once SocialSwap has successfully transferred the agreed channel ownership or access to the buyer and the transaction is marked complete, payments are non-refundable except where required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">No Refund Situations</h2>
              <p className="leading-relaxed">
                Refunds will generally not be provided for changes in channel performance, subscriber loss, view fluctuations, demonetization, copyright or community guideline actions occurring after transfer, account recovery attempts by previous owners after completion where SocialSwap has fulfilled its contractual obligations, changes to YouTube policies, buyer remorse, or business decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Seller Payments</h2>
              <p className="leading-relaxed">
                Seller payouts are released only after SocialSwap verifies the agreed transfer conditions. If fraud, ownership disputes, inaccurate listing information, or policy violations are discovered, SocialSwap may delay, suspend, or cancel payouts while investigating.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Chargebacks</h2>
              <p className="leading-relaxed">
                Unauthorized or fraudulent chargebacks may result in suspension of accounts, recovery actions, and reporting to payment providers or authorities where appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Disputes</h2>
              <p className="leading-relaxed">
                Users should report disputes promptly through the SocialSwap support team. SocialSwap may request documents, communications, and identity verification before reaching a decision.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Limitation</h2>
              <p className="leading-relaxed">
                Nothing in this policy limits any non-waivable rights available under applicable law. SocialSwap reserves the right to amend this policy by publishing an updated version on its website.
              </p>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-white/30 dark:border-white/10">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">Contact Us</h2>
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-text-primary">Email: </span>
                <a href="mailto:official@socialswap.in" className="text-[#6E4BFF] hover:text-[#8A6CFF] transition-colors underline underline-offset-4">
                  official@socialswap.in
                </a>
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RefundAndReturnPolicy;
