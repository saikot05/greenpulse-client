'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import {
  ShieldCheck,
  Person,
  ArrowRightFromSquare,
  ChartColumn,
  LayoutHeader,
  Gear,
} from '@gravity-ui/icons';
import { useSession, signOut } from '@/lib/auth-client';
import ThemeToggle from '@/components/shared/ThemeToggle';

/* --- Nav link definitions ------------------------------------------------ */
const PUBLIC_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore Audits', href: '/explore' },
  { label: 'Analytics', href: '/carbon-analysis' },
  { label: 'About', href: '/about' },
];

const AUTH_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore Audits', href: '/explore' },
  { label: 'Add Audit', href: '/items/add' },
  { label: 'Manage Audits', href: '/items/manage' },
  { label: 'Telemetry Analyzer', href: '/carbon-analysis' },
  { label: 'Help & Support', href: '/support' },
];

/* --- User avatar helpers -------------------------------------------------- */
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Simple colour from name hash so initials avatar has a consistent colour */
function avatarColour(name: string): string {
  const palette = [
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-violet-500',
    'bg-indigo-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

/* --- Avatar Dropdown ------------------------------------------------------ */
function UserDropdown({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.push('/');
    router.refresh();
  };

  const initials = getInitials(name);
  const colour = avatarColour(name);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        id="user-menu-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User Menu"
        className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-9 w-9 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700 hover:border-emerald-400 transition-colors"
          />
        ) : (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold shadow-sm ${colour} hover:opacity-90 transition-opacity`}
          >
            {initials}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          aria-labelledby="user-menu-button"
          className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-900/10 dark:shadow-black/30 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 truncate">
              {name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <DropdownLink href="/items/manage" icon={<Person className="h-4 w-4" />} onClick={() => setOpen(false)}>
              Profile
            </DropdownLink>
            <DropdownLink href="/items/manage" icon={<ChartColumn className="h-4 w-4" />} onClick={() => setOpen(false)}>
              Dashboard
            </DropdownLink>
            <DropdownLink href="/items/manage" icon={<Gear className="h-4 w-4" />} onClick={() => setOpen(false)}>
              Settings
            </DropdownLink>
          </div>

          {/* Sign out */}
          <div className="border-t border-neutral-100 dark:border-neutral-800 py-1.5">
            <button
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150"
            >
              <ArrowRightFromSquare className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  icon,
  onClick,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-150"
    >
      <span className="text-neutral-400 dark:text-neutral-500">{icon}</span>
      {children}
    </Link>
  );
}

/* --- Main Navbar ---------------------------------------------------------- */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const isAuthenticated = !!session?.user;
  const navLinks = isAuthenticated ? AUTH_LINKS : PUBLIC_LINKS;

  const user = session?.user;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-200/60 bg-white/80 backdrop-blur-lg dark:border-neutral-800/50 dark:bg-neutral-950/80 transition-colors duration-300">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left — hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              GreenPulse AI
            </span>
          </Link>
        </div>

        {/* Centre — desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex list-none p-0 m-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right — theme toggle + auth controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Skeleton while session is loading */}
          {isPending ? (
            <div className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          ) : isAuthenticated && user ? (
            <UserDropdown
              name={user.name ?? 'User'}
              email={user.email}
              image={user.image}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 h-9 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors duration-200"
              >
                <Person className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 h-9 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-500/20 transition-colors duration-200"
              >
                <LayoutHeader className="h-4 w-4" />
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="border-t border-neutral-100 dark:border-neutral-800 md:hidden bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md">
          <ul className="flex flex-col gap-1 p-3 list-none m-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* Mobile auth shortcuts */}
            {!isAuthenticated && (
              <li className="border-t border-neutral-100 dark:border-neutral-800 mt-2 pt-2">
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                  >
                    <Person className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
