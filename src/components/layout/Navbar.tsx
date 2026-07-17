'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button
} from '@heroui/react';
import { Globe, ShieldCheck, Person } from '@gravity-ui/icons';

/**
 * Enterprise Navbar using HeroUI and Gravity UI Icons.
 * Responsive navigation, sticky wrapper, and brand links.
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
    <HeroNavbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200/40 dark:border-neutral-800/40"
    >
      {/* Brand logo details */}
      <NavbarBrand>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
            GreenPulse AI
          </span>
        </Link>
      </NavbarBrand>

      {/* Desktop view navigation items */}
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <NavbarItem key={link.href} isActive={isActive}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
                }`}
              >
                {link.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Action triggers */}
      <NavbarContent justify="end" className="gap-3">
        <NavbarItem className="hidden sm:flex">
          <Button isIconOnly variant="light" aria-label="Theme or Language option" className="text-neutral-500 dark:text-neutral-400">
            <Globe className="h-5 w-5" />
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            as={Link}
            href="/login"
            color="success"
            variant="solid"
            className="bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm font-semibold"
            startContent={<Person className="h-4 w-4" />}
          >
            Login
          </Button>
        </NavbarItem>

        {/* Mobile controls drawer trigger */}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
      </NavbarContent>

      {/* Responsive mobile menu options */}
      <NavbarMenu className="bg-white dark:bg-neutral-900/95 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex flex-col gap-2 pt-4 px-2">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <NavbarMenuItem key={`${link.href}-${index}`}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex w-full rounded-lg py-2.5 px-4 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  {link.label}
                </Link>
              </NavbarMenuItem>
            );
          })}
        </div>
      </NavbarMenu>
    </HeroNavbar>
  );
}
