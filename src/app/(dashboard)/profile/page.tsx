'use client';

import React from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, Button, Spinner } from '@heroui/react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-neutral-50/50 dark:bg-neutral-950">
        <Spinner size="lg" className="text-emerald-600" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-neutral-500">Please sign in to view your profile.</p>
        <Link href="/login">
          <Button className="bg-emerald-600 text-white font-semibold rounded-lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  const user = session.user;
  const [imageError, setImageError] = React.useState(false);
  const userInitial = user.name?.charAt(0).toUpperCase() || 'U';
  const hasAvatar = user.image && !imageError;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          Profile Settings
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Manage your personal information and GreenPulse workspace access credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* User Card */}
        <Card className="md:col-span-4 p-6 border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-lg shadow-emerald-500/5 flex flex-col items-center justify-center text-center space-y-4">
          {hasAvatar ? (
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-emerald-500/20 bg-neutral-200 dark:bg-neutral-800 shadow-inner">
              <img
                src={user.image!}
                alt={user.name}
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full border-2 border-emerald-500/20 bg-emerald-700/80 dark:bg-emerald-950/60 backdrop-blur-md flex items-center justify-center font-bold text-2xl text-white shadow-inner">
              {userInitial}
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-50">{user.name}</h3>
            <p className="text-xs text-neutral-500">{user.email}</p>
          </div>
          <span className="inline-flex items-center rounded-md bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            ESG Auditor
          </span>
        </Card>

        {/* Update Profile Card */}
        <Card className="md:col-span-8 p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-6">
          <h3 className="text-md font-bold text-neutral-900 dark:text-white pb-3 border-b border-neutral-100 dark:border-neutral-800">
            Account Details
          </h3>
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400 font-bold uppercase tracking-wider">Full Name</span>
              <span className="col-span-2 text-neutral-800 dark:text-neutral-200 font-semibold">{user.name}</span>
            </div>
            <div className="grid grid-cols-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400 font-bold uppercase tracking-wider">Email Address</span>
              <span className="col-span-2 text-neutral-800 dark:text-neutral-200 font-semibold">{user.email}</span>
            </div>
            <div className="grid grid-cols-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400 font-bold uppercase tracking-wider">Role Type</span>
              <span className="col-span-2 text-neutral-800 dark:text-neutral-200 font-semibold">Workspace Administrator</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button isDisabled className="bg-emerald-600/50 text-white font-semibold rounded-lg text-xs cursor-not-allowed">
              Update Profile (Read Only)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
