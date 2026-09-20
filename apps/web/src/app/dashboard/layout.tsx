'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (workspaces.length === 0) {
      fetchWorkspaces();
    }
  }, [workspaces.length, fetchWorkspaces]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
      toast.success('Workspace créé');
    } catch (error) {
      setWorkspaceError(
        error instanceof Error ? error.message : 'Erreur lors de la création du workspace',
      );
    } finally {
      setWorkspaceSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4 shadow-sm md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <span className="text-sm font-semibold">nexaBoard</span>
        {currentWorkspace && (
          <span className="ml-1 truncate text-xs text-muted-foreground">{currentWorkspace.name}</span>
        )}
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-200 md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4 md:h-16 md:border-b md:px-4 md:py-4">
          <h2 className="text-lg font-semibold">nexaBoard</h2>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-accent md:hidden"
            aria-label="Fermer le menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-4 pt-2">
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
              href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'block rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent',
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
            {user && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0 p-5 md:p-8 lg:p-8">{children}</main>

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

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
