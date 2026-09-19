'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { api } from '@/lib/api';
interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  archived: boolean;
  createdAt: string;
}

interface DashboardStats {
  activeTasks: number;
  activeProjects: number;
  totalNotes: number;
  upcomingEvents: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentProjects: Project[];
}

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-9 w-16 animate-pulse rounded bg-muted" />
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-3 w-48 animate-pulse rounded bg-muted" />
    </div>
  );
}

export default function DashboardPage() {
  const { currentWorkspaceId } = useWorkspaceStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!currentWorkspaceId) {
      setStats(null);
      setRecentProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<DashboardData>(
        `/api/v1/workspaces/${currentWorkspaceId}/dashboard`,
      );

      setStats(data.stats);
      setRecentProjects(data.recentProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspaceId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (!currentWorkspaceId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Sélectionnez un espace de travail</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tableau de bord</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Tâches en cours</h3>
              <p className="mt-2 text-3xl font-bold">{stats?.activeTasks ?? 0}</p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Projets actifs</h3>
              <p className="mt-2 text-3xl font-bold">{stats?.activeProjects ?? 0}</p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Notes récentes</h3>
              <p className="mt-2 text-3xl font-bold">{stats?.totalNotes ?? 0}</p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Événements à venir</h3>
              <p className="mt-2 text-3xl font-bold">{stats?.upcomingEvents ?? 0}</p>
            </div>
          </>
        )}
      </div>

      <h2 className="mb-4 mt-8 text-xl font-bold">Projets récents</h2>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      ) : recentProjects.length === 0 ? (
        <p className="text-muted-foreground">Aucun projet actif</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((project) => (
            <Link
              key={project.id}
              href="/dashboard/projects"
              className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <h3 className="font-medium">{project.name}</h3>
              </div>
              {project.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
