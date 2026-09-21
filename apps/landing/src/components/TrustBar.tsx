export default function TrustBar() {
  const items = [
    { icon: '🔒', bgClass: 'bg-indigo-100', textClass: 'text-indigo-600', title: 'Hébergé en France', desc: 'Serveurs à Paris • Chiffrement AES-256' },
    { icon: '⚡', bgClass: 'bg-emerald-100', textClass: 'text-emerald-600', title: 'Temps de réponse < 100ms', desc: 'Zéro lag, architecture NestJS & Next.js' },
    { icon: '📦', bgClass: 'bg-amber-100', textClass: 'text-amber-600', title: 'Zéro Lock-in', desc: 'Export 1-clic en Markdown, CSV & JSON' },
    { icon: '👥', bgClass: 'bg-blue-100', textClass: 'text-blue-600', title: 'Pensé pour 5 à 20 pers.', desc: 'La simplicité sans lourdeur inutile' },
  ];

  return (
    <section className="border-y border-slate-200/70 bg-slate-50/80 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map((item) => (
            <div key={item.title} className="p-2">
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${item.bgClass} ${item.textClass} mb-2`}>
                {item.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
