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
  { value: 'TODO', label: '\u00c0 faire' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'IN_REVIEW', label: 'En revue' },
  { value: 'DONE', label: 'Termin\u00e9' },
  { value: 'CANCELLED', label: 'Annul\u00e9' },
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
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
        setProjectId(task.projectId || '');
        setAssigneeIds(task.assignees?.map((a) => a.userId) ?? []);
        setLabelIds(task.labels?.map((i) => i.labelId) ?? []);
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
      api.get<Project[]>(`/api/v1/workspaces/${workspaceId}/projects`).then(setProjects).catch(() => setProjects([]));
      api.get<Member[]>(`/api/v1/workspaces/${workspaceId}/members`).then(setMembers).catch(() => setMembers([]));
      api.get<Label[]>(`/api/v1/workspaces/${workspaceId}/labels`).then(setLabels).catch(() => setLabels([]));
    }
  }, [open, workspaceId]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = 'Le titre est requis';
    if (!isEditing && !projectId) newErrors.projectId = 'Le projet est requis';
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
      };

      if (isEditing) {
        await api.patch(`/api/v1/tasks/${task.id}`, payload);
        const currentAssigneeIds = new Set(task.assignees?.map((i) => i.userId) ?? []);
        const currentLabelIds = new Set(task.labels?.map((i) => i.labelId) ?? []);
        await Promise.all([
          ...assigneeIds.filter((id) => !currentAssigneeIds.has(id)).map((id) => api.post(`/api/v1/tasks/${task.id}/assign`, { userId: id })),
          ...Array.from(currentAssigneeIds).filter((id) => !assigneeIds.includes(id)).map((id) => api.delete(`/api/v1/tasks/${task.id}/assign/${id}`)),
          ...labelIds.filter((id) => !currentLabelIds.has(id)).map((id) => api.post(`/api/v1/tasks/${task.id}/labels`, { labelId: id })),
          ...Array.from(currentLabelIds).filter((id) => !labelIds.includes(id)).map((id) => api.delete(`/api/v1/tasks/${task.id}/labels/${id}`)),
        ]);
      } else {
        await api.post(`/api/v1/projects/${projectId}/tasks`, payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  function toggleAssignee(userId: string) {
    setAssigneeIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  }

  function toggleLabel(labelId: string) {
    setLabelIds((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId],
    );
  }

  const selectClass = 'mt-1 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier la t\u00e2che' : 'Cr\u00e9er une t\u00e2che'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{apiError}</div>
        )}

        <div>
          <label htmlFor="task-title" className="block text-sm font-medium">
            Titre <span className="text-destructive">*</span>
          </label>
          <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de la t\u00e2che" className="mt-1" />
          {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="task-desc" className="block text-sm font-medium">Description</label>
          <Textarea id="task-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optionnel)" className="mt-1" rows={3} />
        </div>

        <div>
          <label htmlFor="task-project" className="block text-sm font-medium">
            Projet <span className="text-destructive">*</span>
          </label>
          <select id="task-project" value={projectId} onChange={(e) => setProjectId(e.target.value)} className={selectClass}>
            <option value="">S\u00e9lectionner un projet</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.projectId && <p className="mt-1 text-xs text-destructive">{errors.projectId}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-status" className="block text-sm font-medium">Statut</label>
            <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={selectClass}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-priority" className="block text-sm font-medium">Priorit\u00e9</label>
            <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={selectClass}>
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Assign\u00e9s</label>
          {members.length === 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">Aucun membre dans le workspace</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {members.map((member) => {
                const isSelected = assigneeIds.includes(member.userId);
                return (
                  <button
                    key={member.userId}
                    type="button"
                    onClick={() => toggleAssignee(member.userId)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition min-h-[40px] ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="truncate">{member.user.firstName} {member.user.lastName}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Labels</label>
          {labels.length === 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">Aucun label disponible</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {labels.map((label) => {
                const isSelected = labelIds.includes(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition min-h-[40px] ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
                    {label.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="task-due" className="block text-sm font-medium">Date d&apos;\u00e9ch\u00e9ance</label>
          <Input id="task-due" type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Envoi...' : isEditing ? 'Enregistrer' : 'Cr\u00e9er'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
