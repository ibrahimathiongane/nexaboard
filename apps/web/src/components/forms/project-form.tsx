'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

interface Project {
  id: string;
  name: string;
  description?: string | null;
  color: string;
}

interface ProjectFormProps {
  workspaceId: string;
  project?: Project;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#F97316',
];

interface FormErrors {
  name?: string;
}

export function ProjectForm({ workspaceId, project, open, onClose, onSuccess }: ProjectFormProps) {
  const isEditing = !!project;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (open) {
      if (project) {
        setName(project.name);
        setDescription(project.description || '');
        setColor(project.color);
      } else {
        setName('');
        setDescription('');
        setColor(PRESET_COLORS[0]);
      }
      setErrors({});
      setApiError('');
    }
  }, [open, project]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
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
        name: name.trim(),
        description: description.trim() || undefined,
        color,
      };

      if (isEditing) {
        await api.patch(`/api/v1/projects/${project.id}`, payload);
      } else {
        await api.post(`/api/v1/workspaces/${workspaceId}/projects`, payload);
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
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Modifier le projet' : 'Créer un projet'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <div>
          <label htmlFor="project-name" className="block text-sm font-medium">
            Nom <span className="text-destructive">*</span>
          </label>
          <Input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mon projet"
            className="mt-1"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="project-desc" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="project-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du projet (optionnel)"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Couleur</label>
          <div className="mt-2 flex gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c ? 'border-foreground ring-2 ring-foreground/20' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Couleur ${c}`}
              />
            ))}
          </div>
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
