'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Chip, Button } from '@heroui/react';
import { MapPin, Thunderbolt, CircleTree, ArrowRight } from '@gravity-ui/icons';

import type { IEsgAudit } from '../../types/audit.js';

interface AuditCardProps {
  audit: IEsgAudit;
}

/**
 * Audit Card using HeroUI dot-notation subcomponents and Gravity UI Icons.
 * Renders audit metrics, risk levels, and action links.
 */
export default function AuditCard({ audit }: AuditCardProps) {
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

  return (
    <Card className="w-full flex flex-col h-full border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5" variant="default">
      {/* Visual Header / Cover Image */}
      <div className="relative h-48 w-full rounded-t-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <img
          src={audit.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'}
          alt={audit.facilityName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        {/* Absolute glassmorphic badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-md">
            {audit.facilityType}
          </span>
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-md">
            FY {audit.auditYear}
          </span>
        </div>
      </div>

      {/* Main Content details inside dot-notation subcomponents */}
      <Card.Header className="flex flex-col items-start gap-1 p-5 pb-2">
        <div className="flex justify-between items-start w-full gap-2">
          <Card.Title className="font-bold text-lg leading-snug text-neutral-800 dark:text-neutral-100 line-clamp-1">
            {audit.title}
          </Card.Title>
        </div>
        <Card.Description className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {audit.facilityName}
        </Card.Description>
      </Card.Header>

      {/* Content body containing metrics */}
      <Card.Content className="px-5 py-2 flex-1 flex flex-col">
        {/* Location and Risk badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{audit.location}</span>
          </div>
          <Chip color={getRiskChipColor(audit.riskRating)} variant="soft" size="sm" className="font-semibold">
            {audit.riskRating}
          </Chip>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
          {audit.shortDescription}
        </p>

        {/* Scope metrics grid */}
        <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 mt-auto">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">Carbon (CO2e)</span>
            <div className="flex items-center gap-1">
              <CircleTree className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                {audit.carbonScoreTons.toLocaleString()} t
              </span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">Energy (Usage)</span>
            <div className="flex items-center gap-1">
              <Thunderbolt className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                {audit.energyUsageKwh.toLocaleString()} kWh
              </span>
            </div>
          </div>
        </div>
      </Card.Content>

      <Card.Footer className="px-5 pb-5 pt-2">
        <Link href={`/explore/${audit._id}`} className="w-full">
          <Button
            variant="secondary"
            className="w-full text-xs font-semibold border border-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
}
