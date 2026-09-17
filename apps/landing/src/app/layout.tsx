import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'nexaBoard - Productivité simple pour petites équipes',
  description: 'Kanban, tâches, notes et calendrier partagés — tout en un seul outil intuitif.',
  openGraph: {
    title: 'nexaBoard - Productivité simple pour petites équipes',
    description: 'Kanban, tâches, notes et calendrier partagés — tout en un seul outil intuitif.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
