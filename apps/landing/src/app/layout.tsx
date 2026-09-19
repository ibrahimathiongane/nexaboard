import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "nexaBoard — L'espace de travail unifié pour les équipes de 5 à 20 personnes",
  description:
    'Fini la dispersion entre Trello, Notion et Google Calendar. Centralisez vos tâches, vos notes et votre planning en 3 minutes sans formation.',
  metadataBase: new URL('https://nexaboardapp.up.railway.app'),
  keywords: [
    'gestion de projet',
    'productivité équipe',
    'alternative notion',
    'alternative trello',
    'kanban simple',
    'notes markdown partagées',
    'calendrier équipe',
  ],
  authors: [{ name: 'nexaBoard' }],
  openGraph: {
    title: 'nexaBoard — Productivité sans friction pour petites équipes',
    description:
      'Tâches, notes et calendrier réunis dans un seul outil intuitif. 100% gratuit pendant la bêta fermée.',
    url: 'https://nexaboardapp.up.railway.app',
    siteName: 'nexaBoard',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'nexaBoard — Espace de travail unifié',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nexaBoard — Productivité sans friction pour petites équipes',
    description:
      'Tâches, notes et calendrier réunis dans un seul outil intuitif. Rejoignez la cohorte pionnière.',
    images: ['/og-image.png'],
    creator: '@nexaboard',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'nexaBoard',
  operatingSystem: 'Web Browser',
  applicationCategory: 'BusinessApplication',
  description:
    'Application de productivité unifiée combinant tableaux Kanban, notes Markdown et calendrier pour équipes de 5 à 20 personnes.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased font-sans selection:bg-primary-100 selection:text-primary-700">
        {children}
      </body>
    </html>
  );
}
