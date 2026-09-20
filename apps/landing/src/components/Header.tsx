'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { LandingState } from '@/lib/types';

interface HeaderProps {
  onOpenModal: () => void;
}

export default function Header({ onOpenModal }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white font-bold shadow-md shadow-primary-500/20">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              nexaBoard
            </span>
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700 border border-primary-200/60">
              BETA v0.1
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="transition hover:text-primary-600">
            Fonctionnalités
          </a>
          <a href="#avant-apres" className="transition hover:text-primary-600">
            Pourquoi nexaBoard
          </a>
          <a href="#calculateur" className="transition hover:text-primary-600">
            Calculateur ROI
          </a>
          <a href="#comparatif" className="transition hover:text-primary-600">
            Comparatif
          </a>
          <a href="#tarifs" className="transition hover:text-primary-600">
            Tarifs
          </a>
          <a href="#roadmap" className="transition hover:text-primary-600">
            Roadmap
          </a>
          <a href="#faq" className="transition hover:text-primary-600">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://nexaboardapp.up.railway.app/auth/login"
            className="hidden sm:inline-block text-sm font-semibold text-slate-700 hover:text-primary-600 transition px-3 py-2"
          >
            Connexion
          </a>
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Rejoindre la Bêta
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition"
            aria-label="Menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
          {[
            { href: '#features', label: 'Fonctionnalités' },
            { href: '#avant-apres', label: 'Pourquoi nexaBoard' },
            { href: '#calculateur', label: 'Calculateur ROI' },
            { href: '#comparatif', label: 'Comparatif' },
            { href: '#tarifs', label: 'Tarifs' },
            { href: '#roadmap', label: 'Roadmap' },
            { href: '#faq', label: 'FAQ' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-600 hover:text-primary-600 transition py-1"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <a
              href="https://nexaboardapp.up.railway.app/auth/login"
              className="block text-sm font-semibold text-slate-700 hover:text-primary-600 transition py-1"
            >
              Connexion
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
