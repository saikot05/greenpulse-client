'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Accordion, Card, Button, Input, Chip, Avatar, Badge } from '@heroui/react';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Tree,
  ChartColumn,
  FileText,
  Globe,
  CircleCheck,
  Magnifier,
  ChevronDown
} from '@gravity-ui/icons';

// Mock FAQ Data
const FAQS = [
  {
    question: 'How does the utility bill OCR work?',
    answer: 'Our multimodal OCR pipeline utilizes specialized vision LLMs to parse scan receipts, PDF energy invoices, and green ledger sheets. It extracts consumption values (kWh, therms), billing cycles, meters, and costs, mapping them directly to standardized carbon equivalents in real-time with over 99% accuracy.'
  },
  {
    question: 'What is the difference between Scope 1, 2, and 3 emissions?',
    answer: 'Scope 1 covers direct emissions from owned or controlled sources (e.g. gas boilers, vehicle fleets). Scope 2 covers indirect emissions from the generation of purchased electricity, steam, heating, and cooling. Scope 3 covers all other indirect emissions across the corporate value chain (e.g. supplier logistics, waste, employee commuting).'
  },
  {
    question: 'How secure is our corporate energy data?',
    answer: 'We prioritize enterprise-grade security. All uploaded bills and compliance data are encrypted at rest with AES-256 and in transit using TLS 1.3. We support private VPC deployments and local database sanitization to ensure no sensitive telemetry leaks to public foundation models.'
  },
  {
    question: 'Can I export compliance-ready PDF summaries?',
    answer: 'Yes! The platform generates audit-trail compliance reports matching GHG Protocol, CSRD, and TCFD standards. You can download fully traceable, signed PDF summaries detailing scope breakdowns, risk indices, and actionable mitigation logs.'
  }
];

// Testimonials Data
const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'Chief Sustainability Officer at GlobalLogistics Corp',
    quote: 'GreenPulse AI completely transformed how we compile our Scope 3 emissions. The autonomous agent categorized over 5,000 supply chain invoices in minutes, saving us weeks of manual data entry.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    stars: 5
  },
  {
    name: 'Marcus Vance',
    role: 'VP of Facilities at Apex Manufacturing',
    quote: 'The real-time anomaly alerts caught a massive thermal boiler leak at our Munich assembly plant before it violated EU compliance caps. The ROI was clear in the first month.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    stars: 5
  },
  {
    name: 'Elena Rostova',
    role: 'ESG Reporting Director at DataSpace Solutions',
    quote: 'Traceable PDF audits and instant compliance sheets make our annual CSRD filings stress-free. The Gemini-powered copilot answers complex queries about our carbon footprint in seconds.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    stars: 5
  }
];

// Capabilities Grid Data
const CAPABILITIES = [
  {
    title: 'Multimodal Utility OCR',
    description: 'Instantly extract consumption telemetry, line items, and invoice dates from scanned PDF energy receipts and fuel bills.',
    icon: <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
  },
  {
    title: 'Scope 1-3 Carbon Analytics',
    description: 'Automatically categorize emissions across direct assets, indirect energy grids, and upstream value chain operations.',
    icon: <ChartColumn className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
  },
  {
    title: 'Autonomous Risk Tagging',
    description: 'Instantly flag emissions hotspots and classify high-risk plants using state-of-the-art compliance matching.',
    icon: <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
  },
  {
    title: 'Context-Aware AI Copilot',
    description: 'Interact conversationally with your green ledgers. Extract summaries, compile stats, and plan savings.',
    icon: <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
  },
  {
    title: 'Audit Trail & Compliance',
    description: 'Export signed, traceable PDF reports aligned directly with GHG Protocol, CSRD, and TCFD guidelines.',
    icon: <Tree className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
  },
  {
    title: 'Real-Time Anomaly Alerts',
    description: 'Detect sudden energy peaks, mechanical leaks, and baseline drift using edge anomaly models.',
    icon: <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
  }
];

