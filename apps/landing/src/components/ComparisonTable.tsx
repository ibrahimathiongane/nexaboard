export default function ComparisonTable() {
  const rows = [
    { criteria: 'Prise en main (< 3 min)', nexa: '✓ Oui', notion: '✗ Lourd', trello: '✓ Oui', asana: '✗ Complexe' },
    { criteria: 'Tâches + Notes + Calendrier', nexa: '✓ Natif', notion: '⚠️ Bricolé', trello: '✗ Tâches', asana: '⚠️ Limité' },
    { criteria: 'Vitesse (< 100ms)', nexa: '⚡ Oui', notion: '✗ Lent', trello: 'Moyen', asana: 'Moyen' },
    { criteria: 'Hébergement', nexa: '🇫🇷 France', notion: '🇺🇸 USA', trello: '🇺🇸 USA', asana: '🇺🇸 USA' },
  ];

  return (
    <section id="comparatif" className="py-20 lg:py-24 bg-slate-50/60 border-t border-slate-200/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">Comparatif de Marché</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Pourquoi choisir nexaBoard ?</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-3 sm:p-5 font-bold text-slate-900">Critères</th>
                <th className="p-3 sm:p-5 font-extrabold text-primary-700 bg-primary-50/80 text-center">nexaBoard</th>
                <th className="p-3 sm:p-5 font-semibold text-slate-600 text-center">Notion</th>
                <th className="p-3 sm:p-5 font-semibold text-slate-600 text-center">Trello</th>
                <th className="p-3 sm:p-5 font-semibold text-slate-600 text-center">Asana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.criteria}>
                  <td className="p-3 sm:p-5 font-semibold text-slate-800">{row.criteria}</td>
                  <td className="p-3 sm:p-5 font-bold text-emerald-600 bg-primary-50/30 text-center">{row.nexa}</td>
                  <td className="p-3 sm:p-5 text-rose-500 text-center">{row.notion}</td>
                  <td className="p-3 sm:p-5 text-slate-600 text-center">{row.trello}</td>
                  <td className="p-3 sm:p-5 text-slate-600 text-center">{row.asana}</td>
                </tr>
              ))}
              <tr className="bg-slate-50/40">
                <td className="p-3 sm:p-5 font-bold text-slate-900">Coût (10 pers.)</td>
                <td className="p-3 sm:p-5 font-extrabold text-primary-700 bg-primary-50/80 text-center">
                  0 € <br />
                  <span className="text-[10px] sm:text-xs font-normal text-slate-600">Bêta puis 12 €/équipe</span>
                </td>
                <td className="p-3 sm:p-5 text-slate-700 text-center font-medium">~100 €/mois</td>
                <td className="p-3 sm:p-5 text-slate-700 text-center font-medium">~60 €/mois</td>
                <td className="p-3 sm:p-5 text-slate-700 text-center font-medium">~110 €/mois</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
