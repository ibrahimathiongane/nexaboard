'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

type Status = 'loading' | 'success' | 'error';

function VerifyContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage("Token manquant dans l'URL");
      return;
    }

    api
      .post<{ message: string }>('/api/v1/auth/verify-email', { token })
      .then((res) => {
        setStatus('success');
        setMessage(res.message || 'Email vérifié avec succès');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Token invalide ou expiré');
      });
  }, [searchParams]);

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <h1 className="text-2xl font-bold">Vérification en cours...</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Nous vérifions votre adresse email.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600">Email vérifié !</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <Link
              href="/auth/login"
              className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Se connecter
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600">Erreur de vérification</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <Link
              href="/auth/login"
              className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <h1 className="text-2xl font-bold">Chargement...</h1>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
