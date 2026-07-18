'use client';

import React from 'react';
import { Card } from '@heroui/react';

export default function PrivacyPage() {
  return (
    <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-400">Last updated: July 17, 2026</p>
        
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
          <p>
            At GreenPulse AI, we take the confidentiality of your corporate carbon and energy telemetry data seriously. This Privacy Policy details how we handle, sanitize, and protect your information.
          </p>

          <h2 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">1. Data Ingestion & Security</h2>
          <p>
            All uploaded utility bills and carbon telemetry files are parsed using secure, encrypted API tunnels. At rest, data is encrypted using AES-256 standard and keys are managed in HSM units.
          </p>

          <h2 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">2. LLM Processing Consent</h2>
          <p>
            By uploading files to parse energy values or carbon metrics, you grant permission to run vision LLMs (specifically Gemini models) over the document content. The documents are sanitized prior to transit to ensure no regulatory details are exposed to third-party base-models training data.
          </p>

          <h2 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">3. Cookies & Session Storage</h2>
          <p>
            We use Better Auth standard session cookies to keep you signed in. These are secure, HTTP-only, and expire after 7 days of inactivity.
          </p>
        </Card>
      </div>
    </div>
  );
}
