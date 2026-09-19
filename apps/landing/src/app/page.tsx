'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';

interface SubscribedData {
  id: string;
  email: string;
  position: number;
  referralCode?: string;
}

export default function LandingPage() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState<'1-5' | '6-10' | '11-20' | '20+'>('6-10');
  const [currentTool, setCurrentTool] = useState<
    'trello' | 'notion' | 'asana' | 'clickup' | 'other' | 'none'
  >('notion');
  const [interest, setInterest] = useState<
    'all_in_one' | 'tasks' | 'notes' | 'calendar' | 'cost_savings'
  >('all_in_one');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Interactive Product Preview Tab
  const [activeTab, setActiveTab] = useState<'kanban' | 'notes' | 'calendar'>('kanban');

  // ROI Calculator state
  const [calcTeamSize, setCalcTeamSize] = useState<number>(10);
  const [calcTools, setCalcTools] = useState<{ [key: string]: boolean }>({
    notion: true,
    trello: true,
    asana: false,
    todoist: false,
  });

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://nexaboard-production.up.railway.app';

  // Calculator logic
  const toolPrices: { [key: string]: { name: string; price: number } } = {
    notion: { name: 'Notion (10 €/pers)', price: 10 },
    trello: { name: 'Trello Pro (6 €/pers)', price: 6 },
    asana: { name: 'Asana Starter (11 €/pers)', price: 11 },
    todoist: { name: 'Todoist Business (8 €/pers)', price: 8 },
  };

  const monthlyCompetitorCost = Object.entries(calcTools).reduce((acc, [tool, enabled]) => {
    return enabled ? acc + (toolPrices[tool]?.price || 0) * calcTeamSize : acc;
  }, 0);

  const nexaBoardMonthly = 12; // Flat fee per team in future plan Pro (0€ during beta)
  const monthlySavings = Math.max(0, monthlyCompetitorCost - nexaBoardMonthly);
  const yearlySavings = monthlySavings * 12;
  const hoursSavedYearly = calcTeamSize * 110; // ~2.5 hours/week saved per person

  function handleOpenModalWithEmail(initialEmail?: string) {
    if (initialEmail) {
      setEmail(initialEmail);
    }
    setErrorMessage('');
    setIsModalOpen(true);
  }

  async function handleFinalSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. Appel en même-origine (Same-Origin) via le Route Handler Next.js pour éviter les blocages CORS
      let res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          teamSize,
          currentTool,
          interest: interest === 'all_in_one' ? undefined : interest,
        }),
      });

      // 2. Fallback si l'API route interne n'est pas disponible
      if (res.status === 404) {
        res = await fetch(`${apiBase}/api/v1/beta/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            teamSize,
            currentTool,
            interest: interest === 'all_in_one' ? undefined : interest,
          }),
        });
      }

      const data = await res.json();

      if (res.status === 409) {
        // Already registered - redirect with existing position
        const pos = data.error?.position || 14;
        window.location.assign(
          `/merci?email=${encodeURIComponent(email)}&position=${pos}&status=already`,
        );
        return;
      }

      if (!res.ok) {
        throw new Error(
          data.message || data.error?.message || 'Une erreur est survenue lors de l’inscription.',
        );
      }

      const subscriber: SubscribedData = data.data;
      window.location.assign(
        `/merci?email=${encodeURIComponent(subscriber.email)}&position=${subscriber.position}&ref=${encodeURIComponent(subscriber.referralCode || '')}`,
      );
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Erreur de connexion au serveur. Réessayez dans un instant.',
      );
    }
  }

  const faqItems = [
    {
      q: 'Qu’implique concrètement de rejoindre la cohorte Bêta fermée ?',
      a: 'Vous obtenez un accès immédiat et 100% gratuit à nexaBoard pour votre équipe. Toutes les fonctionnalités actuelles sont débloquées sans restriction. Votre seul engagement : nous faire part de vos retours d’expérience pour nous aider à parfaire l’outil avant le lancement public.',
    },
    {
      q: 'Quels sont les avantages exclusifs offerts aux membres pionniers ?',
      a: 'Toutes les équipes inscrites dans les 100 premières places bénéficient de 1 an de Plan Pro offert lors du lancement officiel, ainsi que du statut permanent de Membre Fondateur garantissant un tarif préférentiel à vie.',
    },
    {
      q: 'Où sont hébergées mes données et sont-elles sécurisées ?',
      a: 'La souveraineté et la confidentialité de vos données sont absolues. Notre infrastructure et nos bases de données sont hébergées en France (Paris). Vos données sont chiffrées au repos (AES-256) et en transit (TLS 1.3), en stricte conformité avec le RGPD.',
    },
    {
      q: 'Puis-je exporter mes données si je décide de quitter nexaBoard ?',
      a: 'Absolument. Nous appliquons une politique zéro verrouillage (anti lock-in) : vous pouvez exporter l’intégralité de vos notes en Markdown, et vos projets et tâches au format CSV/JSON en 1 clic à tout moment.',
    },
    {
      q: 'Comment s’effectue la migration depuis Trello ou Notion ?',
      a: 'La prise en main de nexaBoard est instantanée (moins de 3 minutes). L’interface reprend les repères visuels éprouvés du Kanban et des notes arborescentes. Un assistant d’importation directe est également prévu dans la phase 2 de notre feuille de route.',
    },
    {
      q: 'Devrai-je payer après la phase Bêta ?',
      a: 'Non, aucune carte bancaire n’est requise. À l’issue de la période bêta, vous disposerez de votre année complète de Plan Pro offerte sans obligation de renouvellement. Vous serez toujours libre de basculer sur le plan Découverte gratuit.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-primary-100 selection:text-primary-700">
      {/* 1. Header Sticky */}
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
            <a href="#faq" className="transition hover:text-primary-600">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://nexaboardapp.up.railway.app/auth/login"
              className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition px-3 py-2"
            >
              Connexion
            </a>
            <button
              type="button"
              onClick={() => handleOpenModalWithEmail()}
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Rejoindre la Bêta
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-[480px] w-[700px] rounded-full bg-gradient-to-tr from-primary-400/20 via-indigo-300/15 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-3.5 py-1 text-xs font-semibold text-primary-800 shadow-sm backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Cohorte Pionnière Ouverte • Plus que 34 places Bêta</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            La productivité enfin simple <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 bg-clip-text text-transparent">
              pour les petites équipes.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl leading-relaxed">
            nexaBoard réunit vos tableaux de tâches, vos notes d’équipe et votre calendrier dans une
            plateforme ultra-rapide. Fini les allers-retours épuisants entre 5 abonnements payants.
          </p>

          {/* 1-Click Email Form */}
          <div className="mx-auto mt-8 max-w-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOpenModalWithEmail(email);
              }}
              className="flex flex-col sm:flex-row gap-2 rounded-xl bg-white p-2 shadow-xl shadow-slate-200/60 border border-slate-200/80"
            >
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@entreprise.fr"
                  required
                  className="w-full rounded-lg border-0 py-3 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Obtenir mon accès Bêta →
              </button>
            </form>

            {/* Reassurance Micro-Copy */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <svg
                  className="h-3.5 w-3.5 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                100% Gratuit en Bêta
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <svg
                  className="h-3.5 w-3.5 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Zéro carte bancaire
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <svg
                  className="h-3.5 w-3.5 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Prise en main en 3 min
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                🇫🇷 Hébergé en France
              </span>
            </div>
          </div>

          {/* 3. Product Showcase (Interactive Mac Window Mockup) */}
          <div className="mt-14 lg:mt-18">
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-slate-900/5 p-2 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm sm:p-3">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {/* Window Topbar */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-xs font-medium text-slate-400">
                      nexaboard.io/app/workspace-sprint
                    </span>
                  </div>
                  {/* Interactive Tabs */}
                  <div className="flex items-center rounded-lg bg-slate-200/70 p-0.5 text-xs font-semibold text-slate-700">
                    <button
                      type="button"
                      onClick={() => setActiveTab('kanban')}
                      className={`rounded-md px-3 py-1 transition ${activeTab === 'kanban' ? 'bg-white text-primary-600 shadow-sm' : 'hover:text-slate-900'}`}
                    >
                      📋 Tâches (Kanban)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('notes')}
                      className={`rounded-md px-3 py-1 transition ${activeTab === 'notes' ? 'bg-white text-primary-600 shadow-sm' : 'hover:text-slate-900'}`}
                    >
                      📝 Notes Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('calendar')}
                      className={`rounded-md px-3 py-1 transition ${activeTab === 'calendar' ? 'bg-white text-primary-600 shadow-sm' : 'hover:text-slate-900'}`}
                    >
                      📅 Calendrier
                    </button>
                  </div>
                </div>

                {/* Window Content */}
                <div className="p-4 sm:p-6 bg-slate-50/50 min-h-[360px] text-left">
                  {activeTab === 'kanban' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Column 1: A faire */}
                      <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            À faire
                          </span>
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
                            2
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm hover:border-primary-400 transition">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                                Urgent
                              </span>
                              <span className="text-[11px] text-slate-400">Demain</span>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-800">
                              Finaliser le design onboarding
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              Valider les écrans avec l’équipe produit.
                            </p>
                            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                              <span>3 sous-tâches</span>
                              <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                                SM
                              </span>
                            </div>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
                            <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                              Moyen
                            </span>
                            <h4 className="text-sm font-semibold text-slate-800 mt-1.5">
                              Optimisation des requêtes API
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: En cours */}
                      <div className="rounded-xl border border-primary-100 bg-primary-50/40 p-3">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary-800">
                            En cours
                          </span>
                          <span className="rounded-full bg-primary-200 px-2 py-0.5 text-xs font-bold text-primary-800">
                            2
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          <div className="rounded-lg border border-primary-200 bg-white p-3.5 shadow-sm ring-1 ring-primary-500/20">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="rounded bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-800">
                                Sprint 1
                              </span>
                              <span className="text-[11px] text-emerald-600 font-medium">
                                En review
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-900">
                              Intégration du calendrier d’équipe
                            </h4>
                            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                              <span>Note liée: Spécifications v2</span>
                              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                                IB
                              </span>
                            </div>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                              Tech
                            </span>
                            <h4 className="text-sm font-semibold text-slate-800 mt-1.5">
                              Tests unitaires Jest (80%+)
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Column 3: Terminé */}
                      <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Terminé
                          </span>
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
                            4
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm opacity-85">
                            <span className="text-[11px] font-semibold text-emerald-600">
                              ✓ Livré
                            </span>
                            <h4 className="text-sm font-medium text-slate-700 line-through mt-0.5">
                              Schéma Prisma & migrations Postgres
                            </h4>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm opacity-85">
                            <span className="text-[11px] font-semibold text-emerald-600">
                              ✓ Livré
                            </span>
                            <h4 className="text-sm font-medium text-slate-700 line-through mt-0.5">
                              Mise en place de l’authentification JWT
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs space-y-2">
                        <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                          Pages d’équipe
                        </p>
                        <div className="rounded bg-primary-50 px-2 py-1 font-semibold text-primary-700">
                          📌 Cadrage Sprint 2026
                        </div>
                        <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 cursor-pointer">
                          Architecture technique
                        </div>
                        <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 cursor-pointer">
                          Guide des conventions
                        </div>
                      </div>
                      <div className="md:col-span-3 rounded-lg border border-slate-200 bg-white p-5">
                        <h3 className="text-lg font-bold text-slate-900">
                          # Cadrage Sprint Q4 — Objectifs & Livrables
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Dernière modification par Sarah il y a 20 min
                        </p>
                        <hr className="my-3 border-slate-100" />
                        <div className="text-sm text-slate-700 space-y-2">
                          <p>
                            Ce document centralise toutes les exigences du prochain incrément
                            produit nexaBoard.
                          </p>
                          <div className="bg-slate-50 border-l-4 border-primary-500 p-2.5 rounded text-xs text-slate-600">
                            <strong>Note :</strong> Toutes les tâches de ce document sont
                            automatiquement synchronisées avec le tableau Kanban.
                          </div>
                          <ul className="list-disc pl-5 text-xs space-y-1 text-slate-600 mt-2">
                            <li>[x] Modèle de données WorkspaceMember validé</li>
                            <li>[ ] Optimisation des temps de réponse API sous 100ms</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'calendar' && (
                    <div className="rounded-lg border border-slate-200 bg-white p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">
                          Semaine en cours — Septembre 2026
                        </h3>
                        <span className="text-xs font-semibold text-primary-600">
                          3 jalons clés cette semaine
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-center text-xs">
                        {['Lun 18', 'Mar 19', 'Mer 20', 'Jeu 21', 'Ven 22'].map((day, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 min-h-[140px] text-left"
                          >
                            <span className="font-bold text-slate-600 block mb-2">{day}</span>
                            {idx === 1 && (
                              <div className="rounded bg-primary-100 border border-primary-200 p-1.5 text-[11px] font-semibold text-primary-800">
                                🚀 Déploiement Bêta v0.1
                              </div>
                            )}
                            {idx === 3 && (
                              <div className="rounded bg-emerald-100 border border-emerald-200 p-1.5 text-[11px] font-semibold text-emerald-800">
                                🎯 Revue de sprint
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Barre de Confiance & Souveraineté */}
      <section className="border-y border-slate-200/70 bg-slate-50/80 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-2">
                🔒
              </div>
              <h4 className="text-sm font-bold text-slate-900">Hébergé en France</h4>
              <p className="text-xs text-slate-500 mt-1">Serveurs à Paris • Chiffrement AES-256</p>
            </div>

            <div className="p-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-2">
                ⚡
              </div>
              <h4 className="text-sm font-bold text-slate-900">Temps de réponse &lt; 100ms</h4>
              <p className="text-xs text-slate-500 mt-1">Zéro lag, architecture NestJS & Next.js</p>
            </div>

            <div className="p-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-2">
                📦
              </div>
              <h4 className="text-sm font-bold text-slate-900">Zéro Lock-in</h4>
              <p className="text-xs text-slate-500 mt-1">Export 1-clic en Markdown, CSV & JSON</p>
            </div>

            <div className="p-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-2">
                👥
              </div>
              <h4 className="text-sm font-bold text-slate-900">Pensé pour 5 à 20 pers.</h4>
              <p className="text-xs text-slate-500 mt-1">La simplicité sans lourdeur inutile</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pain vs Gain (Avant / Avec nexaBoard) */}
      <section id="avant-apres" className="py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Le problème du SaaS Sprawl
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Pourquoi multiplier les outils quand vous pouvez tout unifier ?
            </p>
            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
              Une petite équipe perd en moyenne 2,5 heures par semaine par collaborateur à basculer
              entre des applications disjointes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Avant */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 text-rose-700 font-bold text-sm uppercase tracking-wider mb-4">
                <span>❌ Le chaos quotidien (Sans nexaBoard)</span>
              </div>
              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>
                    <strong>5 onglets ouverts en permanence</strong> (Trello pour les cartes, Notion
                    pour les wikis, Google Calendar, Todoist, Slack).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Contexte fragmenté</strong> : des tâches orphelines sans documentation
                    associée, des dates limites oubliées.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Facture exorbitante</strong> : 40 € à 80 € par utilisateur chaque mois
                    pour des fonctionnalités sous-utilisées.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Courbe d’apprentissage lourde</strong> : 2 semaines pour former chaque
                    nouvel arrivant aux bases de données Notion.
                  </span>
                </li>
              </ul>
            </div>

            {/* Avec nexaBoard */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-6 sm:p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider mb-4">
                <span>✅ La clarté productive (Avec nexaBoard)</span>
              </div>
              <ul className="space-y-4 text-sm text-slate-800">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>
                    <strong>1 seul onglet réactif</strong> réunissant vos listes, vos tableaux
                    Kanban, vos notes et vos échéances.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>
                    <strong>Alignement total</strong> : chaque tâche est liée en direct à sa note de
                    cadrage et son événement de calendrier.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>
                    <strong>Coût juste et prévisible</strong> : 0 € en Bêta puis un forfait d’équipe
                    fixe à 12 €/mois (pas de piège par utilisateur).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>
                    <strong>Opérationnel en 3 minutes</strong> : interface évidente nécessitant zéro
                    formation ou configuration complexe.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bento Grid Showcase */}
      <section id="features" className="bg-slate-50/70 py-20 lg:py-24 border-t border-slate-200/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Fonctionnalités Clés
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Tout ce dont votre équipe a besoin. Rien de superflu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Large - Tasks */}
            <div className="md:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 text-2xl mb-5">
                📋
              </div>
              <div className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-3">
                ✅ Opérationnel dans votre espace
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Gestion des Tâches Agile (Kanban & Listes)
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Visualisez vos projets en colonnes Kanban fluides ou en listes compactes. Assignez
                des collaborateurs, définissez des sous-tâches, des priorités (Urgente, Haute,
                Moyenne) et suivez l'avancement en temps réel.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                <span className="rounded-md bg-slate-100 px-2.5 py-1">Glisser-déposer réactif</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1">
                  Sous-tâches hiérarchiques
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1">Filtres multicritères</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1">Assignations multiples</span>
              </div>
            </div>

            {/* Bento 2: Notes */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-2xl mb-5">
                📝
              </div>
              <div className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-3">
                ✅ Opérationnel dans votre espace
              </div>
              <h3 className="text-xl font-bold text-slate-900">Notes & Wiki Markdown</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Rédigez vos cadrages, comptes-rendus et documentations dans un éditeur rapide
                supportant le Markdown complet.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                <span className="rounded-md bg-slate-100 px-2.5 py-1">Arborescence par projet</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1">Blocs de code formatés</span>
              </div>
            </div>

            {/* Bento 3: Calendar */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 text-2xl mb-5">
                📅
              </div>
              <div className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-3">
                ✅ Opérationnel dans votre espace
              </div>
              <h3 className="text-xl font-bold text-slate-900">Calendrier d'Équipe</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Planifiez vos jalons clés, échéances de sprint et livrables sur une vue
                chronologique connectée directement à vos projets.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                <span className="rounded-md bg-slate-100 px-2.5 py-1">Vues jour / semaine</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1">
                  Liaison automatique tâches
                </span>
              </div>
            </div>

            {/* Bento 4: Large - Workspace */}
            <div className="md:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700 text-2xl mb-5">
                🏢
              </div>
              <div className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-3">
                ✅ Opérationnel dans votre espace
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Espaces de Travail & Rôles Collaboratifs
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Créez des espaces dédiés pour chaque département ou projet. Gérez précisément les
                rôles (Propriétaire, Admin, Membre, Observateur) et visualisez le tableau de bord
                avec les statistiques consolidées.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                <span className="rounded-md bg-slate-100 px-2.5 py-1">Dashboard analytique</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1">Multi-workspaces isolés</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1">
                  Contrôle d’accès sécurisé
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Calculateur d'Économies Anti-SaaS Sprawl */}
      <section id="calculateur" className="py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Calculateur d’Économies
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Combien gaspillez-vous en abonnements inutiles ?
            </p>
            <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
              Évaluez les économies immédiates réalisables en unifiant vos outils sous nexaBoard.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-8 sm:p-12 shadow-xl shadow-slate-200/50">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Controls */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-slate-800">
                      Taille de votre équipe :
                    </label>
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-extrabold text-primary-700">
                      {calcTeamSize} collaborateurs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={calcTeamSize}
                    onChange={(e) => setCalcTeamSize(Number(e.target.value))}
                    className="w-full accent-primary-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                    <span>5 pers.</span>
                    <span>15 pers.</span>
                    <span>25 pers.</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-3">
                    Outils actuellement payés :
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(toolPrices).map(([key, item]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setCalcTools((prev) => ({ ...prev, [key]: !prev[key] }))}
                        className={`flex items-center justify-between rounded-xl border p-3 text-xs font-semibold transition text-left ${
                          calcTools[key]
                            ? 'border-primary-500 bg-primary-50/60 text-primary-800 ring-1 ring-primary-500'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className="text-sm">{calcTools[key] ? '✓' : '+'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Output */}
              <div className="rounded-2xl border border-primary-200 bg-white p-7 shadow-lg text-center space-y-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Coût actuel estimé
                  </span>
                  <p className="text-2xl font-bold text-slate-700 mt-0.5">
                    {monthlyCompetitorCost} € <span className="text-xs text-slate-400">/ mois</span>
                  </p>
                </div>

                <div className="py-4 border-y border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Économies nettes avec nexaBoard
                  </span>
                  <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600 mt-1">
                    {yearlySavings.toLocaleString('fr-FR')} €
                    <span className="text-xs font-semibold text-slate-500 block sm:inline">
                      {' '}
                      / an
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    (Et 0 € d’abonnement pendant toute la phase Bêta !)
                  </p>
                </div>

                <div className="text-xs text-slate-600">
                  💡 <strong>+{hoursSavedYearly} heures</strong> de distraction et de copier-coller
                  évitées pour votre équipe.
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenModalWithEmail()}
                  className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700 transition"
                >
                  Réserver ma place Bêta et stopper les frais →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Tableau Comparatif Sans Concession */}
      <section
        id="comparatif"
        className="py-20 lg:py-24 bg-slate-50/60 border-t border-slate-200/80"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Comparatif de Marché
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Pourquoi choisir nexaBoard ?
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-4 sm:p-5 font-bold text-slate-900">Critères d’évaluation</th>
                  <th className="p-4 sm:p-5 font-extrabold text-primary-700 bg-primary-50/80 text-center">
                    nexaBoard
                  </th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-600 text-center">Notion</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-600 text-center">Trello</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-600 text-center">Asana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">
                    Prise en main immédiate (&lt; 3 min)
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-600 bg-primary-50/30 text-center">
                    ✓ Oui
                  </td>
                  <td className="p-4 sm:p-5 text-rose-500 text-center">✗ Lourd</td>
                  <td className="p-4 sm:p-5 text-emerald-600 text-center">✓ Oui</td>
                  <td className="p-4 sm:p-5 text-rose-500 text-center">✗ Complexe</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">
                    Tâches + Notes + Calendrier unifiés
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-600 bg-primary-50/30 text-center">
                    ✓ Natif
                  </td>
                  <td className="p-4 sm:p-5 text-amber-600 text-center">⚠️ Bricolé</td>
                  <td className="p-4 sm:p-5 text-rose-500 text-center">✗ Tâches seules</td>
                  <td className="p-4 sm:p-5 text-amber-600 text-center">⚠️ Limité</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">
                    Vitesse d’affichage &amp; réactivité
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-600 bg-primary-50/30 text-center">
                    ⚡ &lt; 100ms
                  </td>
                  <td className="p-4 sm:p-5 text-rose-500 text-center">✗ Lenteurs</td>
                  <td className="p-4 sm:p-5 text-slate-600 text-center">Moyen</td>
                  <td className="p-4 sm:p-5 text-slate-600 text-center">Moyen</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">Hébergement Souverain</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-600 bg-primary-50/30 text-center">
                    🇫🇷 France (Paris)
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500 text-center">🇺🇸 USA</td>
                  <td className="p-4 sm:p-5 text-slate-500 text-center">🇺🇸 USA</td>
                  <td className="p-4 sm:p-5 text-slate-500 text-center">🇺🇸 USA</td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="p-4 sm:p-5 font-bold text-slate-900">
                    Coût indicatif (Équipe de 10)
                  </td>
                  <td className="p-4 sm:p-5 font-extrabold text-primary-700 bg-primary-50/80 text-center">
                    0 € (Bêta) <br />
                    <span className="text-xs font-normal text-slate-600">puis 12 € / équipe</span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-700 text-center font-medium">
                    ~100 € / mois
                  </td>
                  <td className="p-4 sm:p-5 text-slate-700 text-center font-medium">
                    ~60 € / mois
                  </td>
                  <td className="p-4 sm:p-5 text-slate-700 text-center font-medium">
                    ~110 € / mois
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. Tarifs & Offre Pionnière */}
      <section id="tarifs" className="py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Tarification Transparente
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              100% Gratuit pendant la Bêta. Et un forfait juste ensuite.
            </p>
            <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
              Pas de facturation opaque au siège utilisateur qui explose dès que vous recrutez.
            </p>
          </div>

          {/* Pioneer Banner */}
          <div className="mb-10 rounded-2xl border-2 border-primary-500 bg-gradient-to-r from-primary-600 to-indigo-700 p-6 text-white shadow-lg text-center sm:text-left sm:flex items-center justify-between gap-6">
            <div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white inline-block mb-2">
                🎁 Avantage Membre Pionnier
              </span>
              <h3 className="text-xl font-bold">
                1 an de Plan Pro offert pour les 100 premières équipes
              </h3>
              <p className="text-sm text-primary-100 mt-1">
                Testez nexaBoard sans payer un centime, et conservez un statut fondateur privilégié
                à vie.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenModalWithEmail()}
              className="mt-4 sm:mt-0 whitespace-nowrap rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-700 shadow hover:bg-primary-50 transition"
            >
              Rejoindre la cohorte →
            </button>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">Plan Découverte</h3>
              <p className="text-sm text-slate-500 mt-1">
                Parfait pour démarrer et tester en solo ou duo.
              </p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">0 €</span>
                <span className="text-sm text-slate-500 ml-1">/ mois</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2">✓ Jusqu’à 3 projets actifs</li>
                <li className="flex items-center gap-2">✓ Jusqu’à 5 membres d’équipe</li>
                <li className="flex items-center gap-2">
                  ✓ 1 Go de documents &amp; pièces jointes
                </li>
                <li className="flex items-center gap-2">✓ Tableaux Kanban &amp; Notes Markdown</li>
                <li className="flex items-center gap-2">✓ Support communautaire</li>
              </ul>
              <button
                type="button"
                onClick={() => handleOpenModalWithEmail()}
                className="w-full rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Démarrer gratuitement
              </button>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-primary-600 bg-white p-8 shadow-xl">
              <div className="absolute -top-3.5 right-6 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
                RECOMMANDÉ
              </div>
              <h3 className="text-xl font-bold text-slate-900">Plan Équipe Pro</h3>
              <p className="text-sm text-slate-500 mt-1">
                Pour toute votre équipe (5 à 20 collaborateurs).
              </p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-primary-600">12 €</span>
                <span className="text-sm text-slate-500 ml-1">/ mois pour TOUTE l'équipe</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2 font-medium text-slate-900">
                  ✓ 1 an offert pour les bêta-testeurs
                </li>
                <li className="flex items-center gap-2">✓ Projets illimités</li>
                <li className="flex items-center gap-2">✓ Collaborateurs illimités (jusqu’à 20)</li>
                <li className="flex items-center gap-2">✓ 25 Go de stockage</li>
                <li className="flex items-center gap-2">
                  ✓ Calendrier synchronisé &amp; dashboard complet
                </li>
                <li className="flex items-center gap-2">✓ Support prioritaire sous 24h</li>
              </ul>
              <button
                type="button"
                onClick={() => handleOpenModalWithEmail()}
                className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700 transition"
              >
                Réserver l’offre Bêta Pro →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Roadmap Publique */}
      <section className="bg-slate-50/80 py-18 lg:py-20 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Transparence Totale
            </h2>
            <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Ce qui tourne aujourd’hui vs Ce qui arrive demain
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-3">
                ✅ Opérationnel dans la Bêta actuelle (MVP)
              </span>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  • Authentification sécurisée (JWT, tokens de rafraîchissement)
                </li>
                <li className="flex items-center gap-2">
                  • Tableaux Kanban &amp; vues en liste avec sous-tâches
                </li>
                <li className="flex items-center gap-2">
                  • Prise de notes arborescente en Markdown
                </li>
                <li className="flex items-center gap-2">
                  • Calendrier d’équipe et gestion des échéances
                </li>
                <li className="flex items-center gap-2">
                  • Espaces de travail multi-membres avec 4 rôles
                </li>
                <li className="flex items-center gap-2">• Tableau de bord statistique consolidé</li>
              </ul>
            </div>

            <div className="rounded-xl border border-indigo-200 bg-white p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block mb-3">
                🚀 Feuille de route en cours (Phase 2 &amp; 3)
              </span>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  • Vue Timeline chronologique (diagramme de Gantt interactif)
                </li>
                <li className="flex items-center gap-2">
                  • Synchronisation bidirectionnelle Google Calendar &amp; Outlook
                </li>
                <li className="flex items-center gap-2">
                  • Mode hors-ligne avec réconciliation automatique
                </li>
                <li className="flex items-center gap-2">
                  • Importateur automatique 1-clic depuis Trello et Notion
                </li>
                <li className="flex items-center gap-2">
                  • Intégrations Slack et GitHub pour développeurs
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ Anti-Objections */}
      <section id="faq" className="py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Réponses Claires
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">Questions Fréquentes</p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white transition hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. Final Call-to-Action */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-900/60 px-3 py-1 text-xs font-semibold text-primary-300 border border-primary-500/30 mb-6">
            🚀 100 places de testeurs pionniers
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Prêt à désencombrer le quotidien de votre équipe ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
            Rejoignez la cohorte bêta fermée nexaBoard. Mise en route en 3 minutes chrono, 100%
            gratuit et sans engagement.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => handleOpenModalWithEmail()}
              className="rounded-xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-500 transition"
            >
              Rejoindre la Bêta Privée →
            </button>
          </div>
        </div>
      </section>

      {/* 13. Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-sm text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              nexaBoard
            </span>
            <span>•</span>
            <span>Conçu avec rigueur en France 🇫🇷</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacy" className="hover:text-primary-600 transition">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-primary-600 transition">
              Conditions d’utilisation
            </Link>
            <a href="mailto:contact@nexaboard.io" className="hover:text-primary-600 transition">
              Contact fondateur
            </a>
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              Systèmes opérationnels
            </span>
          </div>

          <p className="text-xs text-slate-400">© 2026 nexaBoard. Tous droits réservés.</p>
        </div>
      </footer>

      {/* 14. Progressive Profiling Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              ✕
            </button>

            <div className="text-left">
              <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 mb-2 border border-primary-200">
                Étape 2 sur 2 : Personnalisation
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Activez votre accès Bêta Pionnier
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Deux choix rapides pour adapter l’environnement de votre équipe.
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} className="mt-6 space-y-5 text-left">
              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Votre adresse e-mail professionnelle :
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nom@entreprise.fr"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Team Size Chips */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Taille de votre équipe :
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['1-5', '6-10', '11-20', '20+'] as const).map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setTeamSize(size)}
                      className={`rounded-lg py-2 text-xs font-semibold border transition ${
                        teamSize === size
                          ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {size} pers.
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Tool Chips */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Votre outil principal actuel :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'notion', label: 'Notion' },
                    { id: 'trello', label: 'Trello' },
                    { id: 'asana', label: 'Asana' },
                    { id: 'clickup', label: 'ClickUp' },
                    { id: 'other', label: 'Autre' },
                    { id: 'none', label: 'Aucun' },
                  ].map((tool) => (
                    <button
                      type="button"
                      key={tool.id}
                      onClick={() => setCurrentTool(tool.id as any)}
                      className={`rounded-lg py-2 text-xs font-semibold border transition ${
                        currentTool === tool.id
                          ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary interest (optional) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Votre priorité immédiate :
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'all_in_one', label: '🎯 Tout-en-un simple' },
                    { id: 'tasks', label: '📋 Gagner du temps tâches' },
                    { id: 'notes', label: '📝 Base de notes claire' },
                    { id: 'cost_savings', label: '💰 Économies abonnements' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setInterest(item.id as any)}
                      className={`rounded-lg py-2 px-2.5 text-left font-medium border transition ${
                        interest === item.id
                          ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  {errorMessage}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {status === 'loading'
                    ? 'Validation de votre place...'
                    : 'Confirmer ma place Bêta Privée →'}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  🔒 Données hébergées en France. Aucun spam. Désinscription en 1 clic.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
