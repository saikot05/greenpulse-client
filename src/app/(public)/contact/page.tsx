'use client';

import React, { useState } from 'react';
import { Card, Input, Button, Spinner } from '@heroui/react';
import { ShieldCheck, MapPin, Globe } from '@gravity-ui/icons';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsLoading(true);
    // Simulate support ticket creation
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Contact Support
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
            Get in touch with ESG solutions teams
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Have questions about billing OCR, enterprise VPC installation, or regulatory standard mappings? Propose inquiries below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Form Area (7 cols) */}
          <div className="md:col-span-7">
            <Card className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">Submit a Compliance Support Request</h2>
              
              {submitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium space-y-1">
                  <p className="font-bold">✓ Request submitted successfully!</p>
                  <p>A solutions architect will review your corporate telemetry inquiry and contact you shortly.</p>
                  <Button size="sm" className="mt-3 bg-emerald-600 text-white font-semibold rounded-lg" onPress={() => setSubmitted(false)}>
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-semibold text-neutral-500">Full Name</label>
                      <Input
                        id="contact-name"
                        type="text"
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-semibold text-neutral-500">Corporate Email</label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="jane@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-neutral-500">Subject</label>
                    <Input
                      id="contact-subject"
                      type="text"
                      placeholder="e.g. SEC Carbon Compliance Inquiry"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-msg" className="text-xs font-semibold text-neutral-500">Message details</label>
                    <textarea
                      id="contact-msg"
                      placeholder="Describe your question or mechanical telemetry setup details..."
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-3 text-xs focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    isDisabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-11 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    {isLoading ? <Spinner size="sm" /> : 'Submit Support Ticket'}
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Contact Details sidebar (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            
            <Card className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Corporate HQ</h3>
              <div className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-300">
                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>100 Pine Street, Floor 18<br/>San Francisco, CA 94111</span>
                </div>
                <div className="flex gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>compliance@greenpulse.ai</span>
                </div>
                <div className="flex gap-2">
                  <Globe className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Support Center: +1 (800) 555-0199</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm text-center space-y-2">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Active VPC Status</h4>
              <p className="text-[10px] text-neutral-400">All local node services and API gateways are fully operational.</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold mx-auto">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Operational
              </div>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}
