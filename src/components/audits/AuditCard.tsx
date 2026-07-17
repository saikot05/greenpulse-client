'use client';

import React from 'react';
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
      {/* Visual Header / Cover Image Placeholder */}
      <div className="relative h-44 w-full bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center p-6 text-white overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_50%)]" />
        
        <div className="flex flex-col items-center text-center gap-2 z-10">
          <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm">
            <CircleTree className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
            {audit.facilityType}
          </span>
        </div>

        {/* Floating Year Tag */}
        <span className="absolute top-3 right-3 rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          FY {audit.auditYear}
        </span>
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
        <Button
          variant="secondary"
          className="w-full text-xs font-semibold border border-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5"
        >
          <span>View Details</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Card.Footer>
    </Card>
  );
}
