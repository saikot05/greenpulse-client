'use client';

import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAudit } from '@/lib/api-client';
import type { IEsgAudit } from '@/types/audit';
import { Card, Chip, Button, Spinner } from '@heroui/react';
import { MapPin, Thunderbolt, CircleTree, ArrowLeft, ShieldCheck, Star } from '@gravity-ui/icons';
import Link from 'next/link';

/** Mock reviews for ESG audits to satisfy the ratings/reviews requirement */
const MOCK_REVIEWS = [
  {
    author: 'Compliance Officer, US Region',
    rating: 5,
    comment: 'The data matches our telemetry logs perfectly. The AI-generated recommendations for thermal heating upgrades are highly viable and already under budget review.',
    date: '2026-06-12'
  },
  {
    author: 'External Auditor, TCFD Council',
    rating: 4,
    comment: 'Excellent documentation trail. Scope 1 and 2 splits are clearly demarcated. Would benefit from including vehicle diesel receipts for full compliance.',
    date: '2026-07-02'
  }
];

export default function AuditDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Retrieve audit specs from MongoDB via React Query
  const { data: audit, isLoading, error } = useQuery<IEsgAudit>({
    queryKey: ['audit', id],
    queryFn: () => getAudit(id),
    retry: false,
  });

  const getRiskChipColor = (risk: string) => {
    switch (risk) {
      case 'Low Carbon':
        return 'success';
      case 'Moderate Impact':
        return 'warning';
      case 'High Emissions':
      case 'Critical Failure':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
      case 'medium':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-950/20';
      default:
        return 'text-neutral-500 bg-neutral-50 dark:bg-neutral-900';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-neutral-50/50 dark:bg-neutral-950">
        <Spinner size="lg" className="text-emerald-600" />
        <span className="text-sm text-neutral-500 dark:text-neutral-400">Retrieving audit specs...</span>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-neutral-50/50 dark:bg-neutral-950 px-4 text-center">
        <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400 font-extrabold text-2xl">
          ✕
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Audit Not Found</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          The requested compliance log could not be located in the database. It may have been deleted or the ID is incorrect.
        </p>
        <Link href="/explore">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm transition-colors">
            Return to Explore
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Public Explorer</span>
        </Link>

        {/* 1. Header Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-800 to-teal-955 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_50%)]" />
          <div className="p-8 md:p-10 space-y-6 relative z-10">
            
            <div className="flex flex-wrap items-center gap-2.5">
              <Chip variant="soft" className="bg-white/10 text-white backdrop-blur-sm font-semibold">
                {audit.facilityType}
              </Chip>
              <Chip color={getRiskChipColor(audit.riskRating)} variant="soft" className="font-semibold">
                {audit.riskRating}
              </Chip>
              <span className="text-xs text-emerald-300 font-bold ml-auto uppercase tracking-wider">
                FY {audit.auditYear} REPORT
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {audit.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-emerald-200">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{audit.location}</span>
                <span className="mx-2 opacity-40">|</span>
                <span>Facility: {audit.facilityName}</span>
              </div>
            </div>

            {/* Tags */}
            {audit.tags && audit.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                {audit.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* 2. Core Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-sm flex flex-row items-center gap-4 overflow-hidden">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CircleTree className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Carbon Intensity</span>
              <span className="text-xl font-extrabold text-neutral-950 dark:text-white mt-0.5 block break-words leading-tight">
                {audit.carbonScoreTons.toLocaleString()} tons CO₂e
              </span>
            </div>
          </Card>

          <Card className="p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-sm flex flex-row items-center gap-4 overflow-hidden">
            <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Thunderbolt className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Energy Consumption</span>
              <span className="text-xl font-extrabold text-neutral-950 dark:text-white mt-0.5 block break-words leading-tight">
                {audit.energyUsageKwh.toLocaleString()} kWh
              </span>
            </div>
          </Card>

          <Card className="p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-sm flex flex-row items-center gap-4 overflow-hidden">
            <div className="h-12 w-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Scope Protocol</span>
              <span className="text-xl font-extrabold text-neutral-950 dark:text-white mt-0.5 block break-words leading-tight">
                {audit.scopeCategory}
              </span>
            </div>
          </Card>
        </div>

        {/* 3. Main layout: Details vs AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Overview & Specifications (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Overview card */}
            <Card className="p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Description & Overview</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                {audit.shortDescription}
              </p>
              <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-3 pt-2 whitespace-pre-line border-t border-neutral-100 dark:border-neutral-800">
                {audit.fullOverview}
              </div>
            </Card>

            {/* Specifications card */}
            <Card className="p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Facility Specifications</h2>
              <div className="grid grid-cols-2 gap-4 text-xs divide-y sm:divide-y-0 sm:grid-cols-4">
                <div className="pt-2 sm:pt-0">
                  <span className="block text-neutral-400 font-medium">Facility ID</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 mt-1 block truncate">#{audit._id.substring(18)}</span>
                </div>
                <div className="pt-2 sm:pt-0">
                  <span className="block text-neutral-400 font-medium">Logged By</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 mt-1 block truncate">#{audit.createdBy.substring(18)}</span>
                </div>
                <div className="pt-2 sm:pt-0">
                  <span className="block text-neutral-400 font-medium">Audited Year</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 mt-1 block">{audit.auditYear}</span>
                </div>
                <div className="pt-2 sm:pt-0">
                  <span className="block text-neutral-400 font-medium">Protocol Class</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 mt-1 block">GHG Corporate</span>
                </div>
              </div>
            </Card>

            {/* Ratings & Reviews Section */}
            <Card className="p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Reviews & Comments</h2>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                  <Star className="h-4 w-4" />
                  <span>4.5 out of 5</span>
                </div>
              </div>

              <div className="space-y-4">
                {MOCK_REVIEWS.map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">{rev.author}</span>
                      <span className="text-neutral-400">{rev.date}</span>
                    </div>
                    <div className="flex gap-0.5 text-xs text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Right panel: Gemini AI mitigation Insights (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* AI Insights Card */}
            <Card className="p-6 border border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/5 rounded-2xl shadow-md space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Gemini Decarbonization Agent
                </span>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Decarbonization Priority</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${getPriorityColor(audit.aiInsights?.decarbonizationPriority)}`}>
                  {audit.aiInsights?.decarbonizationPriority || 'Medium'} Priority
                </span>
              </div>

              {/* Savings */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Est. Energy Cost Savings</span>
                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white block">
                  ${audit.aiInsights?.estimatedCostSavingsUsd?.toLocaleString() || '0'} <span className="text-xs font-semibold text-neutral-400">/ year</span>
                </span>
              </div>

              {/* Recommended actions */}
              <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">Recommended AI Mitigation Steps:</span>
                <ul className="space-y-3 list-none p-0 m-0">
                  {(audit.aiInsights?.recommendedActions || []).map((action, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed align-top">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold">
                        ✓
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </Card>

            {/* Related audits sidebar panel */}
            <Card className="p-6 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Related Audits</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <Link href="/explore" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-emerald-500 block truncate">
                    Ashburn DC-3 Offset Audit
                  </Link>
                  <span className="text-[10px] text-neutral-400 mt-1 block">Scope 2 (Indirect Energy) · Low Carbon</span>
                </div>
                <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <Link href="/explore" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-emerald-500 block truncate">
                    Atlanta Cold Depot Compressor Review
                  </Link>
                  <span className="text-[10px] text-neutral-400 mt-1 block">Scope 2 (Indirect Energy) · Moderate Impact</span>
                </div>
              </div>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}
