'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/lib/api';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TaskForm } from '@/components/forms/task-form';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  order: number;
  dueDate: string | null;
  project: { id: string; name: string; color: string };
  assignees: { userId: string; user: { id: string; firstName: string; lastName: string } }[];
  labels: { labelId: string; label: { id: string; name: string; color: string } }[];
  _count: { subtasks: number };
}

const COLUMNS = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED'] as const;

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

const PRIORITY_DOT: Record<string, string> = {
  URGENT: 'bg-red-500',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-green-500',
};

function SortableTaskCard({
  task,
  onEdit,
  overlay,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task, type: 'task' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`cursor-grab active:cursor-grabbing hover:border-primary/50 select-none ${
          overlay ? 'shadow-lg border-primary/50 rotate-2' : ''
        }`}
        onClick={(e) => {
          if (!isDragging) {
            e.stopPropagation();
            onEdit(task);
          }
        }}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{task.title}</p>
              <p className="text-xs text-muted-foreground truncate">{task.project.name}</p>
            </div>
          </div>
          {(task.labels.length > 0 || task.assignees.length > 0 || task.dueDate) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.labels.slice(0, 3).map(({ label }) => (
                <span
                  key={label.id}
                  className="inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium border"
                  style={{ borderColor: label.color, color: label.color }}
                >
                  {label.name}
                </span>
              ))}
              {task.assignees.slice(0, 2).map(({ user }) => (
                <span
                  key={user.id}
                  className="inline-block rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium"
                >
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              ))}
              {task.dueDate && (
                <span className="inline-block rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                  {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({
  status,
  tasks,
  onEdit,
}: {
  status: string;
  tasks: Task[];
  onEdit: (t: Task) => void;
}) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {STATUS_LABELS[status]}
        </h3>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 min-h-[120px] rounded-lg bg-muted/30 p-2">
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function TasksPage() {
  const { currentWorkspaceId } = useWorkspaceStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

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

  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    for (const col of COLUMNS) {
      grouped[col] = tasks
        .filter((t) => t.status === col)
        .sort((a, b) => a.order - b.order);
    }
    return grouped;
  }, [tasks]);

  function handleEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleCreate() {
    setEditingTask(undefined);
    setFormOpen(true);
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const overTask = tasks.find((t) => t.id === overId);
    const overColumn = COLUMNS.find((c) => c === overId);

    let targetStatus: string;
    if (overTask) {
      targetStatus = overTask.status;
    } else if (overColumn) {
      targetStatus = overColumn;
    } else {
      return;
    }

    if (activeTask.status !== targetStatus) {
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === activeId ? { ...t, status: targetStatus } : t,
        );
        const columnTasks = updated
          .filter((t) => t.status === targetStatus && t.id !== activeId)
          .sort((a, b) => a.order - b.order);

        if (overTask) {
          const overIndex = columnTasks.findIndex((t) => t.id === overId);
          return arrayMove(updated, updated.findIndex((t) => t.id === activeId), -1).map((t) => {
            if (t.id === activeId) return t;
            return t;
          });
        }

        return updated;
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const overTask = tasks.find((t) => t.id === overId);
    const overColumn = COLUMNS.find((c) => c === overId);
    const targetStatus = overTask?.status || overColumn || tasks.find((t) => t.id === activeId)?.status || 'TODO';

    setTasks((prev) => {
      const moved = prev.find((t) => t.id === activeId);
      if (!moved) return prev;

      const columnTasks = prev
        .filter((t) => t.status === targetStatus && t.id !== activeId)
        .sort((a, b) => a.order - b.order);

      let insertIndex: number;
      if (overTask) {
        insertIndex = columnTasks.findIndex((t) => t.id === overId);
        if (insertIndex === -1) insertIndex = columnTasks.length;
      } else {
        insertIndex = columnTasks.length;
      }

      const movedTask = { ...moved, status: targetStatus };
      const others = prev.filter((t) => t.id !== activeId);
      const sameColumn = others
        .filter((t) => t.status === targetStatus)
        .sort((a, b) => a.order - b.order);

      const before = sameColumn.slice(0, insertIndex);
      const after = sameColumn.slice(insertIndex);
      const result = [...others.filter((t) => t.status !== targetStatus), ...before, movedTask, ...after];

      return result.map((t, i) => ({ ...t, order: i }));
    });

    api
      .patch('/api/v1/tasks/reorder', { items: [{ taskId: activeId, status: targetStatus, order: 0 }] })
      .catch(() => {
        toast.error('Erreur lors de la réorganisation');
        fetchTasks();
      });
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
              role="button"
              tabIndex={0}
              onClick={() => handleEdit(task)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEdit(task); } }}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasksByColumn[status]}
                onEdit={handleEdit}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <SortableTaskCard task={activeTask} onEdit={() => {}} overlay />
            ) : null}
          </DragOverlay>
        </DndContext>
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
