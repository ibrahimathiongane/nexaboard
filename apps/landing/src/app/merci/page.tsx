'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const position = searchParams.get('position') || '42';
  const email = searchParams.get('email') || '';
  const refCode = searchParams.get('ref') || `BETA-${position}X7A9`;
  const isAlready = searchParams.get('status') === 'already';

  const [copied, setCopied] = useState(false);

  const appBase = process.env.NEXT_PUBLIC_APP_URL || 'https://resplendent-hope-production-7e28.up.railway.app';
  const referralLink = `${appBase}?ref=${refCode}`;

  function handleCopy() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    posthog.capture('referral_link_copied', { position: Number(position) });
    setTimeout(() => setCopied(false), 3000);
  }

  const shareText = encodeURIComponent(
    `Je viens de réserver la place de mon équipe pour la bêta fermée de nexaBoard (l'espace de travail unifié tâches + notes + calendrier). Rejoignez la cohorte pionnière ici : ${referralLink}`,
  );

  return (
    <div className="mx-auto max-w-xl text-center">
      {/* Header Badge */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 border border-primary-200 mb-3">
        {isAlready ? 'Inscription déjà confirmée' : 'Place réservée avec succès'}
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
        Bienvenue dans la Cohorte Pionnière !
      </h1>

      <p className="mt-3 text-sm sm:text-base text-slate-600">
        {email ? (
          <>
            Un e-mail de confirmation avec vos identifiants a été expédié à{' '}
            <strong className="text-slate-900">{email}</strong>.
          </>
        ) : (
          'Votre demande d’accès prioritaire a bien été enregistrée.'
        )}
      </p>

      {/* Virtual Member Card */}
      <div className="my-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 p-6 sm:p-8 shadow-xl shadow-slate-200/50 text-left relative">
        <div className="absolute right-4 top-4 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Accès Bêta Garanti
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white font-black text-lg shadow-md shadow-primary-500/20">
            N
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Pioneer Access Pass</h2>
            <p className="text-xs text-slate-500">nexaBoard Private Cohort</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Votre Rang Bêta
            </span>
            <p className="text-3xl font-black text-primary-600 mt-0.5">#{position}</p>
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Statut
            </span>
            <p className="text-sm font-bold text-slate-800 mt-1.5">Membre Fondateur</p>
            <p className="text-xs text-emerald-600 font-medium">1 an de Plan Pro offert</p>
          </div>
        </div>

        <div className="mt-4 pt-1 text-xs text-slate-500">
          Votre espace de travail est en cours de déploiement sécurisé sur notre cluster souverain à
          Paris.
        </div>
      </div>

      {/* Viral Loop / Move up in line */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-left mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🚀</span>
          <h3 className="text-sm font-bold text-slate-900">
            Envie d’accéder à votre espace sans attendre ?
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Partagez nexaBoard à vos pairs ou collègues chefs de projets. Chaque équipe inscrite via
          votre lien unique vous fait gagner <strong>10 places dans la file</strong>.
        </p>

        {/* Copy Link Input */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 font-mono focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="whitespace-nowrap rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 transition"
          >
            {copied ? '✓ Copié !' : 'Copier'}
          </button>
        </div>

        {/* One-click share buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-indigo-100/80">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">
            Partager en 1 clic :
          </span>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Twitter / X
          </a>
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Action links */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
        <Link
          href="/"
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          ← Retour à l’accueil
        </Link>
        <a
          href={appBase}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition shadow"
        >
          Accéder à la plateforme de connexion →
        </a>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-slate-500 text-sm">Chargement...</div>}>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
