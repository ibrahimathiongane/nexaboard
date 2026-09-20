interface PricingProps {
  onOpenModal: () => void;
}

export default function Pricing({ onOpenModal }: PricingProps) {
  return (
    <section id="tarifs" className="py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">Tarification Transparente</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            100% Gratuit pendant la Bêta. Et un forfait juste ensuite.
          </p>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            Pas de facturation opaque au siège utilisateur qui explose dès que vous recrutez.
          </p>
        </div>

        <div className="mb-10 rounded-2xl border-2 border-primary-500 bg-gradient-to-r from-primary-600 to-indigo-700 p-5 sm:p-6 text-white shadow-lg text-center sm:text-left sm:flex items-center justify-between gap-6">
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white inline-block mb-2">
              🎁 Avantage Membre Pionnier
            </span>
            <h3 className="text-xl font-bold">1 an de Plan Pro offert pour les 100 premières équipes</h3>
            <p className="text-sm text-primary-100 mt-1">
              Testez nexaBoard sans payer un centime, et conservez un statut fondateur privilégié à vie.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenModal}
            className="mt-4 sm:mt-0 whitespace-nowrap rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-700 shadow hover:bg-primary-50 transition"
          >
            Rejoindre la cohorte →
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Plan Découverte</h3>
            <p className="text-sm text-slate-500 mt-1">Parfait pour démarrer et tester en solo ou duo.</p>
            <div className="mt-6 mb-6">
              <span className="text-4xl font-extrabold text-slate-900">0 €</span>
              <span className="text-sm text-slate-500 ml-1">/ mois</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 mb-8">
              <li className="flex items-center gap-2">✓ Jusqu&apos;à 3 projets actifs</li>
              <li className="flex items-center gap-2">✓ Jusqu&apos;à 5 membres d&apos;équipe</li>
              <li className="flex items-center gap-2">✓ 1 Go de documents &amp; pièces jointes</li>
              <li className="flex items-center gap-2">✓ Tableaux Kanban &amp; Notes Markdown</li>
              <li className="flex items-center gap-2">✓ Support communautaire</li>
            </ul>
            <button
              type="button"
              onClick={onOpenModal}
              className="w-full rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Démarrer gratuitement
            </button>
          </div>

          <div className="relative rounded-2xl border-2 border-primary-600 bg-white p-8 shadow-xl">
            <div className="absolute -top-3.5 right-6 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
              RECOMMANDÉ
            </div>
            <h3 className="text-xl font-bold text-slate-900">Plan Équipe Pro</h3>
            <p className="text-sm text-slate-500 mt-1">Pour toute votre équipe (5 à 20 collaborateurs).</p>
            <div className="mt-6 mb-6">
              <span className="text-4xl font-extrabold text-primary-600">12 €</span>
              <span className="text-sm text-slate-500 ml-1">/ mois pour TOUTE l&apos;équipe</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 mb-8">
              <li className="flex items-center gap-2 font-medium text-slate-900">✓ 1 an offert pour les bêta-testeurs</li>
              <li className="flex items-center gap-2">✓ Projets illimités</li>
              <li className="flex items-center gap-2">✓ Collaborateurs illimités (jusqu&apos;à 20)</li>
              <li className="flex items-center gap-2">✓ 25 Go de stockage</li>
              <li className="flex items-center gap-2">✓ Calendrier synchronisé &amp; dashboard complet</li>
              <li className="flex items-center gap-2">✓ Support prioritaire sous 24h</li>
            </ul>
            <button
              type="button"
              onClick={onOpenModal}
              className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700 transition"
            >
              Réserver l&apos;offre Bêta Pro →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
