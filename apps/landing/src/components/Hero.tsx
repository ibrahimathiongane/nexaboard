'use client';

import { motion } from 'framer-motion';
import type { LandingState } from '@/lib/types';

interface HeroProps {
  onOpenModal: (email?: string) => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  const [email, setEmail] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'kanban' | 'notes' | 'calendar'>('kanban');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onOpenModal(email);
  }

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[300px] w-[400px] sm:h-[480px] sm:w-[700px] rounded-full bg-gradient-to-tr from-primary-400/20 via-indigo-300/15 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-3.5 py-1 text-xs font-semibold text-primary-800 shadow-sm backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Cohorte Pionnière Ouverte • Plus que 34 places Bêta</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          La productivité enfin simple <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 bg-clip-text text-transparent">
            pour les petites équipes.
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          nexaBoard réunit vos tableaux de tâches, vos notes d&apos;équipe et votre calendrier dans une
          plateforme ultra-rapide. Fini les allers-retours épuisants entre 5 abonnements payants.
        </motion.p>

        <motion.div
          className="mx-auto mt-8 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form
            onSubmit={handleSubmit}
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
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Obtenir mon accès Bêta →
            </motion.button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
            {['100% Gratuit en Bêta', 'Zéro carte bancaire', 'Prise en main en 3 min', '🇫🇷 Hébergé en France'].map(
              (item, i) => (
                <span key={item} className="inline-flex items-center gap-1 font-medium text-slate-700">
                  {i > 0 && <span className="mr-1">•</span>}
                  <svg className="h-3.5 w-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </span>
              )
            )}
          </div>
        </motion.div>

        {/* Product Showcase */}
        <motion.div
          className="mt-14 lg:mt-18"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-slate-900/5 p-2 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm sm:p-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-3 sm:px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-medium text-slate-400 hidden sm:inline">
                    nexaboard.io/app/workspace-sprint
                  </span>
                </div>
                <div className="flex items-center rounded-lg bg-slate-200/70 p-0.5 text-xs font-semibold text-slate-700">
                  {([
                    { key: 'kanban', labelShort: 'Tâches', labelFull: 'Tâches (Kanban)' },
                    { key: 'notes', labelShort: 'Notes', labelFull: 'Notes Markdown' },
                    { key: 'calendar', labelShort: 'Calendrier', labelFull: 'Calendrier' },
                  ] as const).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`rounded-md px-2 sm:px-3 py-1 transition ${activeTab === tab.key ? 'bg-white text-primary-600 shadow-sm' : 'hover:text-slate-900'}`}
                    >
                      <span className="sm:hidden">{tab.labelShort}</span>
                      <span className="hidden sm:inline">{tab.labelFull}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 sm:p-6 bg-slate-50/50 min-h-[280px] sm:min-h-[360px] text-left">
                {activeTab === 'kanban' && <KanbanPreview />}
                {activeTab === 'notes' && <NotesPreview />}
                {activeTab === 'calendar' && <CalendarPreview />}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import React from 'react';

function KanbanPreview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">À faire</span>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">2</span>
        </div>
        <div className="space-y-2.5">
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm hover:border-primary-400 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">Urgent</span>
              <span className="text-[11px] text-slate-400">Demain</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Finaliser le design onboarding</h4>
            <p className="text-xs text-slate-500 mt-1">Valider les écrans avec l&apos;équipe produit.</p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
              <span>3 sous-tâches</span>
              <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">SM</span>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
            <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">Moyen</span>
            <h4 className="text-sm font-semibold text-slate-800 mt-1.5">Optimisation des requêtes API</h4>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-primary-100 bg-primary-50/40 p-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-800">En cours</span>
          <span className="rounded-full bg-primary-200 px-2 py-0.5 text-xs font-bold text-primary-800">2</span>
        </div>
        <div className="space-y-2.5">
          <div className="rounded-lg border border-primary-200 bg-white p-3.5 shadow-sm ring-1 ring-primary-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="rounded bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-800">Sprint 1</span>
              <span className="text-[11px] text-emerald-600 font-medium">En review</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Intégration du calendrier d&apos;équipe</h4>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
              <span>Note liée: Spécifications v2</span>
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">IB</span>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">Tech</span>
            <h4 className="text-sm font-semibold text-slate-800 mt-1.5">Tests unitaires Jest (80%+)</h4>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Terminé</span>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">4</span>
        </div>
        <div className="space-y-2.5">
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm opacity-85">
            <span className="text-[11px] font-semibold text-emerald-600">✓ Livré</span>
            <h4 className="text-sm font-medium text-slate-700 line-through mt-0.5">Schéma Prisma &amp; migrations Postgres</h4>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm opacity-85">
            <span className="text-[11px] font-semibold text-emerald-600">✓ Livré</span>
            <h4 className="text-sm font-medium text-slate-700 line-through mt-0.5">Mise en place de l&apos;authentification JWT</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesPreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs space-y-2 order-2 md:order-1">
        <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Pages d&apos;équipe</p>
        <div className="rounded bg-primary-50 px-2 py-1 font-semibold text-primary-700">Cadrage Sprint 2026</div>
        <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 cursor-pointer">Architecture technique</div>
        <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 cursor-pointer">Guide des conventions</div>
      </div>
      <div className="md:col-span-3 rounded-lg border border-slate-200 bg-white p-4 sm:p-5 order-1 md:order-2">
        <h3 className="text-base sm:text-lg font-bold text-slate-900"># Cadrage Sprint Q4 — Objectifs &amp; Livrables</h3>
        <p className="text-xs text-slate-400 mt-1">Dernière modification par Sarah il y a 20 min</p>
        <hr className="my-3 border-slate-100" />
        <div className="text-sm text-slate-700 space-y-2">
          <p>Ce document centralise toutes les exigences du prochain incrément produit nexaBoard.</p>
          <div className="bg-slate-50 border-l-4 border-primary-500 p-2.5 rounded text-xs text-slate-600">
            <strong>Note :</strong> Toutes les tâches sont automatiquement synchronisées avec le tableau Kanban.
          </div>
          <ul className="list-disc pl-5 text-xs space-y-1 text-slate-600 mt-2">
            <li>[x] Modèle de données WorkspaceMember validé</li>
            <li>[ ] Optimisation des temps de réponse API sous 100ms</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CalendarPreview() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Semaine en cours — Septembre 2026</h3>
        <span className="text-xs font-semibold text-primary-600">3 jalons clés cette semaine</span>
      </div>
      <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-5 gap-2 text-center text-xs min-w-[400px] sm:min-w-0">
          {['Lun 18', 'Mar 19', 'Mer 20', 'Jeu 21', 'Ven 22'].map((day, idx) => (
            <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50/60 p-2 sm:p-3 min-h-[100px] sm:min-h-[140px] text-left">
              <span className="font-bold text-slate-600 block mb-2 text-[11px] sm:text-xs">{day}</span>
              {idx === 1 && (
                <div className="rounded bg-primary-100 border border-primary-200 p-1 sm:p-1.5 text-[10px] sm:text-[11px] font-semibold text-primary-800">
                  Déploiement Bêta
                </div>
              )}
              {idx === 3 && (
                <div className="rounded bg-emerald-100 border border-emerald-200 p-1 sm:p-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-800">
                  Revue de sprint
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
