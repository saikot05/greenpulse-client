'use client';

import React from 'react';
import { Input, Select, ListBox, Button } from '@heroui/react';
import { Magnifier, Funnel } from '@gravity-ui/icons';
import type { FacilityType, RiskRating, ScopeCategory } from '../../types/audit';

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
 * Filter Bar using HeroUI v3 Input, Select, ListBox compound APIs and Gravity UI Icons.
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
          
          {/* Keyword Search Input */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Search Keyword</span>
            <Input
              type="text"
              placeholder="Search title, facility..."
              value={search}
              onValueChange={setSearch}
              variant="secondary"
              startContent={<Magnifier className="h-4 w-4 text-neutral-400 shrink-0" />}
              className="w-full"
            />
          </div>

          {/* Facility Type Selector (HeroUI v3 Compound API) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Facility Type</span>
            <Select
              selectedKeys={facilityType ? new Set([facilityType]) : new Set([])}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                setFacilityType(val || '');
              }}
            >
              <Select.Trigger className="w-full h-10 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-lg px-3 flex items-center justify-between text-left text-sm text-neutral-800 dark:text-neutral-200">
                <Select.Value placeholder="All Facility Types" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <ListBox className="p-1 gap-1">
                  {facilityTypes.map((type) => (
                    <ListBox.Item
                      id={type}
                      key={type}
                      textValue={type}
                      className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-md text-sm text-neutral-700 dark:text-neutral-300 flex items-center justify-between"
                    >
                      {type}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Risk Rating Selector (HeroUI v3 Compound API) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Risk Rating</span>
            <Select
              selectedKeys={riskRating ? new Set([riskRating]) : new Set([])}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                setRiskRating(val || '');
              }}
            >
              <Select.Trigger className="w-full h-10 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-lg px-3 flex items-center justify-between text-left text-sm text-neutral-800 dark:text-neutral-200">
                <Select.Value placeholder="All Risk Ratings" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <ListBox className="p-1 gap-1">
                  {riskRatings.map((rating) => (
                    <ListBox.Item
                      id={rating}
                      key={rating}
                      textValue={rating}
                      className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-md text-sm text-neutral-700 dark:text-neutral-300 flex items-center justify-between"
                    >
                      {rating}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Scope Category Selector + Reset Button (HeroUI v3 Compound API) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Scope Category</span>
            <div className="flex gap-2 w-full">
              <Select
                selectedKeys={scopeCategory ? new Set([scopeCategory]) : new Set([])}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  setScopeCategory(val || '');
                }}
                className="flex-1"
              >
                <Select.Trigger className="w-full h-10 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-lg px-3 flex items-center justify-between text-left text-sm text-neutral-800 dark:text-neutral-200">
                  <Select.Value placeholder="All Scopes" />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <ListBox className="p-1 gap-1">
                    {scopeCategories.map((scope) => (
                      <ListBox.Item
                        id={scope}
                        key={scope}
                        textValue={scope}
                        className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-md text-sm text-neutral-700 dark:text-neutral-300 flex items-center justify-between"
                      >
                        {scope}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              {/* Reset Filter Button */}
              <Button
                isIconOnly
                variant="flat"
                radius="lg"
                onClick={handleResetLocal}
                aria-label="Reset Filters"
                className="h-10 w-10 min-w-0 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                <Funnel className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  function handleResetLocal() {
    onReset();
  }
}
