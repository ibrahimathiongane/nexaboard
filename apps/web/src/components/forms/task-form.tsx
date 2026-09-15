'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  projectId?: string;
  assignees?: { userId: string }[];
  labels?: { labelId: string }[];
}

interface Project {
  id: string;
  name: string;
}

interface Member {
  userId: string;
  user: { firstName: string; lastName: string; email: string };
}

interface Label {
  id: string;
  name: string;
  color: string;
}

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

interface TaskFormProps {
  workspaceId: string;
  projectId?: string;
  task?: Task;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  title?: string;
  projectId?: string;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'À faire' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'IN_REVIEW', label: 'En revue' },
  { value: 'DONE', label: 'Terminé' },
  { value: 'CANCELLED', label: 'Annulé' },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'URGENT', label: 'Urgente' },
  { value: 'HIGH', label: 'Haute' },
  { value: 'MEDIUM', label: 'Moyenne' },
  { value: 'LOW', label: 'Basse' },
];

export function TaskForm({
  workspaceId,
  projectId: defaultProjectId,
  task,
  open,
  onClose,
  onSuccess,
}: TaskFormProps) {
  const isEditing = !!task;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [labelIds, setLabelIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status as TaskStatus);
        setPriority(task.priority as Priority);
        setDueDate(
          task.dueDate
            ? new Date(task.dueDate).toISOString().slice(0, 16)
            : '',
        );
        setProjectId(task.projectId || '');
        setAssigneeIds(task.assignees?.map((assignee) => assignee.userId) ?? []);
        setLabelIds(task.labels?.map((item) => item.labelId) ?? []);
      } else {
        setTitle('');
        setDescription('');
        setStatus('TODO');
        setPriority('MEDIUM');
        setDueDate('');
        setProjectId(defaultProjectId || '');
        setAssigneeIds([]);
        setLabelIds([]);
      }
      setErrors({});
      setApiError('');
    }
  }, [open, task, defaultProjectId]);

  useEffect(() => {
    if (open) {
      api
        .get<Project[]>(`/api/v1/workspaces/${workspaceId}/projects`)
        .then(setProjects)
        .catch(() => setProjects([]));
      api
        .get<Member[]>(`/api/v1/workspaces/${workspaceId}/members`)
        .then(setMembers)
        .catch(() => setMembers([]));
      api
        .get<Label[]>(`/api/v1/workspaces/${workspaceId}/labels`)
        .then(setLabels)
        .catch(() => setLabels([]));
    }
  }, [open, workspaceId]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!isEditing && !projectId) {
      newErrors.projectId = 'Le projet est requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        assigneeIds,
        labelIds,
      };

      if (isEditing) {
        await api.patch(`/api/v1/tasks/${task.id}`, payload);
        const currentAssigneeIds = new Set(task.assignees?.map((item) => item.userId) ?? []);
        const currentLabelIds = new Set(task.labels?.map((item) => item.labelId) ?? []);
        await Promise.all([
          ...assigneeIds
            .filter((id) => !currentAssigneeIds.has(id))
            .map((id) => api.post(`/api/v1/tasks/${task.id}/assign`, { userId: id })),
          ...Array.from(currentAssigneeIds)
            .filter((id) => !assigneeIds.includes(id))
            .map((id) => api.delete(`/api/v1/tasks/${task.id}/assign/${id}`)),
          ...labelIds
            .filter((id) => !currentLabelIds.has(id))
            .map((id) => api.post(`/api/v1/tasks/${task.id}/labels`, { labelId: id })),
          ...Array.from(currentLabelIds)
            .filter((id) => !labelIds.includes(id))
            .map((id) => api.delete(`/api/v1/tasks/${task.id}/labels/${id}`)),
        ]);
      } else {
        await api.post(`/api/v1/projects/${projectId}/tasks`, payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : 'Une erreur est survenue',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Modifier la tâche' : 'Créer une tâche'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <div>
          <label htmlFor="task-title" className="block text-sm font-medium">
            Titre <span className="text-destructive">*</span>
          </label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la tâche"
            className="mt-1"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="task-desc" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la tâche (optionnel)"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="task-project" className="block text-sm font-medium">
            Projet <span className="text-destructive">*</span>
          </label>
          <select
            id="task-project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Sélectionner un projet</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="mt-1 text-xs text-destructive">{errors.projectId}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-status" className="block text-sm font-medium">
              Statut
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-assignees" className="block text-sm font-medium">
              Assignés
            </label>
            <select
              id="task-assignees"
              multiple
              value={assigneeIds}
              onChange={(e) => setAssigneeIds(Array.from(e.target.selectedOptions, (option) => option.value))}
              className="mt-1 min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user.firstName} {member.user.lastName} ({member.user.email})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">Maintenez Ctrl/Cmd pour sélectionner plusieurs membres.</p>
          </div>

          <div>
            <label htmlFor="task-labels" className="block text-sm font-medium">
              Labels
            </label>
            <select
              id="task-labels"
              multiple
              value={labelIds}
              onChange={(e) => setLabelIds(Array.from(e.target.selectedOptions, (option) => option.value))}
              className="mt-1 min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              {labels.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">Les labels sont gérés par les administrateurs du workspace.</p>
          </div>

          <div>
            <label
              htmlFor="task-priority"
              className="block text-sm font-medium"
            >
              Priorité
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="task-due" className="block text-sm font-medium">
            Date d&apos;échéance
          </label>
          <Input
            id="task-due"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? 'Envoi...'
              : isEditing
                ? 'Enregistrer'
                : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
