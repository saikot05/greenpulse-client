'use client';

import React from 'react';
import { Card, Button, Switch } from '@heroui/react';

export default function SettingsPage() {
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
