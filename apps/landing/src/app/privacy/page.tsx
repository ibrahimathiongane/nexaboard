import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — nexaBoard',
  description:
    'Découvrez comment nexaBoard protège vos données. Hébergement en France, chiffrement AES-256, conformité RGPD.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-8 inline-block">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="text-5xl font-bold mb-8">Politique de Confidentialité</h1>
        <div className="prose max-w-none space-y-6 text-gray-700">
          <h2 className="text-2xl font-bold mt-8 text-gray-900">1. Introduction</h2>
          <p>
            nexaBoard (« nous », « notre ») est engagé à protéger votre confidentialité. Cette
            politique de confidentialité explique nos pratiques de collecte, d&apos;utilisation et de
            divulgation de données.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">2. Données Collectées</h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Données d&apos;inscription :</strong> Email, nom, workspace
            </li>
            <li>
              <strong>Données d&apos;utilisation :</strong> Actions, interactions, timestamps
            </li>
            <li>
              <strong>Données techniques :</strong> Adresse IP, navigateur, appareil
            </li>
            <li>
              <strong>Cookies :</strong> Pour la session et les préférences
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">3. Utilisation des Données</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fournir et améliorer nos services</li>
            <li>Vous contacter concernant votre compte ou la bêta</li>
            <li>Respecter les obligations légales</li>
            <li>Analyser les tendances et améliorer l&apos;expérience utilisateur</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">4. Sécurité des Données</h2>
          <p>
            Vos données sont protégées par un chiffrement AES-256 au repos et TLS 1.3 en transit.
            Nos serveurs sont hébergés en France (Paris) conformément au RGPD.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">5. Vos Droits</h2>
          <p>Vous avez le droit de :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Accéder à vos données personnelles</li>
            <li>Rectifier ou supprimer vos données</li>
            <li>Vous opposer au traitement</li>
            <li>Demander la portabilité de vos données</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">6. Contact</h2>
          <p>
            Pour toute question concernant cette politique, contactez-nous à{' '}
            <strong>privacy@nexaboard.io</strong>
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">7. Mises à Jour</h2>
          <p>
            Cette politique a été mise à jour le 17 septembre 2026 et peut être modifiée à tout
            moment. Les modifications seront notifiées par email.
          </p>
        </div>
      </div>
    </div>
  );
}
