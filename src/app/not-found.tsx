'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white px-6 py-12 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Decorative Eco-Anomaly SVG / Graphic */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
            />
          </svg>
        </div>

        {/* Heading & Information */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
            404 - Page Not Found
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            The green energy asset or page you are looking for does not exist or has been shifted.
          </p>
        </div>

        {/* Return Button */}
        <div className="pt-4">
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-6 rounded-xl transition-all shadow-md shadow-emerald-500/25">
              Return to Dashboard
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
