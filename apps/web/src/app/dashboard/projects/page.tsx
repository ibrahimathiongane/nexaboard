'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectForm } from '@/components/forms/project-form';

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  archived: boolean;
  _count: { tasks: number; notes: number };
}

export default function ProjectsPage() {
  const { currentWorkspaceId } = useWorkspaceStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const fetchProjects = useCallback(async () => {
    if (!currentWorkspaceId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Project[]>(`/api/v1/workspaces/${currentWorkspaceId}/projects`);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [currentWorkspaceId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function handleEdit(project: Project) {
    setEditingProject(project);
    setFormOpen(true);
  }

  function handleCreate() {
    setEditingProject(undefined);
    setFormOpen(true);
  }

  if (!currentWorkspaceId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Sélectionnez un espace de travail</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Projets</h1>
        <Button size="sm" onClick={handleCreate}>
          Nouveau projet
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Aucun projet pour le moment</p>
            <Button className="mt-4" size="sm" onClick={handleCreate}>
              Créer un projet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:border-primary/50"
              onClick={() => handleEdit(project)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <CardTitle className="text-base">{project.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {project.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <Badge variant="secondary">
                    {project._count.tasks} tâche{project._count.tasks > 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="secondary">
                    {project._count.notes} note{project._count.notes > 1 ? 's' : ''}
                  </Badge>
                  {project.archived && <Badge variant="outline">Archivé</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectForm
        workspaceId={currentWorkspaceId}
        project={editingProject}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
