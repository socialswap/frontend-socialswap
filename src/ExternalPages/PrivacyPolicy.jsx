import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../Component/SEO/SEOHead';
import { SafetyOutlined, MailOutlined, SafetyCertificateOutlined, DatabaseOutlined, TeamOutlined, UserOutlined, GlobalOutlined, ClockCircleOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      icon: <DatabaseOutlined className="text-[#6E4BFF]" />,
      content: 'We may collect information including your name, email address, phone number, account details, identity verification documents, payment-related information, communication history, transaction records, device information, IP address, browser information, cookies, and any content you voluntarily submit through the platform.'
    },
    {
      title: 'How We Use Your Information',
      icon: <InfoCircleOutlined className="text-pink-500" />,
      content: 'Your information may be used to create and manage accounts, verify identity and ownership, facilitate escrow transactions, communicate with users, investigate fraud, comply with legal obligations, improve our services, maintain platform security, and enforce our Terms and Conditions.'
    },
    {
      title: 'Information Sharing',
      icon: <TeamOutlined className="text-emerald-500" />,
      content: 'SocialSwap may share information with payment processors, identity verification providers, professional advisers, service providers, cloud hosting providers, or government authorities where required by law or necessary to provide our services. We do not sell personal information to third parties.'
    },
    {
      title: 'Data Security',
      icon: <SafetyOutlined className="text-blue-500" />,
      content: 'We implement reasonable technical and organizational safeguards designed to protect personal information. However, no internet transmission or electronic storage system can be guaranteed to be completely secure.'
    },
    {
      title: 'Data Retention',
      icon: <ClockCircleOutlined className="text-orange-500" />,
      content: 'We retain personal information for as long as reasonably necessary to operate our services, resolve disputes, prevent fraud, comply with legal obligations, and enforce our agreements.'
    },
    {
      title: 'User Responsibilities',
      icon: <UserOutlined className="text-purple-500" />,
      content: 'Users are responsible for protecting their account credentials and notifying SocialSwap immediately of suspected unauthorized access or security incidents.'
    },
    {
      title: 'Cookies',
      icon: <GlobalOutlined className="text-teal-500" />,
      content: 'Our platform may use cookies and similar technologies to improve functionality, analytics, security, and user experience. Users may manage certain cookie preferences through their browser settings.'
    },
    {
      title: 'Your Rights',
      icon: <SafetyCertificateOutlined className="text-indigo-500" />,
      content: 'Depending on applicable law, you may have rights to request access to, correction of, or deletion of certain personal information, subject to legal and operational requirements.'
    },
    {
      title: 'Third-Party Services',
      icon: <DatabaseOutlined className="text-rose-500" />,
      content: 'Our platform may interact with third-party services such as YouTube, payment providers, email providers, analytics tools, and cloud infrastructure. Their privacy practices are governed by their own policies.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080511] pt-24 pb-20 px-4 relative overflow-hidden">
      <SEOHead title="Privacy Policy | SocialSwap" />
      
      {/* Background glowing blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/10 dark:bg-pink-600/20 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[#6E4BFF] dark:text-[#C6B4FF] text-sm font-semibold mb-6">
            <SafetyOutlined /> Protected & Secure
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            This Privacy Policy explains how SocialSwap collects, uses, stores, and protects personal information when you use our platform and services.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4 font-medium">
            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white/60 dark:bg-[#110C1F]/60 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] transition-all"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#1C1530] flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px] md:text-base">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Policy Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-500 to-[#6E4BFF] rounded-3xl p-6 md:p-8 shadow-xl text-white mt-8"
          >
            <div className="flex items-start gap-4 md:gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0 backdrop-blur-sm">
                <LockOutlined />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3">Policy Updates</h2>
                <p className="text-white/90 leading-relaxed">
                  SocialSwap may update this Privacy Policy from time to time. Continued use of the platform after publication of an updated policy constitutes acceptance of the revised version.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/60 dark:bg-[#110C1F]/60 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8 text-center mt-12"
          >
            <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mb-4">
              <MailOutlined className="text-2xl text-[#6E4BFF] dark:text-[#C6B4FF]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Have Questions?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              For privacy-related questions, please contact our support team.
            </p>
            <a 
              href="mailto:official@socialswap.in"
              className="inline-flex items-center justify-center gap-2 bg-[#6E4BFF] hover:bg-[#5b3df5] text-white font-semibold py-3 px-8 rounded-full transition-all hover:scale-105 hover:shadow-[0_10px_25px_rgba(110,75,255,0.4)]"
            >
              official@socialswap.in
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
