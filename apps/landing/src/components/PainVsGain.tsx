export default function PainVsGain() {
  const painPoints = [
    <><strong>5 onglets ouverts en permanence</strong> (Trello pour les cartes, Notion pour les wikis, Google Calendar, Todoist, Slack).</>,
    <><strong>Contexte fragmenté</strong> : des tâches orphelines sans documentation associée, des dates limites oubliées.</>,
    <><strong>Facture exorbitante</strong> : 40 € à 80 € par utilisateur chaque mois pour des fonctionnalités sous-utilisées.</>,
    <><strong>Courbe d&apos;apprentissage lourde</strong> : 2 semaines pour former chaque nouvel arrivant aux bases de données Notion.</>,
  ];

  const gainPoints = [
    <><strong>1 seul onglet réactif</strong> réunissant vos listes, vos tableaux Kanban, vos notes et vos échéances.</>,
    <><strong>Alignement total</strong> : chaque tâche est liée en direct à sa note de cadrage et son événement de calendrier.</>,
    <><strong>Coût juste et prévisible</strong> : 0 € en Bêta puis un forfait d&apos;équipe fixe à 12 €/mois (pas de piège par utilisateur).</>,
    <><strong>Opérationnel en 3 minutes</strong> : interface évidente nécessitant zéro formation ou configuration complexe.</>,
  ];

  return (
    <section id="avant-apres" className="py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">Le problème du SaaS Sprawl</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Pourquoi multiplier les outils quand vous pouvez tout unifier ?
          </p>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Une petite équipe perd en moyenne 2,5 heures par semaine par collaborateur à basculer entre des applications disjointes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 text-rose-700 font-bold text-sm uppercase tracking-wider mb-4">
              <span>❌ Le chaos quotidien (Sans nexaBoard)</span>
            </div>
            <ul className="space-y-4 text-sm text-slate-700">
              {painPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-6 sm:p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider mb-4">
              <span>✅ La clarté productive (Avec nexaBoard)</span>
            </div>
            <ul className="space-y-4 text-sm text-slate-800">
              {gainPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
