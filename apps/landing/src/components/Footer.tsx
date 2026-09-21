import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 sm:py-12 text-sm text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <span className="text-base font-extrabold tracking-tight text-slate-900">nexaBoard</span>
          <span className="hidden sm:inline">•</span>
          <span>Conçu avec rigueur en France 🇫🇷</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs">
          <Link href="/privacy" className="hover:text-primary-600 transition">
            Confidentialité
          </Link>
          <Link href="/terms" className="hover:text-primary-600 transition">
            Conditions d&apos;utilisation
          </Link>
          <Link href="/terms" className="hover:text-primary-600 transition">
            Mentions légales
          </Link>
          <a href="mailto:contact@nexaboard.io" className="hover:text-primary-600 transition">
            Contact fondateur
          </a>
          <a href="https://github.com/nexaboard" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition">
            GitHub
          </a>
          <a href="https://twitter.com/nexaboard" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition">
            Twitter / X
          </a>
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            Tous les systèmes opérationnels
          </span>
        </div>

        <p className="text-xs text-slate-400">© 2026 nexaBoard. Conçu avec rigueur en France.</p>
      </div>
    </footer>
  );
}
