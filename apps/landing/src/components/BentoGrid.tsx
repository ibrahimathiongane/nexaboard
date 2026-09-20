'use client';

import { motion } from 'framer-motion';

export default function BentoGrid() {
  const features = [
    {
      span: 'md:col-span-2',
      icon: '📋',
      iconBg: 'primary',
      title: 'Gestion des Tâches Agile (Kanban & Listes)',
      desc: 'Visualisez vos projets en colonnes Kanban fluides ou en listes compactes. Assignez des collaborateurs, définissez des sous-tâches, des priorités et suivez l\'avancement en temps réel.',
      tags: ['Glisser-déposer réactif', 'Sous-tâches hiérarchiques', 'Filtres multicritères', 'Assignations multiples'],
    },
    {
      span: '',
      icon: '📝',
      iconBg: 'indigo',
      title: 'Notes & Wiki Markdown',
      desc: 'Rédigez vos cadrages, comptes-rendus et documentations dans un éditeur rapide supportant le Markdown complet.',
      tags: ['Arborescence par projet', 'Blocs de code formatés'],
    },
    {
      span: '',
      icon: '📅',
      iconBg: 'amber',
      title: 'Calendrier d\'Équipe',
      desc: 'Planifiez vos jalons clés, échéances de sprint et livrables sur une vue chronologique connectée directement à vos projets.',
      tags: ['Vues jour / semaine', 'Liaison automatique tâches'],
    },
    {
      span: 'md:col-span-2',
      icon: '🏢',
      iconBg: 'rose',
      title: 'Espaces de Travail & Rôles Collaboratifs',
      desc: 'Créez des espaces dédiés pour chaque département ou projet. Gérez précisément les rôles et visualisez le tableau de bord avec les statistiques consolidées.',
      tags: ['Dashboard analytique', 'Multi-workspaces isolés', 'Contrôle d\'accès sécurisé'],
    },
  ];

  return (
    <section id="features" className="bg-slate-50/70 py-20 lg:py-24 border-t border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">Fonctionnalités Clés</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Tout ce dont votre équipe a besoin. Rien de superflu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={`${f.span} rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)' }}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${f.iconBg}-100 text-${f.iconBg}-700 text-2xl mb-5`}>
                {f.icon}
              </div>
              <div className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-3">
                Opérationnel dans votre espace
              </div>
              <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{f.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                {f.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 px-2.5 py-1">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
