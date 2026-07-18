'use client';

import React from 'react';
import { Card, Button, Switch, Spinner } from '@heroui/react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';

export default function SettingsPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" className="text-emerald-600" />
        <span className="text-sm text-neutral-500">Loading settings...</span>
      </div>
    );
  }

  const isAuditor = (session?.user as any)?.role === 'auditor';

  if (isAuditor) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto flex items-center justify-center min-h-[70vh]">
        <Card className="w-full p-8 border border-emerald-500/20 bg-zinc-950/40 backdrop-blur-md dark:bg-zinc-900/30 text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.08)]">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Access Denied</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md mx-auto">
              Environmental Auditors do not possess permissions to modify core facility settings or global API keys. Contact your organization administrator to upgrade access levels.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/explore">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 mx-auto">
                <ArrowLeft className="h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          System Settings
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Configure API endpoints, alerts, and system-wide ESG configuration switches.
        </p>
      </div>

      <div className="space-y-6">
        {/* System Preferences */}
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">System Preferences</h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-850">
              <div>
                <p className="font-bold text-neutral-800 dark:text-neutral-200">Dark Mode Enforcement</p>
                <p className="text-neutral-500 mt-0.5">Enforce high-contrast dark themes on the telemetry dashboards.</p>
              </div>
              <Switch defaultSelected aria-label="Dark Mode toggle" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-bold text-neutral-800 dark:text-neutral-200">Auto-tagging audits</p>
                <p className="text-neutral-500 mt-0.5">Automatically trigger LLM hashtag auto-classification on creation.</p>
              </div>
              <Switch defaultSelected aria-label="Auto-tagging toggle" />
            </div>
          </div>
        </Card>

        {/* API Access Keys */}
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">API Access Keys</h3>
          <div className="space-y-3">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Generate read/write tokens to connect telemetry logs and facility audit updates to external reporting networks.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value="gp_live_83hf02hs83hfasd92h8fas72ha"
                className="flex-1 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 select-all outline-none"
              />
              <Button isDisabled className="bg-emerald-600 text-white font-semibold rounded text-xs shrink-0 cursor-not-allowed">
                Regenerate key
              </Button>
            </div>
          </div>
        </Card>

        {/* Notification Toggles */}
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Notifications & Alerts</h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-850">
              <div>
                <p className="font-bold text-neutral-800 dark:text-neutral-200">Carbon Intensity Limit Alert</p>
                <p className="text-neutral-500 mt-0.5">Notify me via email if an audit score exceeds 1,000 metric tons of CO2e.</p>
              </div>
              <Switch defaultSelected aria-label="Carbon Intensity Limit Alert toggle" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-bold text-neutral-800 dark:text-neutral-200">Anomaly Detection Digest</p>
                <p className="text-neutral-500 mt-0.5">Receive weekly reports compiling telemetry baseline spikes.</p>
              </div>
              <Switch aria-label="Anomaly Detection Digest toggle" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