export default function SaaSLandingPage() {
  // Interactive Dashboard Preview State
  const [activeFacilityTab, setActiveFacilityTab] = useState<'dallas' | 'munich' | 'seattle'>('dallas');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Facility Data for Interactive Preview
  const facilityData = {
    dallas: {
      name: 'Dallas Mega-Factory',
      type: 'Manufacturing',
      emissions: '12,450 t',
      energy: '4.5M kWh',
      status: 'High Emissions',
      statusColor: 'danger' as const,
      priority: 'High',
      recommendation: 'Electrify thermal furnace heating loops.'
    },
    munich: {
      name: 'Munich Assembly-1',
      type: 'Manufacturing',
      emissions: '15,300 t',
      energy: '8.2M kWh',
      status: 'Critical Failure',
      statusColor: 'danger' as const,
      priority: 'High',
      recommendation: 'Replace aging coal-fired steam boilers.'
    },
    seattle: {
      name: 'Emerald Office Park',
      type: 'Corporate Office',
      emissions: '150 t',
      energy: '1.1M kWh',
      status: 'Low Carbon',
      statusColor: 'success' as const,
      priority: 'Low',
      recommendation: 'Configure microgrid EV vehicle charger offsets.'
    }
  };

  const currentFacility = facilityData[activeFacilityTab];

  const handleDemoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoEmail) {
      setDemoSubmitted(true);
      setTimeout(() => {
        setShowDemoModal(false);
        setDemoSubmitted(false);
        setDemoEmail('');
      }, 2000);
    }
  };

  return (
    <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-neutral-100 dark:border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-emerald-50),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-8 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            ✨ Powered by Gemini 2.5 & Autonomous ESG Agents
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Automate ESG Compliance & <span className="text-emerald-600 dark:text-emerald-400">Decarbonize</span> Facilities at Scale
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Ingest utility invoices with multimodal OCR, auto-classify Scope 1-3 carbon footprint data, and deploy autonomous agents to audit compliance trails.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              as={Link}
              href="/explore"
              className="w-full sm:w-auto h-11 px-6 font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Public Audits</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              onPress={() => setShowDemoModal(true)}
              className="w-full sm:w-auto h-11 px-6 font-semibold border border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Request Platform Demo
            </Button>
          </div>

          {/* Floating KPI Banner */}
          <div className="max-w-4xl mx-auto p-0.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 dark:from-emerald-900/30 dark:to-teal-900/30 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/50 dark:divide-neutral-800 bg-white dark:bg-neutral-900/90 rounded-2xl py-6 px-4">
              <div className="py-4 sm:py-2">
                <span className="block text-3xl font-extrabold text-neutral-900 dark:text-white">1.2M+</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-1 block">Tons CO₂e Audited</span>
              </div>
              <div className="py-4 sm:py-2">
                <span className="block text-3xl font-extrabold text-neutral-900 dark:text-white">450+</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-1 block">Enterprise Facilities</span>
              </div>
              <div className="py-4 sm:py-2">
                <span className="block text-3xl font-extrabold text-neutral-900 dark:text-white">80%</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-1 block">Manual Entry Saved</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Key Capabilities Grid */}
      <section className="py-16 lg:py-24 bg-white dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Agentic Features</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Autonomous ESG Compliance Arsenal</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Move beyond spreadsheets. Leverage fully autonomous agent clusters to track, classify, and audit compliance workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAPABILITIES.map((cap, idx) => (
              <Card key={idx} className="p-6 border border-neutral-100 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/60 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-6">
                  {cap.icon}
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">{cap.title}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{cap.description}</p>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Platform Workflow Timeline */}
      <section className="py-16 lg:py-24 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">How It Works</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Seamless Compliance Pipeline</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              From raw utility invoices to export-ready green disclosure logs in four automated steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-0.5 bg-neutral-200 dark:bg-neutral-800 z-0" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-950 border-4 border-white dark:border-neutral-950 flex items-center justify-center text-sm font-extrabold text-emerald-600 dark:text-emerald-400 shadow-sm">
                01
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mt-4 mb-2">Upload Bills</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[200px] leading-relaxed">
                Ingest PDF energy invoices, fuel receipts, and CSV ledgers.
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-950 border-4 border-white dark:border-neutral-950 flex items-center justify-center text-sm font-extrabold text-emerald-600 dark:text-emerald-400 shadow-sm">
                02
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mt-4 mb-2">Agentic Audit</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[200px] leading-relaxed">
                Gemini agents automatically classify Scope 1-3 telemetry values.
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-950 border-4 border-white dark:border-neutral-950 flex items-center justify-center text-sm font-extrabold text-emerald-600 dark:text-emerald-400 shadow-sm">
                03
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mt-4 mb-2">Interactive Insights</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[200px] leading-relaxed">
                Trace real-time emissions curves and risk rating tags.
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-950 border-4 border-white dark:border-neutral-950 flex items-center justify-center text-sm font-extrabold text-emerald-600 dark:text-emerald-400 shadow-sm">
                04
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mt-4 mb-2">Export Trail</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[200px] leading-relaxed">
                Generate signed PDF summaries matching CSRD and TCFD compliance.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Live Carbon Metrics Dashboard Preview */}
      <section className="py-16 lg:py-24 bg-white dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Console Preview</span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white leading-[1.25]">Interactive Sustainability Intelligence</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Explore real-time data flow inside our interactive dashboard mockup. Switch between key enterprise facilities to monitor audited emissions status.
              </p>
              
              {/* Tabs list */}
              <div className="space-y-3">
                <button
                  onClick={() => setActiveFacilityTab('dallas')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    activeFacilityTab === 'dallas'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <span className="text-xs font-bold">Dallas Mega-Factory</span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </button>
                <button
                  onClick={() => setActiveFacilityTab('munich')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    activeFacilityTab === 'munich'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <span className="text-xs font-bold">Munich Assembly-1</span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </button>
                <button
                  onClick={() => setActiveFacilityTab('seattle')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    activeFacilityTab === 'seattle'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <span className="text-xs font-bold">Seattle Office Park</span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </button>
              </div>

            </div>

            {/* Interactive Console Screen Mockup */}
            <div className="lg:col-span-7 bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800">
              
              {/* Header */}
              <div className="bg-neutral-950 px-6 py-4 flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
                  Live Sustainability telemetry console
                </div>
                <div className="h-4 w-4 rounded bg-neutral-800" />
              </div>

              {/* Console Body */}
              <div className="p-6 space-y-6 text-neutral-300">
                
                {/* Overview Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-neutral-800/50 rounded-lg">
                    <span className="block text-[10px] uppercase font-bold text-neutral-500">Facility</span>
                    <span className="text-xs font-bold text-white mt-1 block truncate">{currentFacility.name}</span>
                  </div>
                  <div className="p-3 bg-neutral-800/50 rounded-lg">
                    <span className="block text-[10px] uppercase font-bold text-neutral-500">Type</span>
                    <span className="text-xs font-bold text-white mt-1 block">{currentFacility.type}</span>
                  </div>
                  <div className="p-3 bg-neutral-800/50 rounded-lg">
                    <span className="block text-[10px] uppercase font-bold text-neutral-500">CO2 Emissions</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1 block">{currentFacility.emissions}</span>
                  </div>
                  <div className="p-3 bg-neutral-800/50 rounded-lg">
                    <span className="block text-[10px] uppercase font-bold text-neutral-500">Energy Draw</span>
                    <span className="text-xs font-bold text-amber-400 mt-1 block">{currentFacility.energy}</span>
                  </div>
                </div>

                {/* Live Chart Visualizer Mockup */}
                <div className="p-4 bg-neutral-950 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Daily Grid Load Curve</span>
                    <Chip color={currentFacility.statusColor} variant="soft" size="sm">
                      {currentFacility.status}
                    </Chip>
                  </div>
                  
                  {/* Mock bar curves */}
                  <div className="h-32 flex items-end gap-1.5 pt-4">
                    <div className="flex-1 bg-neutral-800 h-[30%] rounded-sm" />
                    <div className="flex-1 bg-neutral-800 h-[45%] rounded-sm" />
                    <div className="flex-1 bg-neutral-800 h-[60%] rounded-sm" />
                    <div className="flex-1 bg-neutral-800 h-[35%] rounded-sm" />
                    <div className="flex-1 bg-emerald-500/30 h-[80%] rounded-sm" />
                    <div className="flex-1 bg-emerald-500 h-[95%] rounded-sm" />
                    <div className="flex-1 bg-emerald-500 h-[70%] rounded-sm" />
                    <div className="flex-1 bg-neutral-800 h-[50%] rounded-sm" />
                    <div className="flex-1 bg-neutral-800 h-[40%] rounded-sm" />
                  </div>
                </div>

                {/* AI Agent Recommendation box */}
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Gemini Decarbonization Agent Insight</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {currentFacility.recommendation} Priority level is tagged as <strong className="text-white">{currentFacility.priority}</strong>.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Supported ESG Compliance Frameworks */}
      <section className="py-16 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-8">
            traceable audit trails fully compliant with global frameworks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Chip variant="soft" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-bold text-neutral-700 dark:text-neutral-300">
              GHG Protocol
            </Chip>
            <Chip variant="soft" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Scope 1, 2, 3 Standard
            </Chip>
            <Chip variant="soft" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-bold text-neutral-700 dark:text-neutral-300">
              ISO 14064
            </Chip>
            <Chip variant="soft" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-bold text-neutral-700 dark:text-neutral-300">
              CSRD Compliant
            </Chip>
            <Chip variant="soft" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-bold text-neutral-700 dark:text-neutral-300">
              TCFD Standard
            </Chip>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-16 lg:py-24 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Success Stories</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Endorsed by Sustainability Leaders</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              See how modern enterprises save manual overhead and achieve net-zero milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <Card key={idx} className="p-6 border border-neutral-100 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/60 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-0.5 text-amber-500 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <span key={i} className="text-base">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                  <Avatar src={t.avatar} className="h-9 w-9" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-neutral-900 dark:text-white truncate">{t.name}</span>
                    <span className="block text-[10px] text-neutral-400 truncate">{t.role}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">F.A.Q.</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Clear up questions regarding corporate telemetry models and Scope definitions.
            </p>
          </div>

          <Accordion className="w-full">
            {FAQS.map((faq, idx) => (
              <Accordion.Item key={idx} id={`faq-${idx}`}>
                <Accordion.Heading className="text-sm font-bold text-neutral-900 dark:text-white">
                  <Accordion.Trigger className="w-full py-4 text-left flex items-center justify-between text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    <span>{faq.question}</span>
                    <ChevronDown className="h-4 w-4 text-neutral-400 transition-transform duration-200" />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body className="pb-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {faq.answer}
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>

        </div>
      </section>

      {/* 8. Newsletter & Final CTA Banner */}
      <section className="py-16 lg:py-20 bg-emerald-600 dark:bg-emerald-950/80 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-emerald-500),transparent_70%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Your Decarbonization Journey?
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-emerald-100 leading-relaxed">
            Subscribe to our newsletter to receive the latest ESG policy updates and direct-mitigation case studies.
          </p>

          <form onSubmit={handleDemoRequest} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Enter your work email"
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              className="flex-1 bg-white text-neutral-900 h-10 text-sm rounded-lg"
              required
            />
            <Button
              type="submit"
              className="bg-neutral-900 hover:bg-neutral-800 text-white h-10 px-6 font-semibold rounded-lg text-sm transition-colors cursor-pointer"
            >
              Subscribe
            </Button>
          </form>

          {demoSubmitted && (
            <span className="block text-xs font-semibold text-emerald-200">
              ✓ Successfully subscribed! Check your inbox for updates.
            </span>
          )}

        </div>
      </section>

      {/* Request Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 dark:border-neutral-800 space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Request Platform Demo</h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDemoRequest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-500">Corporate Email</label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  className="w-full text-sm h-10"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-10 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Submit Demo Request
              </Button>
            </form>

            {demoSubmitted && (
              <span className="block text-xs font-semibold text-emerald-600 text-center">
                ✓ Request submitted successfully! A solutions architect will reach out shortly.
              </span>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
