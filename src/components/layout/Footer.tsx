import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Globe } from '@gravity-ui/icons';

/**
 * Enterprise Layout Footer.
 * Refactored to match HeroUI styling accents and palette theme.
 */
export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand details and description */}
          <div className="space-y-6 col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                GreenPulse AI
              </span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Enterprise-grade ESG audit intelligence and decarbonization planning. Automate your scope analysis, track facility emission risk, and generate actionable compliance reports.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Globe className="h-4 w-4" />
              <span>Global Sustainability Compliance Interface</span>
            </div>
          </div>

          {/* Site navigation sections */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8 col-span-1">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Platform
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/explore" className="text-sm hover:text-emerald-500 transition-colors">
                      Explore Audits
                    </Link>
                  </li>
                  <li>
                    <Link href="/carbon-analysis" className="text-sm hover:text-emerald-500 transition-colors">
                      Carbon Analytics
                    </Link>
                  </li>
                  <li>
                    <Link href="/chat" className="text-sm hover:text-emerald-500 transition-colors">
                      AI Assistant
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Company
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/about" className="text-sm hover:text-emerald-500 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-sm hover:text-emerald-500 transition-colors">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm hover:text-emerald-500 transition-colors">
                      Contact Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm hover:text-emerald-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm hover:text-emerald-500 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom footer metadata */}
        <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} GreenPulse AI. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400">
            Providing actionable sustainability intelligence for modern compliance.
          </p>
        </div>
      </div>
    </footer>
  );
}
