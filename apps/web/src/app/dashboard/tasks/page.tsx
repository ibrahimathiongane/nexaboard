'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TaskForm } from '@/components/forms/task-form';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  project: { id: string; name: string; color: string };
  assignees: { userId: string; user: { id: string; firstName: string; lastName: string } }[];
  labels: { labelId: string; label: { id: string; name: string; color: string } }[];
  _count: { subtasks: number };
}

const STATUS_LABELS: Record<string, string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  IN_REVIEW: 'En revue',
  DONE: 'Terminé',
  CANCELLED: 'Annulé',
};

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  TODO: 'outline',
  IN_PROGRESS: 'default',
  IN_REVIEW: 'secondary',
  DONE: 'default',
  CANCELLED: 'destructive',
};

const PRIORITY_LABELS: Record<string, string> = {
  URGENT: 'Urgente',
  HIGH: 'Haute',
  MEDIUM: 'Moyenne',
  LOW: 'Basse',
};

export default function TasksPage() {
  const { currentWorkspaceId } = useWorkspaceStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const fetchTasks = useCallback(async () => {
    if (!currentWorkspaceId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Task[]>(
        `/api/v1/tasks?workspaceId=${encodeURIComponent(currentWorkspaceId)}`,
      );
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [currentWorkspaceId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  function handleEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleCreate() {
    setEditingTask(undefined);
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
        <h1 className="text-xl font-bold md:text-2xl">Tâches</h1>
        <div className="flex gap-2">
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            Liste
          </Button>
          <Button
            variant={view === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('kanban')}
          >
            Kanban
          </Button>
          <Button size="sm" onClick={handleCreate}>
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Aucune tâche pour le moment</p>
            <Button className="mt-4" size="sm" onClick={handleCreate}>
              Créer une tâche
            </Button>
          </CardContent>
        </Card>
      ) : view === 'list' ? (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="cursor-pointer hover:border-primary/50"
              onClick={() => handleEdit(task)}
            >
              <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{task.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{task.project.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Badge>
                  <Badge variant="outline">{PRIORITY_LABELS[task.priority]}</Badge>
                  {task.assignees.map(({ user }) => (
                    <span key={user.id} className="hidden text-xs text-muted-foreground sm:inline">
                      {user.firstName} {user.lastName}
                    </span>
                  ))}
                  {task.labels.map(({ label }) => (
                    <Badge key={label.id} variant="secondary" style={{ borderColor: label.color }} className="hidden sm:inline-flex">
                      {label.name}
                    </Badge>
                  ))}
                  {task.dueDate && (
                    <span className="text-sm text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED'].map((status) => (
            <div key={status}>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                {STATUS_LABELS[status]}
              </h3>
              <div className="space-y-2">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-pointer hover:border-primary/50"
                      onClick={() => handleEdit(task)}
                    >
                      <CardContent className="p-3">
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.project.name}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskForm
        workspaceId={currentWorkspaceId}
        task={editingTask}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchTasks}
      />
    </div>
  );
}
