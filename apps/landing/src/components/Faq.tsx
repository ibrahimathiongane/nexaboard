'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '@/lib/analytics';

const faqItems = [
  {
    q: 'Qu\'implique concrètement de rejoindre la cohorte Bêta fermée ?',
    a: 'Vous obtenez un accès immédiat et 100% gratuit à nexaBoard pour votre équipe. Toutes les fonctionnalités actuelles sont débloquées sans restriction. Votre seul engagement : nous faire part de vos retours d\'expérience pour nous aider à parfaire l\'outil avant le lancement public.',
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
    a: 'Absolument. Nous appliquons une politique zéro verrouillage (anti lock-in) : vous pouvez exporter l\'intégralité de vos notes en Markdown, et vos projets et tâches au format CSV/JSON en 1 clic à tout moment.',
  },
  {
    q: 'Comment s\'effectue la migration depuis Trello ou Notion ?',
    a: 'La prise en main de nexaBoard est instantanée (moins de 3 minutes). L\'interface reprend les repères visuels éprouvés du Kanban et des notes arborescentes. Un assistant d\'importation directe est également prévu dans la phase 2 de notre feuille de route.',
  },
  {
    q: 'Devrai-je payer après la phase Bêta ?',
    a: 'Non, aucune carte bancaire n\'est requise. À l\'issue de la période bêta, vous disposerez de votre année complète de Plan Pro offerte sans obligation de renouvellement. Vous serez toujours libre de basculer sur le plan Découverte gratuit.',
  },
];

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const analytics = useAnalytics();

  return (
    <section id="faq" className="py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">Réponses Claires</h2>
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
                  onClick={() => {
                    const next = openFaq === index ? null : index;
                    setOpenFaq(next);
                    analytics.track('faq_item_toggled', {
                      question_title: item.q,
                      open_state: next !== null,
                    });
                  }}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <motion.span
                    className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
