'use client';

import { useState, useCallback } from 'react';
import { useAnalytics } from '@/lib/analytics';

interface RoiCalculatorProps {
  onOpenModal: () => void;
}

export default function RoiCalculator({ onOpenModal }: RoiCalculatorProps) {
  const [calcTeamSize, setCalcTeamSize] = useState(10);
  const [calcTools, setCalcTools] = useState<{ [key: string]: boolean }>({
    notion: true,
    trello: true,
    asana: false,
    todoist: false,
  });
  const analytics = useAnalytics();

  const toolPrices: { [key: string]: { name: string; price: number } } = {
    notion: { name: 'Notion (10 €/pers)', price: 10 },
    trello: { name: 'Trello Pro (6 €/pers)', price: 6 },
    asana: { name: 'Asana Starter (11 €/pers)', price: 11 },
    todoist: { name: 'Todoist Business (8 €/pers)', price: 8 },
  };

  const monthlyCompetitorCost = Object.entries(calcTools).reduce((acc, [tool, enabled]) => {
    return enabled ? acc + (toolPrices[tool]?.price || 0) * calcTeamSize : acc;
  }, 0);

  const monthlySavings = Math.max(0, monthlyCompetitorCost - 12);
  const yearlySavings = monthlySavings * 12;
  const hoursSavedYearly = calcTeamSize * 120;

  const trackCalculator = useCallback(() => {
    analytics.track('pricing_calculator_used', {
      team_size_input: calcTeamSize,
      calculated_savings: yearlySavings,
    });
  }, [calcTeamSize, yearlySavings]);

  return (
    <section id="calculateur" className="py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">Calculateur d&apos;Économies</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Combien gaspillez-vous en abonnements inutiles ?
          </p>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            Évaluez les économies immédiates réalisables en unifiant vos outils sous nexaBoard.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-8 sm:p-12 shadow-xl shadow-slate-200/50">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-800">Taille de votre équipe :</label>
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
                  onChange={(e) => {
                    setCalcTeamSize(Number(e.target.value));
                    trackCalculator();
                  }}
                  className="w-full accent-primary-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                  <span>5 pers.</span>
                  <span>15 pers.</span>
                  <span>25 pers.</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-3">Outils actuellement payés :</label>
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

            <div className="rounded-2xl border border-primary-200 bg-white p-7 shadow-lg text-center space-y-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Coût actuel estimé</span>
                <p className="text-2xl font-bold text-slate-700 mt-0.5">
                  {monthlyCompetitorCost} € <span className="text-xs text-slate-400">/ mois</span>
                </p>
              </div>

              <div className="py-4 border-y border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Économies nettes avec nexaBoard</span>
                <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600 mt-1">
                  {yearlySavings.toLocaleString('fr-FR')} €
                  <span className="text-xs font-semibold text-slate-500 block sm:inline"> / an</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">(Et 0 € d&apos;abonnement pendant toute la phase Bêta !)</p>
              </div>

              <div className="text-xs text-slate-600">
                💡 <strong>+{hoursSavedYearly} heures</strong> de distraction et de copier-coller évitées pour votre équipe.
              </div>

              <button
                type="button"
                onClick={onOpenModal}
                className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700 transition"
              >
                Réserver ma place Bêta et stopper les frais →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
