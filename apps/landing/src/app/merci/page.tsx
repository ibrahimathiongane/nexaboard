'use client';
import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-lg text-center bg-white p-8 rounded-lg shadow-lg">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Merci !</h1>
        <p className="text-xl text-gray-700 mb-6">
          Nous avons reçu votre candidature pour la bêta. Nous vous contacterons très bientôt par email.
        </p>
        <p className="text-gray-600 mb-8">
          En attendant, consultez notre documentation ou découvrez nos fonctionnalités.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Retour à l'accueil
          </Link>
          <a href="https://app.nexaboard.io" target="_blank" rel="noopener noreferrer" className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700">
            Accéder à l'app
          </a>
        </div>
      </div>
    </div>
  );
}
