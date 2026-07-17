'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@heroui/react';
import { Globe, ShieldCheck, Person } from '@gravity-ui/icons';

/**
 * Enterprise Navbar manually composed using HTML5 tags and Tailwind CSS classes
 * in compliance with HeroUI v3 component guidelines.
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Audits', href: '/explore' },
    { label: 'About', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-200/40 bg-white/70 backdrop-blur-lg dark:border-neutral-800/40 dark:bg-neutral-900/70 transition-colors duration-300">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile hamburger menu toggle */}
          <button
            className="md:hidden text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          
          {/* Logo brand configuration */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              GreenPulse AI
            </span>
          </Link>
        </div>

        {/* Desktop navigation listing */}
        <ul className="hidden items-center gap-6 md:flex list-none p-0 m-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side access triggers */}
        <div className="flex items-center gap-3">
          <Button isIconOnly aria-label="Language options" className="text-neutral-500 dark:text-neutral-400 min-w-0 h-9 w-9 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Globe className="h-5 w-5" />
          </Button>

          <Link
            href="/login"
            className="bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm font-semibold h-9 px-4 flex items-center justify-center gap-1.5 rounded-lg text-sm transition-colors duration-200"
          >
            <Person className="h-4 w-4" />
            <span>Login</span>
          </Link>
        </div>
      </header>

      {/* Mobile drawer overlays */}
      {isMenuOpen && (
        <div className="border-t border-neutral-100 dark:border-neutral-800 md:hidden bg-white dark:bg-neutral-900">
          <ul className="flex flex-col gap-2 p-4 list-none p-0 m-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-4 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
