'use client';

import React, { useState, useEffect } from 'react';
import { Pagination } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import type { IEsgAudit } from '../../../types/audit';
import AuditCard from '../../../components/audits/AuditCard';
import AuditSkeleton from '../../../components/audits/AuditSkeleton';
import AuditFilterBar from '../../../components/audits/AuditFilterBar';
import { getAudits } from '@/lib/api-client';


export default function ExplorePage() {
  // Query Filters state
  const [search, setSearch] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [riskRating, setRiskRating] = useState('');
  const [scopeCategory, setScopeCategory] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 8; // Render 8 items per page for better grid view layout

  // Reset page when filters modify
  useEffect(() => {
    setPage(1);
  }, [search, facilityType, riskRating, scopeCategory]);

  const handleReset = () => {
    setSearch('');
    setFacilityType('');
    setRiskRating('');
    setScopeCategory('');
  };

  // Perform backend query fetching via TanStack Query
  const { data, isLoading } = useQuery({
    queryKey: ['audits', { search, facilityType, riskRating, scopeCategory, page }],
    queryFn: () =>
      getAudits({
        search,
        facilityType,
        riskRating,
        scopeCategory,
        page,
        limit,
      }),
  });

  const total = data?.total ?? 0;
  const pages = data?.pages ?? 0;
  const paginatedAudits = (data?.results ?? []) as IEsgAudit[];
  const startIdx = (page - 1) * limit;


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
