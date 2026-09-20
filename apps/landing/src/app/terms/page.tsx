import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions d\'Utilisation — nexaBoard',
  description:
    'Conditions générales d\'utilisation de nexaBoard. Droit applicable français, protection des données.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-8 inline-block">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="text-5xl font-bold mb-8">Conditions d&apos;Utilisation</h1>
        <div className="prose max-w-none space-y-6 text-gray-700">
          <h2 className="text-2xl font-bold mt-8 text-gray-900">1. Accord Général</h2>
          <p>
            En utilisant nexaBoard, vous acceptez ces conditions d&apos;utilisation. Si vous n&apos;acceptez
            pas ces conditions, veuillez ne pas utiliser notre service.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">2. Services Fournis</h2>
          <p>
            nexaBoard fournit un service de gestion de projet et de productivité. Nous nous
            efforçons de fournir un service de haute qualité, mais ne garantissons pas l&apos;absence
            d&apos;interruptions ou d&apos;erreurs.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">3. Compte Utilisateur</h2>
          <p>Vous êtes responsable de :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>La confidentialité de votre mot de passe</li>
            <li>Tous les accès et activités de votre compte</li>
            <li>La notification immédiate de tout accès non autorisé</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">4. Contenu et Comportement</h2>
          <p>Vous acceptez de ne pas :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Stocker ou transmettre de contenu illégal ou nuisible</li>
            <li>Harceler ou discriminer d&apos;autres utilisateurs</li>
            <li>Contourner les mesures de sécurité du service</li>
            <li>Accéder à des données auxquelles vous n&apos;avez pas le droit</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">5. Limitation de Responsabilité</h2>
          <p>
            nexaBoard ne sera pas responsable de toute perte de données, interruption de service ou
            dommage indirect résultant de l&apos;utilisation ou de l&apos;incapacité à utiliser le service.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">6. Résiliation</h2>
          <p>
            Nous pouvons résilier votre compte à tout moment si vous violez ces conditions. Vous
            pouvez annuler votre abonnement à tout moment depuis votre tableau de bord.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">7. Modifications des Services</h2>
          <p>
            Nous nous réservons le droit de modifier ou d&apos;interrompre nos services avec un préavis
            de 30 jours.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">8. Droit Applicable</h2>
          <p>
            Ces conditions sont régies par le droit français. Tout litige sera résolu par les
            tribunaux compétents en France.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">9. Contact</h2>
          <p>
            Pour toute question concernant ces conditions, contactez-nous à{' '}
            <strong>legal@nexaboard.io</strong>
          </p>

          <h2 className="text-2xl font-bold mt-8 text-gray-900">10. Mises à Jour</h2>
          <p>
            Ces conditions ont été mises à jour le 17 septembre 2026 et peuvent être modifiées à
            tout moment. Les modifications seront notifiées par email.
          </p>
        </div>
      </div>
    </div>
  );
}
