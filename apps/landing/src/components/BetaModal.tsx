'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { betaLeadSchema, type BetaLeadInput } from '@/lib/validation';
import { useAnalytics } from '@/lib/analytics';
import type { LandingState } from '@/lib/types';

interface BetaModalProps {
  state: LandingState;
}

export default function BetaModal({ state }: BetaModalProps) {
  const { isModalOpen, setIsModalOpen, status, setStatus } = state;
  const analytics = useAnalytics();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BetaLeadInput>({
    resolver: zodResolver(betaLeadSchema),
    defaultValues: {
      email: state.email,
      teamSize: state.teamSize,
      currentTool: state.currentTool,
      interest: state.interest,
    },
  });

  const teamSize = watch('teamSize');
  const currentTool = watch('currentTool');
  const interest = watch('interest');

  async function onSubmit(data: BetaLeadInput) {
    setStatus('loading');
    state.setErrorMessage('');

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://nexaboard-production.up.railway.app';

    try {
      let res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          teamSize: data.teamSize,
          currentTool: data.currentTool,
          interest: data.interest === 'all_in_one' ? undefined : data.interest,
        }),
      });

      if (res.status === 404) {
        res = await fetch(`${apiBase}/api/v1/beta/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            teamSize: data.teamSize,
            currentTool: data.currentTool,
            interest: data.interest === 'all_in_one' ? undefined : data.interest,
          }),
        });
      }

      const result = await res.json();

      if (res.status === 409) {
        const pos = result.error?.position || 14;
        window.location.assign(
          `/merci?email=${encodeURIComponent(data.email)}&position=${pos}&status=already`,
        );
        return;
      }

      if (!res.ok) {
        throw new Error(
          result.message || result.error?.message || "Une erreur est survenue lors de l'inscription.",
        );
      }

      const subscriber = result.data;
      analytics.track('beta_lead_completed', {
        team_size: data.teamSize,
        current_tool: data.currentTool,
        interest: data.interest,
        position: subscriber.position,
      });
      window.location.assign(
        `/merci?email=${encodeURIComponent(subscriber.email)}&position=${subscriber.position}&ref=${encodeURIComponent(subscriber.referralCode || '')}`,
      );
    } catch (err: unknown) {
      analytics.track('beta_lead_error', {
        error_code: err instanceof Error ? err.message : 'unknown',
      });
      setStatus('error');
      state.setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Erreur de connexion au serveur. Réessayez dans un instant.',
      );
    }
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          ✕
        </button>

        <div className="text-left">
          <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 mb-2 border border-primary-200">
            Étape 2 sur 2 : Personnalisation
          </span>
          <h3 className="text-xl font-bold text-slate-900">Activez votre accès Bêta Pionnier</h3>
          <p className="text-xs text-slate-500 mt-1">
            Deux choix rapides pour adapter l&apos;environnement de votre équipe.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5 text-left">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Votre adresse e-mail professionnelle :
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="nom@entreprise.fr"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Taille de votre équipe :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['1-5', '6-10', '11-20', '20+'] as const).map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => {
                    setValue('teamSize', size, { shouldValidate: true });
                  }}
                  className={`rounded-lg py-2 text-xs font-semibold border transition ${
                    teamSize === size
                      ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {size} pers.
                </button>
              ))}
            </div>
            <input type="hidden" {...register('teamSize')} />
            {errors.teamSize && (
              <p className="text-xs text-rose-600 mt-1">{errors.teamSize.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Votre outil principal actuel :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'notion', label: 'Notion' },
                { id: 'trello', label: 'Trello' },
                { id: 'asana', label: 'Asana' },
                { id: 'clickup', label: 'ClickUp' },
                { id: 'other', label: 'Autre' },
                { id: 'none', label: 'Aucun' },
              ].map((tool) => (
                <button
                  type="button"
                  key={tool.id}
                  onClick={() => {
                    setValue('currentTool', tool.id as BetaLeadInput['currentTool'], { shouldValidate: true });
                  }}
                  className={`rounded-lg py-2 text-xs font-semibold border transition ${
                    currentTool === tool.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
            <input type="hidden" {...register('currentTool')} />
            {errors.currentTool && (
              <p className="text-xs text-rose-600 mt-1">{errors.currentTool.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Votre priorité immédiate :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'all_in_one', label: 'Tout-en-un simple' },
                { id: 'tasks', label: 'Gagner du temps tâches' },
                { id: 'notes', label: 'Base de notes claire' },
                { id: 'cost_savings', label: 'Économies abonnements' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setValue('interest', item.id as BetaLeadInput['interest'], { shouldValidate: true });
                  }}
                  className={`rounded-lg py-2 px-2.5 text-left font-medium border transition ${
                    interest === item.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <input type="hidden" {...register('interest')} />
          </div>

          {state.errorMessage && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              {state.errorMessage}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow hover:bg-primary-700 transition disabled:opacity-50"
            >
              {status === 'loading'
                ? 'Validation de votre place...'
                : 'Confirmer ma place Bêta Privée →'}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Données hébergées en France. Aucun spam. Désinscription en 1 clic.
            </p>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
