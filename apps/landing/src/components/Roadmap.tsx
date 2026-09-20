export default function Roadmap() {
  return (
    <section id="roadmap" className="bg-slate-50/80 py-18 lg:py-20 border-t border-slate-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">Transparence Totale</h2>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Ce qui tourne aujourd&apos;hui vs Ce qui arrive demain
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-3">
              ✅ Opérationnel dans la Bêta actuelle (MVP)
            </span>
            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="flex items-center gap-2">• Authentification sécurisée (JWT, tokens de rafraîchissement)</li>
              <li className="flex items-center gap-2">• Tableaux Kanban &amp; vues en liste avec sous-tâches</li>
              <li className="flex items-center gap-2">• Prise de notes arborescente en Markdown</li>
              <li className="flex items-center gap-2">• Calendrier d&apos;équipe et gestion des échéances</li>
              <li className="flex items-center gap-2">• Espaces de travail multi-membres avec 4 rôles</li>
              <li className="flex items-center gap-2">• Tableau de bord statistique consolidé</li>
            </ul>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block mb-3">
              🚀 Feuille de route en cours (Phase 2 &amp; 3)
            </span>
            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="flex items-center gap-2">• Vue Timeline chronologique (diagramme de Gantt interactif)</li>
              <li className="flex items-center gap-2">• Synchronisation bidirectionnelle Google Calendar &amp; Outlook</li>
              <li className="flex items-center gap-2">• Mode hors-ligne avec réconciliation automatique</li>
              <li className="flex items-center gap-2">• Importateur automatique 1-clic depuis Trello et Notion</li>
              <li className="flex items-center gap-2">• Application mobile progressive (PWA)</li>
              <li className="flex items-center gap-2">• Intégrations Slack et GitHub pour développeurs</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
