'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Tableau de bord' },
  { href: '/dashboard/tasks', label: 'Tâches' },
  { href: '/dashboard/notes', label: 'Notes' },
  { href: '/dashboard/calendar', label: 'Calendrier' },
  { href: '/dashboard/projects', label: 'Projets' },
  { href: '/dashboard/team', label: 'Équipe' },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    workspaces,
    currentWorkspaceId,
    isLoading,
    fetchWorkspaces,
    setCurrentWorkspace,
    getCurrentWorkspace,
    createWorkspace,
  } = useWorkspaceStore();
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [workspaceSubmitting, setWorkspaceSubmitting] = useState(false);

  useEffect(() => {
    if (workspaces.length === 0) {
      fetchWorkspaces();
    }
  }, [workspaces.length, fetchWorkspaces]);

  const currentWorkspace = getCurrentWorkspace();

  const handleLogout = () => {
    void api.post('/api/v1/auth/logout', {}).finally(() => {
      logout();
      router.push('/auth/login');
    });
  };

  async function handleCreateWorkspace(event: React.FormEvent) {
    event.preventDefault();
    if (!workspaceName.trim()) return;

    setWorkspaceSubmitting(true);
    setWorkspaceError(null);
    try {
      await createWorkspace({
        name: workspaceName.trim(),
        description: workspaceDescription.trim() || undefined,
      });
      setWorkspaceName('');
      setWorkspaceDescription('');
      setWorkspaceModalOpen(false);
    } catch (error) {
      setWorkspaceError(
        error instanceof Error ? error.message : 'Erreur lors de la création du workspace',
      );
    } finally {
      setWorkspaceSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen">
      <aside className="flex w-64 flex-col border-r bg-muted/40">
        <div className="p-4">
          <h2 className="text-lg font-semibold">nexaBoard</h2>
        </div>

        <div className="px-4 pb-4">
          {workspaces.length > 0 && (
            <>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Espace de travail
              </label>
              <select
                value={currentWorkspaceId ?? ''}
                onChange={(e) => setCurrentWorkspace(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => {
              setWorkspaceError(null);
              setWorkspaceModalOpen(true);
            }}
          >
            + Nouveau workspace
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                  isActive && 'bg-accent font-medium text-accent-foreground',
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="mb-3">
            {user && (
              <p className="truncate text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
            )}
            {user && (
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">{children}</main>

      <Modal
        open={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
        title="Créer un workspace"
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          {workspaceError && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {workspaceError}
            </p>
          )}
          <div className="space-y-2">
            <label htmlFor="new-workspace-name" className="text-sm font-medium">
              Nom <span className="text-destructive">*</span>
            </label>
            <Input
              id="new-workspace-name"
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              placeholder="Mon équipe"
              maxLength={100}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="new-workspace-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="new-workspace-description"
              value={workspaceDescription}
              onChange={(event) => setWorkspaceDescription(event.target.value)}
              placeholder="Description de votre espace de travail"
              maxLength={500}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setWorkspaceModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={workspaceSubmitting}>
              {workspaceSubmitting ? 'Création...' : 'Créer le workspace'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
