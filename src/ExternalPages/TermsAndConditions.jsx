import React from 'react';
import SEOHead from '../Component/SEO/SEOHead';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <SEOHead title="Terms & Conditions | SocialSwap" />
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl relative">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#6E4BFF] to-[#F4B6D2]">
          Terms and Conditions
        </h1>
        
        <div className="backdrop-blur-2xl bg-white/40 dark:bg-[#110C1F]/60 border border-white/40 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] text-text-secondary">
          
          <p className="text-lg mb-8 font-medium text-text-primary">
            Effective Date: These Terms govern access to and use of the SocialSwap platform. By using SocialSwap, you agree to these Terms.
          </p>

          <div className="space-y-8">
            
            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Platform Role</h2>
              <p className="leading-relaxed">
                SocialSwap provides a marketplace and escrow facilitation service for eligible YouTube channel transactions. SocialSwap is not a party to the underlying ownership rights beyond facilitating the agreed transaction.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Eligibility</h2>
              <p className="leading-relaxed">
                Users must have legal capacity to enter binding agreements and provide accurate registration information.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Seller Obligations</h2>
              <p className="leading-relaxed">
                Sellers must own or be authorized to transfer the listed channel, provide accurate listing information, cooperate with verification, and transfer the agreed ownership or access when requested. Misrepresentation may result in listing removal, account suspension, or legal action.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Buyer Obligations</h2>
              <p className="leading-relaxed">
                Buyers must provide accurate information, complete payments when due, and cooperate with verification and transfer requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Escrow Process</h2>
              <p className="leading-relaxed">
                Buyer funds are handled according to SocialSwap's transaction workflow. SocialSwap may hold, delay, or cancel transactions where fraud, disputes, policy violations, or security concerns are identified.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Verification</h2>
              <p className="leading-relaxed">
                SocialSwap may request identity, ownership, or supporting documentation at any stage and may reject or suspend transactions that cannot be satisfactorily verified.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Fees</h2>
              <p className="leading-relaxed">
                SocialSwap may charge service fees or commissions, which will be disclosed before completion where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Prohibited Conduct</h2>
              <p className="leading-relaxed">
                Users may not submit false information, infringe intellectual property, engage in fraud, attempt unauthorized account recovery, misuse the platform, or violate applicable laws or third-party platform policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Third-Party Services</h2>
              <p className="leading-relaxed">
                Transactions may involve third-party services such as payment processors, email providers, or YouTube. SocialSwap is not responsible for the availability or actions of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, SocialSwap is not liable for indirect, incidental, special, consequential, or business losses arising from platform use or third-party actions. Nothing excludes liability that cannot legally be excluded.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Termination</h2>
              <p className="leading-relaxed">
                SocialSwap may suspend or terminate accounts or listings that violate these Terms or present security, legal, or fraud risks.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Changes</h2>
              <p className="leading-relaxed">
                SocialSwap may update these Terms by publishing revised versions on its website. Continued use constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Governing Law</h2>
              <p className="leading-relaxed">
                These Terms are governed by the laws of India. Subject to applicable law, courts in Pune, Maharashtra shall have jurisdiction.
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

export default TermsAndConditions;
