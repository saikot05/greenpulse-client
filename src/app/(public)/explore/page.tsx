'use client';

import React, { useState, useEffect } from 'react';
import { Pagination } from '@heroui/react';
import type { IEsgAudit } from '../../../types/audit';
import AuditCard from '../../../components/audits/AuditCard';
import AuditSkeleton from '../../../components/audits/AuditSkeleton';
import AuditFilterBar from '../../../components/audits/AuditFilterBar';

const MOCK_AUDITS: IEsgAudit[] = [
  {
    _id: '1',
    title: 'Q1 Carbon Performance Review',
    facilityName: 'Dallas Mega-Factory',
    facilityType: 'Manufacturing',
    location: 'Dallas, TX',
    auditYear: 2026,
    scopeCategory: 'Scope 1 (Direct)',
    carbonScoreTons: 12450,
    energyUsageKwh: 4500000,
    riskRating: 'High Emissions',
    shortDescription: 'High-volume production facility with significant direct natural gas combustion for thermal processes.',
    fullOverview: 'Overview of Dallas facility emissions.',
    tags: ['CO2', 'Natural Gas', 'FY26'],
    createdBy: 'user_1',
    aiInsights: {
      decarbonizationPriority: 'High',
      estimatedCostSavingsUsd: 120000,
      recommendedActions: ['Electrify thermal heating systems', 'Install heat recovery loops'],
    },
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    _id: '2',
    title: 'Green Grid Data Center Audit',
    facilityName: 'Ashburn DC-3',
    facilityType: 'Data Center',
    location: 'Ashburn, VA',
    auditYear: 2025,
    scopeCategory: 'Scope 2 (Indirect Energy)',
    carbonScoreTons: 2100,
    energyUsageKwh: 12500000,
    riskRating: 'Low Carbon',
    shortDescription: 'Hyperscale facility utilizing 100% virtual power purchase agreements (vPPAs) for offset matching.',
    fullOverview: 'Overview of Ashburn data center electricity matching.',
    tags: ['PPA', 'PUE', 'Offset'],
    createdBy: 'user_1',
    aiInsights: {
      decarbonizationPriority: 'Low',
      estimatedCostSavingsUsd: 85000,
      recommendedActions: ['Optimize liquid cooling loops', 'Upgrade server hardware density'],
    },
    createdAt: '2026-02-10T10:30:00Z',
    updatedAt: '2026-02-10T10:30:00Z',
  },
  {
    _id: '3',
    title: 'Corporate Headquarters Assessment',
    facilityName: 'HQ Plaza Tower',
    facilityType: 'Corporate Office',
    location: 'New York, NY',
    auditYear: 2026,
    scopeCategory: 'Scope 2 (Indirect Energy)',
    carbonScoreTons: 950,
    energyUsageKwh: 3200000,
    riskRating: 'Moderate Impact',
    shortDescription: 'Office skyscraper with optimized HVAC schedule controls but limited solar canopy surface area.',
    fullOverview: 'Overview of Manhattan tower commercial electricity usage.',
    tags: ['LEED', 'HVAC', 'Smart-Building'],
    createdBy: 'user_2',
    aiInsights: {
      decarbonizationPriority: 'Medium',
      estimatedCostSavingsUsd: 42000,
      recommendedActions: ['Install smart window glazes', 'Upgrade perimeter LED light zones'],
    },
    createdAt: '2026-03-01T09:15:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
  },
  {
    _id: '4',
    title: 'Logistics Distribution Footprint',
    facilityName: 'Midwest Hub - 12',
    facilityType: 'Logistics Hub',
    location: 'Chicago, IL',
    auditYear: 2026,
    scopeCategory: 'Scope 3 (Value Chain)',
    carbonScoreTons: 8400,
    energyUsageKwh: 1800000,
    riskRating: 'High Emissions',
    shortDescription: 'Cross-dock depot with significant transport emissions and aging warehouse heating equipment.',
    fullOverview: 'Overview of freight delivery scope 3 chain.',
    tags: ['Scope-3', 'Freight', 'Fleet'],
    createdBy: 'user_2',
    aiInsights: {
      decarbonizationPriority: 'High',
      estimatedCostSavingsUsd: 95000,
      recommendedActions: ['Introduce electric delivery vans', 'Transition heating to geothermal pumps'],
    },
    createdAt: '2026-03-12T14:40:00Z',
    updatedAt: '2026-03-12T14:40:00Z',
  },
  {
    _id: '5',
    title: 'Silicon Valley DC Expansion Audit',
    facilityName: 'Santa Clara DC-5',
    facilityType: 'Data Center',
    location: 'Santa Clara, CA',
    auditYear: 2026,
    scopeCategory: 'Scope 2 (Indirect Energy)',
    carbonScoreTons: 4200,
    energyUsageKwh: 24000000,
    riskRating: 'Moderate Impact',
    shortDescription: 'Dense computing facility with high grid power draws. Planning local solar arrays installation.',
    fullOverview: 'Overview of Silicon Valley energy efficiency.',
    tags: ['Renewables', 'PUE', 'Cooling'],
    createdBy: 'user_1',
    aiInsights: {
      decarbonizationPriority: 'Medium',
      estimatedCostSavingsUsd: 180000,
      recommendedActions: ['Incorporate free-air cooling dampers', 'Install onsite solar storage battery arrays'],
    },
    createdAt: '2026-04-02T11:00:00Z',
    updatedAt: '2026-04-02T11:00:00Z',
  },
  {
    _id: '6',
    title: 'Retail Store Decarbonization Audit',
    facilityName: 'Metro Outlet Centre',
    facilityType: 'Retail Store',
    location: 'Los Angeles, CA',
    auditYear: 2025,
    scopeCategory: 'Scope 2 (Indirect Energy)',
    carbonScoreTons: 350,
    energyUsageKwh: 980000,
    riskRating: 'Low Carbon',
    shortDescription: 'Modern flagship outlet equipped with high-efficiency refrigeration and smart lighting profiles.',
    fullOverview: 'LA retail efficiency audit results.',
    tags: ['Retail', 'LED', 'Smart-Grid'],
    createdBy: 'user_3',
    aiInsights: {
      decarbonizationPriority: 'Low',
      estimatedCostSavingsUsd: 15000,
      recommendedActions: ['Optimize off-hour thermostat setbacks'],
    },
    createdAt: '2026-04-18T16:20:00Z',
    updatedAt: '2026-04-18T16:20:00Z',
  },
  {
    _id: '7',
    title: 'European Manufacturing Center Audit',
    facilityName: 'Munich Assembly-1',
    facilityType: 'Manufacturing',
    location: 'Munich, Germany',
    auditYear: 2026,
    scopeCategory: 'Scope 1 (Direct)',
    carbonScoreTons: 15300,
    energyUsageKwh: 8200000,
    riskRating: 'Critical Failure',
    shortDescription: 'Industrial assembly site with coal-fired boilers requiring immediate replacement to meet regional regulations.',
    fullOverview: 'Boiler emissions breakdown at Munich plant.',
    tags: ['Boiler', 'Compliance', 'EU-ETS'],
    createdBy: 'user_1',
    aiInsights: {
      decarbonizationPriority: 'High',
      estimatedCostSavingsUsd: 280000,
      recommendedActions: ['Replace coal boiler with green hydrogen system', 'Install carbon capture scrubbers'],
    },
    createdAt: '2026-05-01T07:30:00Z',
    updatedAt: '2026-05-01T07:30:00Z',
  },
  {
    _id: '8',
    title: 'Seattle Office Microgrid Audit',
    facilityName: 'Emerald Office Park',
    facilityType: 'Corporate Office',
    location: 'Seattle, WA',
    auditYear: 2026,
    scopeCategory: 'Scope 2 (Indirect Energy)',
    carbonScoreTons: 150,
    energyUsageKwh: 1100000,
    riskRating: 'Low Carbon',
    shortDescription: 'Net-zero ready building running on local solar and hydropower purchase agreements.',
    fullOverview: 'Seattle commercial microgrid details.',
    tags: ['Net-Zero', 'Microgrid', 'Hydro'],
    createdBy: 'user_3',
    aiInsights: {
      decarbonizationPriority: 'Low',
      estimatedCostSavingsUsd: 8000,
      recommendedActions: ['Configure smart EV charger load balancing'],
    },
    createdAt: '2026-05-15T09:00:00Z',
    updatedAt: '2026-05-15T09:00:00Z',
  },
  {
    _id: '9',
    title: 'Logistics Cold Storage Review',
    facilityName: 'Atlanta Cold Depot',
    facilityType: 'Logistics Hub',
    location: 'Atlanta, GA',
    auditYear: 2026,
    scopeCategory: 'Scope 2 (Indirect Energy)',
    carbonScoreTons: 3800,
    energyUsageKwh: 6400000,
    riskRating: 'Moderate Impact',
    shortDescription: 'Heavy refrigeration facility. Investigating coolant leaks and insulation replacements.',
    fullOverview: 'Atlanta cooling units compressor audits.',
    tags: ['Refrigeration', 'Insulation', 'HFCs'],
    createdBy: 'user_2',
    aiInsights: {
      decarbonizationPriority: 'Medium',
      estimatedCostSavingsUsd: 55000,
      recommendedActions: ['Upgrade cold room door seals', 'Switch to low-GWP refrigerants'],
    },
    createdAt: '2026-06-02T10:45:00Z',
    updatedAt: '2026-06-02T10:45:00Z',
  },
  {
    _id: '10',
    title: 'Retail Outlets Fleet Integration',
    facilityName: 'Dallas Retail District',
    facilityType: 'Retail Store',
    location: 'Dallas, TX',
    auditYear: 2026,
    scopeCategory: 'Scope 3 (Value Chain)',
    carbonScoreTons: 2900,
    energyUsageKwh: 450000,
    riskRating: 'Moderate Impact',
    shortDescription: 'Analyzing supplier shipping footprint and last-mile delivery routes across the metropolitan zone.',
    fullOverview: 'Dallas regional store logistics audit.',
    tags: ['Supply-Chain', 'Logistics', 'Last-Mile'],
    createdBy: 'user_1',
    aiInsights: {
      decarbonizationPriority: 'Medium',
      estimatedCostSavingsUsd: 38000,
      recommendedActions: ['Consolidate local courier runs', 'Partner with postal carriers using green fleets'],
    },
    createdAt: '2026-06-19T13:00:00Z',
    updatedAt: '2026-06-19T13:00:00Z',
  },
  {
    _id: '11',
    title: 'East Coast Distribution Center',
    facilityName: 'Boston Storage Park',
    facilityType: 'Logistics Hub',
    location: 'Boston, MA',
    auditYear: 2025,
    scopeCategory: 'Scope 1 (Direct)',
    carbonScoreTons: 7100,
    energyUsageKwh: 1200000,
    riskRating: 'High Emissions',
    shortDescription: 'Large warehouse using propane forklifts and diesel standby generators. Upgrades needed.',
    fullOverview: 'Standby assets emissions profile.',
    tags: ['Diesel', 'Propane', 'Electrification'],
    createdBy: 'user_2',
    aiInsights: {
      decarbonizationPriority: 'High',
      estimatedCostSavingsUsd: 72000,
      recommendedActions: ['Replace propane forklifts with lithium-ion units', 'Install backup battery systems'],
    },
    createdAt: '2026-07-01T15:30:00Z',
    updatedAt: '2026-07-01T15:30:00Z',
  },
  {
    _id: '12',
    title: 'Legacy Assembly Plant Review',
    facilityName: 'Detroit Assembly Plant',
    facilityType: 'Manufacturing',
    location: 'Detroit, MI',
    auditYear: 2026,
    scopeCategory: 'Scope 1 (Direct)',
    carbonScoreTons: 19800,
    energyUsageKwh: 9500000,
    riskRating: 'Critical Failure',
    shortDescription: 'Heavy vehicle assembly facility with aging pneumatic equipment, furnace losses, and steam leaks.',
    fullOverview: 'Pneumatics losses at Detroit site.',
    tags: ['Pneumatics', 'Furnace', 'Steam-Leaks'],
    createdBy: 'user_1',
    aiInsights: {
      decarbonizationPriority: 'High',
      estimatedCostSavingsUsd: 310000,
      recommendedActions: ['Deploy ultrasonic leak detectors', 'Upgrade induction melting furnaces'],
    },
    createdAt: '2026-07-10T11:20:00Z',
    updatedAt: '2026-07-10T11:20:00Z',
  }
];

