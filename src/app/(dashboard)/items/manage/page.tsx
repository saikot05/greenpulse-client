'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAudits, deleteAudit } from '@/lib/api-client';
import { useSession } from '@/lib/auth-client';
import type { IEsgAudit } from '@/types/audit';
import { Card, Button, Chip, Spinner } from '@heroui/react';
import { Trash2, Eye, Leaf, Zap, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ManageAuditsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Auth Session Hook
  const { data: session, isPending: isSessionLoading } = useSession();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect layout: Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isSessionLoading && !session?.user) {
      router.push('/login');
    }
  }, [session, isSessionLoading, router]);

  // Fetch audits created by this user
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['manage-audits'],
    queryFn: () => getAudits({ limit: 100 }), // Fetch list
    enabled: !!session?.user,
  });

  // Mutation to delete audit
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAudit(id),
    onSuccess: () => {
      // Refetch audits list and invalidate React Query cache
      queryClient.invalidateQueries({ queryKey: ['manage-audits'] });
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      refetch();
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete audit.');
    }
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

  if (!mounted || isSessionLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-neutral-50/50 dark:bg-neutral-950">
        <Spinner size="lg" className="text-emerald-600" />
        <span className="text-sm text-neutral-500 dark:text-neutral-400">Loading session...</span>
      </div>
    );
  }

  if (!session?.user) {
    return null; // Prevent layout flashing
  }

  const allAudits = (data?.results ?? []) as IEsgAudit[];
  
  // Filter for audits created by the current logged-in user
  const userAudits = allAudits.filter(
    (audit) => String(audit.createdBy) === String(session.user.id)
  );

  return (
    <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              Manage facility audits
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Review, inspect, or delete compliance records you have logged in the system.
            </p>
          </div>
          <Link href="/items/add">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm transition-colors shadow-md">
              Create New Audit
            </Button>
          </Link>
        </div>

        {/* Audit List Container */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spinner size="md" className="text-emerald-600" />
            <span className="text-xs text-neutral-400">Retrieving user environmental logs...</span>
          </div>
        ) : userAudits.length > 0 ? (
          /* Clean responsive layout: Grid card view for mobile/tablet, detailed table on desktop */
          <div className="space-y-4">
            
            {/* Desktop Table View */}
            <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-950 text-[10px] uppercase font-bold tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                    <th className="p-4 pl-6">Title & Facility</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Carbon (CO2e)</th>
                    <th className="p-4">Energy (kWh)</th>
                    <th className="p-4">Risk Rating</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
                  {userAudits.map((audit) => (
                    <tr key={audit._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="p-4 pl-6 space-y-1 max-w-md">
                        <span className="font-bold text-neutral-900 dark:text-neutral-50 block text-sm leading-snug break-words">
                          {audit.title}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase break-words pr-2">
                          {audit.facilityName} · {audit.facilityType} · FY{audit.auditYear}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                          {audit.location}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          {audit.carbonScoreTons.toLocaleString()} t
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {audit.energyUsageKwh.toLocaleString()} kWh
                        </span>
                      </td>
                      <td className="p-4">
                        <Chip color={getRiskChipColor(audit.riskRating)} variant="soft" size="sm" className="font-semibold">
                          {audit.riskRating}
                        </Chip>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/explore/${audit._id}`} title="View Detail">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 min-w-0 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-emerald-500">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <span title="Delete Audit" className="inline-block">
                            <Button
                              size="sm"
                              variant="outline"
                              isDisabled={deleteMutation.isPending}
                              onPress={() => {
                                if (confirm('Are you sure you want to delete this ESG audit?')) {
                                  deleteMutation.mutate(audit._id);
                                }
                              }}
                              className="h-8 w-8 p-0 min-w-0 border border-neutral-200 dark:border-neutral-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Grid View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {userAudits.map((audit) => (
                <Card key={audit._id} className="p-5 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <span className="font-bold text-neutral-950 dark:text-white block text-sm leading-snug">
                      {audit.title}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase">
                      {audit.facilityName} · {audit.facilityType} · FY{audit.auditYear}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-neutral-100 dark:border-neutral-800 py-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Carbon</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                        <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                        {audit.carbonScoreTons} t
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Energy</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        {audit.energyUsageKwh} kWh
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <Chip color={getRiskChipColor(audit.riskRating)} variant="soft" size="sm" className="font-semibold">
                      {audit.riskRating}
                    </Chip>
                    <div className="flex gap-2">
                      <Link href={`/explore/${audit._id}`}>
                        <Button size="sm" variant="outline" className="h-9 px-3 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        isDisabled={deleteMutation.isPending}
                        onPress={() => {
                          if (confirm('Are you sure you want to delete this ESG audit?')) {
                            deleteMutation.mutate(audit._id);
                          }
                        }}
                        className="h-9 px-3 border border-neutral-200 dark:border-neutral-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-base font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              No audits registered under your account
            </span>
            <p className="text-xs text-neutral-400 max-w-xs mb-6">
              Create a new audit manually or use the AI invoice OCR parser to compile raw carbon telemetry logs.
            </p>
            <Link href="/items/add">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm transition-colors">
                Log Your First Audit
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
