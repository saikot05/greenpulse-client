'use client';

import React from 'react';
import { Card, Chip } from '@heroui/react';
import { CircleTree, ShieldCheck, Globe, Thunderbolt } from '@gravity-ui/icons';

export default function AboutPage() {
  return (
    <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title */}
        <div className="space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            About Our Mission
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
            Democratizing ESG Analytics & net-zero compliance
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            GreenPulse AI is an enterprise compliance tracker combining Large Language Models (LLMs) and advanced energy telemetry.
          </p>
        </div>

        {/* 1. Core Vision Banner */}
        <Card className="p-8 border border-emerald-500/20 bg-gradient-to-br from-emerald-800 to-teal-950 text-white shadow-xl rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_50%)]" />
          <div className="space-y-4 relative z-10">
            <h2 className="text-xl font-bold">Why GreenPulse AI?</h2>
            <p className="text-xs text-emerald-100 leading-relaxed">
              In a world where climate regulations are shifting rapidly—with frameworks like CSRD in Europe and SEC disclosure requirements in the US—spreadsheets are no longer sufficient. Companies need a digital ledger that is verifiable, secure, and automated.
            </p>
            <p className="text-xs text-emerald-100 leading-relaxed">
              We leverage vision models to parse scanned utility bills, classify raw data using AI agents, and provide compliance auditors with clear, exportable, and signed report summaries.
            </p>
          </div>
        </Card>

        {/* 2. Educational Section: Scope 1, 2, 3 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Understanding Carbon Scope Classifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CircleTree className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Scope 1 (Direct)</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Direct greenhouse gas emissions from sources owned or controlled by the company (e.g. natural gas boilers, company delivery trucks, combustion turbines).
              </p>
            </Card>

            <Card className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Thunderbolt className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Scope 2 (Indirect Grid)</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Indirect emissions from the generation of purchased utility electricity, heating, steam, or cooling drawn from the local power grid.
              </p>
            </Card>

            <Card className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Scope 3 (Value Chain)</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                All other indirect emissions across the entire corporate supply chain, including supplier logistics, raw resource extraction, waste, and travel.
              </p>
            </Card>

          </div>
        </div>

        {/* 3. Tech Stack & Standards */}
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Our Framework Alignment</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            GreenPulse AI reports are structured strictly around international compliance guidelines:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Chip size="sm" variant="soft" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">GHG Corporate Standard</Chip>
            <Chip size="sm" variant="soft" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">CSRD Compliance Directive</Chip>
            <Chip size="sm" variant="soft" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">TCFD Reporting Recommendations</Chip>
            <Chip size="sm" variant="soft" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">ISO 14064 GHG Verification</Chip>
          </div>
        </Card>

      </div>
    </div>
  );
}
