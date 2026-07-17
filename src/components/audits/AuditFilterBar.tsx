'use client';

import React from 'react';
import { Input, Select, SelectItem, Button } from '@heroui/react';
import { Magnifier, Funnel } from '@gravity-ui/icons';
import type { FacilityType, RiskRating, ScopeCategory } from '../../types/audit.js';

interface AuditFilterBarProps {
  search: string;
  facilityType: string;
  riskRating: string;
  scopeCategory: string;
  setSearch: (val: string) => void;
  setFacilityType: (val: string) => void;
  setRiskRating: (val: string) => void;
  setScopeCategory: (val: string) => void;
  onReset: () => void;
}

/**
 * Filter Bar using HeroUI Inputs, Selections, and Gravity UI Icons.
 */
export default function AuditFilterBar({
  search,
  facilityType,
  riskRating,
  scopeCategory,
  setSearch,
  setFacilityType,
  setRiskRating,
  setScopeCategory,
  onReset,
}: AuditFilterBarProps) {
  const facilityTypes: FacilityType[] = [
    'Manufacturing',
    'Data Center',
    'Corporate Office',
    'Logistics Hub',
    'Retail Store',
  ];

  const riskRatings: RiskRating[] = [
    'Low Carbon',
    'Moderate Impact',
    'High Emissions',
    'Critical Failure',
  ];

  const scopeCategories: ScopeCategory[] = [
    'Scope 1 (Direct)',
    'Scope 2 (Indirect Energy)',
    'Scope 3 (Value Chain)',
  ];

  const handleSelectionChange = (key: string, setter: (val: string) => void) => {
    setter(key);
  };

  return (
    <div className="w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 transition-colors duration-300">
      <div className="flex flex-col gap-4">
        {/* Header Title */}
        <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
          <Funnel className="h-5 w-5 text-emerald-500" />
          <h2 className="text-base font-bold">Filter ESG Audits</h2>
        </div>

        {/* Input selectors grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          {/* Search bar input */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Search</span>
            <Input
              type="text"
              placeholder="Search title, facility..."
              value={search}
              onValueChange={setSearch}
              variant="bordered"
              size="md"
              radius="lg"
              startContent={<Magnifier className="h-4 w-4 text-neutral-400 shrink-0" />}
              className="w-full"
            />
          </div>

          {/* Facility Type Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Facility Type</span>
            <Select
              placeholder="All Facility Types"
              variant="bordered"
              size="md"
              radius="lg"
              selectedKeys={facilityType ? new Set([facilityType]) : new Set([])}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                handleSelectionChange(val || '', setFacilityType);
              }}
              className="w-full"
            >
              {facilityTypes.map((type) => (
                <SelectItem key={type} textValue={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Risk Rating Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Risk Rating</span>
            <Select
              placeholder="All Risk Ratings"
              variant="bordered"
              size="md"
              radius="lg"
              selectedKeys={riskRating ? new Set([riskRating]) : new Set([])}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                handleSelectionChange(val || '', setRiskRating);
              }}
              className="w-full"
            >
              {riskRatings.map((rating) => (
                <SelectItem key={rating} textValue={rating}>
                  {rating}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Scope selection and reset actions */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Scope Category</span>
            <div className="flex gap-2 w-full">
              <Select
                placeholder="All Scopes"
                variant="bordered"
                size="md"
                radius="lg"
                selectedKeys={scopeCategory ? new Set([scopeCategory]) : new Set([])}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  handleSelectionChange(val || '', setScopeCategory);
                }}
                className="flex-1"
              >
                {scopeCategories.map((scope) => (
                  <SelectItem key={scope} textValue={scope}>
                    {scope}
                  </SelectItem>
                ))}
              </Select>

              <Button
                isIconOnly
                color="default"
                variant="flat"
                size="md"
                radius="lg"
                onClick={onReset}
                aria-label="Reset Filters"
                className="h-10 w-10 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 animate-none"
              >
                <Funnel className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
