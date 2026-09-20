'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

interface Note {
  id: string;
  title: string;
  contentMd?: string | null;
  projectId?: string | null;
}

interface Project {
  id: string;
  name: string;
}

interface NoteFormProps {
  workspaceId: string;
  note?: Note;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  title?: string;
}

export function NoteForm({ workspaceId, note, open, onClose, onSuccess }: NoteFormProps) {
  const isEditing = !!note;
  const [title, setTitle] = useState('');
  const [contentMd, setContentMd] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (open) {
      if (note) {
        setTitle(note.title);
        setContentMd(note.contentMd || '');
        setProjectId(note.projectId || '');
      } else {
        setTitle('');
        setContentMd('');
        setProjectId('');
      }
      setErrors({});
      setApiError('');
    }
  }, [open, note]);

  useEffect(() => {
    if (open) {
      api
        .get<Project[]>(`/api/v1/workspaces/${workspaceId}/projects`)
        .then(setProjects)
        .catch(() => setProjects([]));
    }
  }, [open, workspaceId]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
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
        contentMd: contentMd.trim() || undefined,
        projectId: projectId || null,
      };

      if (isEditing) {
        await api.patch(`/api/v1/notes/${note.id}`, payload);
      } else {
        await api.post('/api/v1/notes', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier la note' : 'Créer une note'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <div>
          <label htmlFor="note-title" className="block text-sm font-medium">
            Titre <span className="text-destructive">*</span>
          </label>
          <Input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la note"
            className="mt-1"
          />
          {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="note-project" className="block text-sm font-medium">
            Projet
          </label>
          <select
            id="note-project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Aucun projet</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note-content" className="block text-sm font-medium">
            Contenu (Markdown)
          </label>
          <Textarea
            id="note-content"
            value={contentMd}
            onChange={(e) => setContentMd(e.target.value)}
            placeholder="Écrivez votre note en Markdown..."
            className="mt-1 font-mono text-sm"
            rows={10}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Envoi...' : isEditing ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
