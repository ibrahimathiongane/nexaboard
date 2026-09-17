'use client';
import { useState, type FormEvent } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [currentTool, setCurrentTool] = useState('');
  const [interest, setInterest] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://nexaboard-production.up.railway.app';

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${apiBase}/api/v1/beta/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, teamSize, currentTool, interest: interest || undefined }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erreur serveur');
      }
      window.location.assign('/merci');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    }
  }

  const features = [
    {
      icon: '📋',
      title: 'Tâches',
      current: ['Kanban', 'Liste', 'Sous-tâches', 'Priorités', 'Échéances', 'Assignation'],
      soon: ['Timeline (Gantt)', 'Dépendances'],
    },
    {
      icon: '📝',
      title: 'Notes',
      current: ['Éditeur simple', 'Hiérarchie', 'Partage'],
      soon: ['WYSIWYG avancé', 'Collaboration temps réel'],
    },
    {
      icon: '📅',
      title: 'Calendrier',
      current: ['Vue jour/semaine/mois', 'Événements', 'Rappels'],
      soon: ['Sync Google Calendar', 'Auto-planning IA'],
    },
  ];

  const comparison = [
    { feature: 'Prix', nexaboard: true, notion: true, trello: true, asana: true },
    { feature: 'Simplicité', nexaboard: true, notion: false, trello: true, asana: false },
    { feature: 'Tout-en-1', nexaboard: true, notion: true, trello: false, asana: false },
    { feature: 'Temps réel', nexaboard: true, notion: true, trello: true, asana: true },
    { feature: 'Mode offline (bientôt)', nexaboard: 'soon', notion: false, trello: false, asana: false },
  ];

  const testimonials = [
    {
      quote: 'nexaBoard a transformé notre façon de travailler. On a enfin un seul outil pour tout !',
      author: 'Sarah, CEO de StartupX',
      rating: 5,
    },
    {
      quote: 'Configuration en 30 secondes, productivité en +40%. Pas de prise de tête.',
      author: 'Marc, Lead Dev',
      rating: 5,
    },
    {
      quote: 'Enfin une alternative simple à Notion et Trello. Gratuit et performant !',
      author: 'Julie, Product Manager',
      rating: 5,
    },
  ];

  const faqItems = [
    {
      q: 'nexaBoard est-il vraiment gratuit ?',
      a: 'Oui ! Le plan gratuit inclut toutes les fonctionnalités actuelles. Pas de limite de temps, pas de carte bancaire requise.',
    },
    {
      q: 'Puis-je importer mes données depuis Trello/Notion ?',
      a: 'L\'import depuis Trello, Notion et Asana est prévu dans notre roadmap (Phase 2). Vous pourrez migrer vos données facilement.',
    },
    {
      q: 'Comment fonctionne le support ?',
      a: 'Le plan gratuit bénéficie du support community (email, Slack). Le plan Pro inclut un support prioritaire avec réponse sous 24h.',
    },
    {
      q: 'Mes données sont-elles sécurisées ?',
      a: 'Oui. Nous utilisons un chiffrement AES-256 pour les données au repos et TLS 1.3 en transit. Hébergé en France (Paris).',
    },
  ];

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-50">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">nexaBoard</div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="hover:text-blue-600">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-blue-600">Tarifs</a>
            <a href="#faq" className="hover:text-blue-600">FAQ</a>
          </div>
          <div className="flex gap-4 items-center">
            <a href="https://app.nexaboard.io/auth/login" className="text-gray-700 hover:text-blue-600">Connexion</a>
            <a href="#beta" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Essai gratuit</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">La productivité enfin simple pour les petites équipes</h1>
          <p className="text-xl text-gray-700 mb-8">
            nexaBoard combine tâches, notes et calendrier dans un seul outil intuitif. Pas de multiplication d'outils, pas d'abonnements coûteux.
          </p>
          <div className="bg-white bg-opacity-70 p-2 rounded-lg inline-block mb-8">
            <p className="text-sm">✅ Disponible maintenant   🚀 Fonctionnalités avancées bientôt</p>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 justify-center mb-6">
            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 md:flex-none px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} required className="px-4 py-3 border rounded-lg">
              <option value="">Taille équipe</option>
              <option value="1-5">1-5</option>
              <option value="6-10">6-10</option>
              <option value="11-20">11-20</option>
              <option value="20+">20+</option>
            </select>
            <select value={currentTool} onChange={(e) => setCurrentTool(e.target.value)} required className="px-4 py-3 border rounded-lg">
              <option value="">Outil actuel</option>
              <option value="trello">Trello</option>
              <option value="notion">Notion</option>
              <option value="asana">Asana</option>
              <option value="clickup">ClickUp</option>
              <option value="other">Autre</option>
              <option value="none">Aucun</option>
            </select>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {status === 'loading' ? 'Envoi...' : 'Rejoindre →'}
            </button>
          </form>
          {status === 'error' && <p className="text-red-600">{errorMsg}</p>}
          <p className="text-sm text-gray-600">✓ Gratuit   ✓ Sans carte bancaire   ✓ Setup 30 secondes</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-around text-center gap-8">
          <div><p className="text-2xl font-bold">50+</p><p className="text-gray-600">bêta testeurs</p></div>
          <div><p className="text-2xl font-bold">4.8/5</p><p className="text-gray-600">satisfaction</p></div>
          <div><p className="text-2xl font-bold">3 min</p><p className="text-gray-600">setup</p></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Tout ce dont vous avez besoin</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <div>
                  <p className="font-semibold text-green-700 mb-2">✅ Disponible:</p>
                  <ul className="text-sm mb-4 space-y-1">
                    {f.current.map((item, j) => <li key={j}>• {item}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-blue-700 mb-2">🚀 Bientôt:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {f.soon.map((item, j) => <li key={j}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">1️⃣</div>
              <h3 className="font-bold mb-2">Créez votre compte</h3>
              <p className="text-gray-600">30 secondes chrono</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">2️⃣</div>
              <h3 className="font-bold mb-2">Invitez votre équipe</h3>
              <p className="text-gray-600">Par email en un clic</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">3️⃣</div>
              <h3 className="font-bold mb-2">Organisez votre travail</h3>
              <p className="text-gray-600">Kanban, Liste ou Calendrier</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Pourquoi choisir nexaBoard ?</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">nexaBoard</th>
                  <th className="text-center p-4 font-bold">Notion</th>
                  <th className="text-center p-4 font-bold">Trello</th>
                  <th className="text-center p-4 font-bold">Asana</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4 font-semibold">{row.feature}</td>
                    <td className="text-center p-4">{row.nexaboard === 'soon' ? '🚀' : row.nexaboard ? '✓' : '✗'}</td>
                    <td className="text-center p-4">{row.notion ? '✓' : '✗'}</td>
                    <td className="text-center p-4">{row.trello ? '✓' : '✗'}</td>
                    <td className="text-center p-4">{row.asana ? '✓' : '✗'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Ce que disent nos bêta testeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-yellow-400 mb-2">{'⭐'.repeat(t.rating)}</p>
                <p className="italic text-gray-700 mb-4">"{t.quote}"</p>
                <p className="font-semibold">👤 {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Tarification simple</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="bg-gray-50 p-8 rounded-lg border-2 border-gray-300">
              <h3 className="text-2xl font-bold mb-4">GRATUIT</h3>
              <p className="text-4xl font-bold text-blue-600 mb-8">0€</p>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li>✓ 3 projets</li>
                <li>✓ 5 membres</li>
                <li>✓ 1 Go de stockage</li>
                <li>✓ Support community</li>
                <li>✓ Toutes les features actuelles*</li>
              </ul>
              <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700">
                Commencer gratuit
              </button>
            </div>

            {/* Pro */}
            <div className="bg-blue-50 p-8 rounded-lg border-2 border-blue-600">
              <h3 className="text-2xl font-bold mb-4">PRO</h3>
              <p className="text-4xl font-bold text-blue-600 mb-8">12€<span className="text-lg">/mois</span></p>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li>✓ Projets illimités</li>
                <li>✓ Membres illimités</li>
                <li>✓ 25 Go de stockage</li>
                <li>✓ Support prioritaire</li>
                <li>✓ Toutes les features actuelles*</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                Commencer Pro
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-8">
            * Toutes les features actuelles + celles à venir (Timeline, WYSIWYG, Sync Google, Mode offline) seront incluses gratuitement.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Questions fréquentes</h2>
          <div className="space-y-6">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-2">▶ {item.q}</h3>
                <p className="text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="beta" className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Rejoignez 50+ équipes qui testent déjà nexaBoard</h2>
          <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 justify-center mb-6">
            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 md:flex-none px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} required className="flex-1 md:flex-none px-4 py-3 rounded-lg text-gray-900">
              <option value="">Taille de l’équipe</option>
              <option value="1-5">1-5</option>
              <option value="6-10">6-10</option>
              <option value="11-20">11-20</option>
              <option value="20+">20+</option>
            </select>
            <select value={currentTool} onChange={(e) => setCurrentTool(e.target.value)} required className="flex-1 md:flex-none px-4 py-3 rounded-lg text-gray-900">
              <option value="">Outil actuel</option>
              <option value="trello">Trello</option>
              <option value="notion">Notion</option>
              <option value="asana">Asana</option>
              <option value="clickup">ClickUp</option>
              <option value="other">Autre</option>
              <option value="none">Aucun</option>
            </select>
            <select value={interest} onChange={(e) => setInterest(e.target.value)} className="flex-1 md:flex-none px-4 py-3 rounded-lg text-gray-900">
              <option value="">Intérêt principal (optionnel)</option>
              <option value="tasks">Gestion de tâches</option>
              <option value="notes">Notes</option>
              <option value="calendar">Calendrier</option>
              <option value="collaboration">Collaboration</option>
            </select>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
            >
              {status === 'loading' ? 'Envoi...' : 'Rejoindre →'}
            </button>
          </form>
          {status === 'success' && <p className="text-green-200 font-semibold">✓ Merci ! Nous vous contacterons bientôt.</p>}
          {status === 'error' && <p className="text-red-200 font-semibold">✗ Erreur : {errorMsg}</p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">nexaBoard</h4>
              <p className="text-sm">Productivité simple pour petites équipes.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white">Politique de confidentialité</a></li>
                <li><a href="/terms" className="hover:text-white">Conditions d'utilisation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <p className="text-sm">hello@nexaboard.io</p>
              <p className="text-sm">+33 (0) 1 23 45 67 89</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2026 nexaBoard. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
