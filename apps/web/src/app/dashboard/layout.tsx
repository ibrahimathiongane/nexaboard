'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

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
  } = useWorkspaceStore();

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

  return (
    <div className="flex h-screen">
      <aside className="flex w-64 flex-col border-r bg-muted/40">
        <div className="p-4">
          <h2 className="text-lg font-semibold">nexaBoard</h2>
        </div>

        {workspaces.length > 0 && (
          <div className="px-4 pb-4">
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
          </div>
        )}

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
    </div>
  );
}
