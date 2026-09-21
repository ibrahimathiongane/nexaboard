'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore, type OnboardingStep } from '@/stores/onboarding.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const STEPS: { key: OnboardingStep; label: string; num: number }[] = [
  { key: 'welcome', label: 'Bienvenue', num: 1 },
  { key: 'workspace', label: 'Espace', num: 2 },
  { key: 'project', label: 'Projet', num: 3 },
  { key: 'invite', label: 'Équipe', num: 4 },
  { key: 'done', label: 'C\'est parti', num: 5 },
];

const PROJECT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16',
];

export default function OnboardingWizard() {
  const router = useRouter();
  const { isOpen, currentStep, workspaceId, nextStep, prevStep, setWorkspaceId, completeOnboarding, closeOnboarding } = useOnboardingStore();
  const { createWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const { user } = useAuthStore();

  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectColor, setProjectColor] = useState(PROJECT_COLORS[0]);
  const [inviteEmails, setInviteEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleCreateWorkspace() {
    if (!workspaceName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const ws = await createWorkspace({ name: workspaceName.trim(), description: workspaceDescription.trim() || undefined });
      setWorkspaceId(ws.id);
      toast.success('Espace de travail créé !');
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject() {
    if (!projectName.trim() || !workspaceId) return;
    setLoading(true);
    setError('');
    try {
      await api.post(`/api/v1/workspaces/${workspaceId}/projects`, {
        name: projectName.trim(),
        color: projectColor,
      });
      toast.success('Projet créé !');
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite() {
    const emails = inviteEmails.split(/[,\n]/).map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0 || !workspaceId) {
      nextStep();
      return;
    }
    setLoading(true);
    setError('');
    try {
      for (const email of emails) {
        await api.post(`/api/v1/workspaces/${workspaceId}/members`, { email, role: 'MEMBER' }).catch(() => {});
      }
      toast.success(`${emails.length} invitation(s) envoyée(s) !`);
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  function handleFinish() {
    completeOnboarding();
    fetchWorkspaces();
    router.push('/dashboard');
  }

  function handleSkip() {
    completeOnboarding();
    fetchWorkspaces();
    router.push('/dashboard');
  }

  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-background border shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentIdx + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-1.5 pt-5 pb-2">
          {STEPS.map((step, i) => (
            <div key={step.key} className="flex items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i < currentIdx
                    ? 'bg-primary text-primary-foreground'
                    : i === currentIdx
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < currentIdx ? '✓' : step.num}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-6 ${i < currentIdx ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6 min-h-[320px]">
          {currentStep === 'welcome' && (
            <WelcomeStep user={user} onNext={nextStep} />
          )}
          {currentStep === 'workspace' && (
            <WorkspaceStep
              name={workspaceName}
              setName={setWorkspaceName}
              description={workspaceDescription}
              setDescription={setWorkspaceDescription}
              onSubmit={handleCreateWorkspace}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 'project' && (
            <ProjectStep
              name={projectName}
              setName={setProjectName}
              color={projectColor}
              setColor={setProjectColor}
              onSubmit={handleCreateProject}
              onSkip={nextStep}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 'invite' && (
            <InviteStep
              emails={inviteEmails}
              setEmails={setInviteEmails}
              onSubmit={handleInvite}
              onSkip={nextStep}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 'done' && (
            <DoneStep onFinish={handleFinish} />
          )}
        </div>

        {/* Footer */}
        {currentStep !== 'welcome' && currentStep !== 'done' && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <Button variant="ghost" size="sm" onClick={prevStep}>
              ← Retour
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
              Passer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function WelcomeStep({ user, onNext }: { user: { firstName?: string } | null; onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
        👋
      </div>
      <h2 className="text-2xl font-bold text-foreground">
        Bienvenue{user?.firstName ? `, ${user.firstName}` : ''} !
      </h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Configurons votre espace de travail en 3 étapes rapides.
        <br />
        Ça prend moins de 2 minutes.
      </p>
      <div className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
          Créer votre espace de travail
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
          Ajouter votre premier projet
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
          Inviter votre équipe (optionnel)
        </div>
      </div>
      <Button onClick={onNext} className="mt-8 w-full" size="lg">
        C&apos;est parti →
      </Button>
    </div>
  );
}

function WorkspaceStep({
  name, setName, description, setDescription, onSubmit, loading, error,
}: {
  name: string; setName: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  onSubmit: () => void; loading: boolean; error: string;
}) {
  return (
    <div>
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">🏢</div>
        <h2 className="text-xl font-bold">Créez votre espace</h2>
        <p className="mt-1 text-sm text-muted-foreground">C&apos;est l&apos;endroit où toute votre équipe travaillera ensemble.</p>
      </div>
      {error && <p className="mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Nom de l&apos;espace <span className="text-destructive">*</span></label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mon équipe"
            maxLength={100}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); }}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description <span className="text-muted-foreground text-xs">(optionnel)</span></label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="À quoi sert cet espace ?"
            maxLength={500}
            rows={3}
          />
        </div>
      </div>
      <Button onClick={onSubmit} disabled={!name.trim() || loading} className="mt-5 w-full" size="lg">
        {loading ? 'Création...' : 'Créer l\'espace →'}
      </Button>
    </div>
  );
}

function ProjectStep({
  name, setName, color, setColor, onSubmit, onSkip, loading, error,
}: {
  name: string; setName: (v: string) => void;
  color: string; setColor: (v: string) => void;
  onSubmit: () => void; onSkip: () => void; loading: boolean; error: string;
}) {
  return (
    <div>
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">📋</div>
        <h2 className="text-xl font-bold">Votre premier projet</h2>
        <p className="mt-1 text-sm text-muted-foreground">Un projet regroupe les tâches et notes de votre équipe.</p>
      </div>
      {error && <p className="mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Nom du projet <span className="text-destructive">*</span></label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sprint 1, Site web, App mobile..."
            maxLength={100}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); }}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Couleur</label>
          <div className="flex gap-2">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c ? 'border-foreground scale-110 ring-2 ring-foreground/20' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Button onClick={onSubmit} disabled={!name.trim() || loading} className="flex-1" size="lg">
          {loading ? 'Création...' : 'Créer le projet →'}
        </Button>
        <Button onClick={onSkip} variant="outline" size="lg">
          Passer
        </Button>
      </div>
    </div>
  );
}

function InviteStep({
  emails, setEmails, onSubmit, onSkip, loading, error,
}: {
  emails: string; setEmails: (v: string) => void;
  onSubmit: () => void; onSkip: () => void; loading: boolean; error: string;
}) {
  return (
    <div>
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">👥</div>
        <h2 className="text-xl font-bold">Invitez votre équipe</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ajoutez les emails de vos collègues (vous pourrez en inviter plus tard).</p>
      </div>
      {error && <p className="mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div>
        <label className="text-sm font-medium">Emails <span className="text-muted-foreground text-xs">(séparés par des virgules)</span></label>
        <Textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="alice@entreprise.fr, bob@entreprise.fr"
          rows={4}
        />
      </div>
      <div className="mt-5 flex gap-2">
        <Button onClick={onSubmit} disabled={loading} className="flex-1" size="lg">
          {loading ? 'Envoi...' : emails.trim() ? 'Envoyer les invitations →' : 'Continuer →'}
        </Button>
        <Button onClick={onSkip} variant="outline" size="lg">
          Passer
        </Button>
      </div>
    </div>
  );
}

function DoneStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl">
        🎉
      </div>
      <h2 className="text-2xl font-bold">Tout est prêt !</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Votre espace de travail, votre premier projet et votre équipe sont configurés.
        <br />
        Vous pouvez commencer à créer des tâches et des notes immédiatement.
      </p>
      <div className="mt-6 rounded-lg bg-muted/50 p-4 text-left text-sm text-muted-foreground space-y-1">
        <p>💡 <strong>Astuce :</strong> Essayez la vue Kanban dans la page Tâches pour glisser-déposer vos cartes.</p>
      </div>
      <Button onClick={onFinish} className="mt-6 w-full" size="lg">
        Accéder au tableau de bord →
      </Button>
    </div>
  );
}
