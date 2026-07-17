'use client';

import React from 'react';
import { Card, Skeleton } from '@heroui/react';

/**
 * Audit Skeleton loader replicating the AuditCard structure using HeroUI Skeleton.
 */
export default function AuditSkeleton() {
  return (
    <Card className="w-full flex flex-col h-full border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden" variant="default">
      {/* Top visual area skeleton */}
      <Skeleton className="h-44 w-full rounded-t-2xl" />

      {/* Main card details skeleton blocks */}
      <Card.Header className="flex flex-col items-start gap-3 p-5 pb-2">
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
      </Card.Header>

      <Card.Content className="px-5 py-2 flex-1 flex flex-col gap-4">
        {/* Location and risk status row */}
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-4 w-1/3 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Short description block */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded-lg" />
          <Skeleton className="h-3 w-5/6 rounded-lg" />
        </div>

        {/* Scope metrics grid */}
        <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 mt-auto">
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/2 rounded-lg" />
            <Skeleton className="h-4 w-4/5 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/2 rounded-lg" />
            <Skeleton className="h-4 w-4/5 rounded-lg" />
          </div>
        </div>
      </Card.Content>

      <Card.Footer className="px-5 pb-5 pt-2">
        <Skeleton className="h-9 w-full rounded-lg" />
      </Card.Footer>
    </Card>
  );
}
