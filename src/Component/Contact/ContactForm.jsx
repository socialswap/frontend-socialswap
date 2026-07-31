import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Input, Button, message } from 'antd';
import { SendOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

import axiosInstance, { api } from '../../API/api';

const { TextArea } = Input;

const ContactForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`${api}/contact`, values);
      if (response.data.success) {
        message.success('Message sent successfully! Our team will contact you soon.');
        form.resetFields();
      } else {
        message.error(response.data.message || 'Failed to send message.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 md:py-20 bg-transparent relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B79DFF]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F7B8D5]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            className="inline-block py-1 px-4 rounded-full bg-purple-primary/10 text-purple-primary font-semibold text-sm mb-4 border border-purple-primary/20"
          >
            Get In Touch
          </motion.span>
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4"
          >
            Request a <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--btn-gradient)' }}>Custom Service</span>
          </motion.h2>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            className="text-text-secondary text-lg max-w-2xl mx-auto"
          >
            Have a special requirement or need expert advice on buying/selling channels? Leave us a message and we'll get back to you immediately.
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-card p-6 md:p-12 shadow-card border border-white/40 dark:border-white/10">
          
          {/* Contact Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
            className="lg:w-1/3 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3 md:mb-6">Contact Information</h3>
              <p className="text-sm md:text-base text-text-secondary mb-5 md:mb-8">
                Fill up the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center md:items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-primary/10 flex items-center justify-center text-purple-primary shrink-0 text-lg md:text-xl">
                    <PhoneOutlined />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold text-text-muted uppercase tracking-wider mb-0 md:mb-1">Phone</h4>
                    <p className="text-sm md:text-base text-text-primary font-medium">+91 9423523291</p>
                  </div>
                </div>
                
                <div className="flex items-center md:items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent-pink/10 flex items-center justify-center text-accent-pink shrink-0 text-lg md:text-xl">
                    <MailOutlined />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold text-text-muted uppercase tracking-wider mb-0 md:mb-1">Email</h4>
                    <p className="text-sm md:text-base text-text-primary font-medium">support@socialswap.in</p>
                  </div>
                </div>
                
                <div className="flex items-center md:items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 text-lg md:text-xl">
                    <EnvironmentOutlined />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold text-text-muted uppercase tracking-wider mb-0 md:mb-1">Location</h4>
                    <p className="text-sm md:text-base text-text-primary font-medium">India</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="lg:w-2/3"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-6"
            >
              <Form.Item
                name="name"
                label={<span className="text-text-primary font-medium">Full Name</span>}
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input size="large" placeholder="John Doe" className="rounded-input bg-white/55 dark:bg-[#2A2045]/55 border-white/40 dark:border-white/10 hover:border-[#8A6CFF] focus:border-[#8A6CFF] py-3" />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-text-primary font-medium">Email Address</span>}
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input size="large" placeholder="john@example.com" className="rounded-input bg-white/55 dark:bg-[#2A2045]/55 border-white/40 dark:border-white/10 hover:border-[#8A6CFF] focus:border-[#8A6CFF] py-3" />
              </Form.Item>

              <Form.Item
                name="service"
                label={<span className="text-text-primary font-medium">Interested Service</span>}
                className="md:col-span-2"
                rules={[{ required: true, message: 'Please specify the service you need' }]}
              >
                <Input size="large" placeholder="e.g. Escrow Transaction, Channel Verification, Growth Marketing" className="rounded-input bg-white/55 dark:bg-[#2A2045]/55 border-white/40 dark:border-white/10 hover:border-[#8A6CFF] focus:border-[#8A6CFF] py-3" />
              </Form.Item>

              <Form.Item
                name="message"
                label={<span className="text-text-primary font-medium">Your Message</span>}
                className="md:col-span-2"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea 
                  rows={5} 
                  placeholder="Tell us exactly what you need..." 
                  className="rounded-input bg-white/55 dark:bg-[#2A2045]/55 border-white/40 dark:border-white/10 hover:border-[#8A6CFF] focus:border-[#8A6CFF] py-3 resize-none" 
                />
              </Form.Item>

              <div className="md:col-span-2 mt-2">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  loading={loading}
                  className="w-full h-14 rounded-button text-lg font-bold border-none shadow-purple-glow-soft hover:shadow-purple-glow-hover hover:translate-y-[-3px] hover:scale-[1.02] transition-all"
                  style={{ background: 'var(--btn-gradient)' }}
                  icon={<SendOutlined />}
                >
                  Send Request
                </Button>
              </div>
            </Form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactForm;