export default function ExplorePage() {
  // Query Filters state
  const [search, setSearch] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [riskRating, setRiskRating] = useState('');
  const [scopeCategory, setScopeCategory] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 4; // Render 4 items per page for visual layout testing

  // Skeleton loading effect
  const [isLoading, setIsLoading] = useState(true);

  // Reset page when filters modify
  useEffect(() => {
    setPage(1);
  }, [search, facilityType, riskRating, scopeCategory]);

  // Simulate loader shimmers on query modifications
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [search, facilityType, riskRating, scopeCategory, page]);

  const handleReset = () => {
    setSearch('');
    setFacilityType('');
    setRiskRating('');
    setScopeCategory('');
  };

  // Perform client side query filtering
  const filteredAudits = MOCK_AUDITS.filter((audit) => {
    if (search) {
      const query = search.toLowerCase();
      const matchTitle = audit.title.toLowerCase().includes(query);
      const matchFacility = audit.facilityName.toLowerCase().includes(query);
      const matchLoc = audit.location.toLowerCase().includes(query);
      if (!matchTitle && !matchFacility && !matchLoc) {
        return false;
      }
    }
    if (facilityType && audit.facilityType !== facilityType) {
      return false;
    }
    if (riskRating && audit.riskRating !== riskRating) {
      return false;
    }
    if (scopeCategory && audit.scopeCategory !== scopeCategory) {
      return false;
    }
    return true;
  });

  const total = filteredAudits.length;
  const pages = Math.ceil(total / limit);
  const startIdx = (page - 1) * limit;
  const paginatedAudits = filteredAudits.slice(startIdx, startIdx + limit);

  return (
    <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 transition-colors duration-300 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            ESG Compliance Tracking
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Explore Facilities & Audits
          </h1>
          <p className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Inspect verified carbon scores, energy metrics, and AI mitigation insights across your organization's facilities.
          </p>
        </div>

        {/* Filter controls */}
        <AuditFilterBar
          search={search}
          facilityType={facilityType}
          riskRating={riskRating}
          scopeCategory={scopeCategory}
          setSearch={setSearch}
          setFacilityType={setFacilityType}
          setRiskRating={setRiskRating}
          setScopeCategory={setScopeCategory}
          onReset={handleReset}
        />

        {/* Query Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>
              Showing {total > 0 ? startIdx + 1 : 0} - {Math.min(startIdx + limit, total)} of {total} audits found
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: limit }).map((_, idx) => (
                <AuditSkeleton key={idx} />
              ))}
            </div>
          ) : paginatedAudits.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedAudits.map((audit) => (
                <AuditCard key={audit._id} audit={audit} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-base font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                No matching audits found
              </span>
              <p className="text-xs text-neutral-400 max-w-xs mb-4">
                Try widening your keyword search or adjusting the risk and scope categories filters.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination controls using HeroUI v3 compound syntax */}
          {!isLoading && pages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination size="md">
                <Pagination.Content className="flex items-center gap-1.5 list-none m-0 p-0">
                  <Pagination.Previous
                    isDisabled={page === 1}
                    onPress={() => setPage(page - 1)}
                    className={`h-9 px-3 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center ${
                      page === 1 ? 'opacity-50 cursor-not-allowed text-neutral-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 cursor-pointer text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    Previous
                  </Pagination.Previous>
                  
                  {Array.from({ length: pages }).map((_, idx) => {
                    const p = idx + 1;
                    return (
                      <Pagination.Item key={p}>
                        <Pagination.Link
                          isActive={p === page}
                          onPress={() => setPage(p)}
                          className={`h-9 w-9 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                            p === page
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 cursor-pointer text-neutral-600 dark:text-neutral-300'
                          }`}
                        >
                          {p}
                        </Pagination.Link>
                      </Pagination.Item>
                    );
                  })}

                  <Pagination.Next
                    isDisabled={page === pages}
                    onPress={() => setPage(page + 1)}
                    className={`h-9 px-3 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center ${
                      page === pages ? 'opacity-50 cursor-not-allowed text-neutral-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 cursor-pointer text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    Next
                  </Pagination.Next>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
