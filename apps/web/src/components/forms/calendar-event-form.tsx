'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  start: string;
  end: string;
  allDay: boolean;
}

interface CalendarEventFormProps {
  workspaceId: string;
  event?: CalendarEvent;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  title?: string;
  start?: string;
  end?: string;
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CalendarEventForm({
  workspaceId,
  event,
  open,
  onClose,
  onSuccess,
}: CalendarEventFormProps) {
  const isEditing = !!event;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (open) {
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setStart(toDatetimeLocal(event.start));
        setEnd(toDatetimeLocal(event.end));
        setAllDay(event.allDay);
      } else {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        const later = new Date(now);
        later.setHours(later.getHours() + 1);
        setTitle('');
        setDescription('');
        setStart(toDatetimeLocal(now.toISOString()));
        setEnd(toDatetimeLocal(later.toISOString()));
        setAllDay(false);
      }
      setErrors({});
      setApiError('');
    }
  }, [open, event]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!start) {
      newErrors.start = 'La date de début est requise';
    }
    if (!end) {
      newErrors.end = 'La date de fin est requise';
    }
    if (start && end && new Date(start) >= new Date(end)) {
      newErrors.end = 'La date de fin doit être après la date de début';
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
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        allDay,
      };

      if (isEditing) {
        await api.patch(`/api/v1/calendar/${event.id}`, payload);
      } else {
        await api.post('/api/v1/calendar', { ...payload, workspaceId });
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
      title={isEditing ? "Modifier l'événement" : 'Créer un événement'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <div>
          <label htmlFor="event-title" className="block text-sm font-medium">
            Titre <span className="text-destructive">*</span>
          </label>
          <Input
            id="event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'événement"
            className="mt-1"
          />
          {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="event-desc" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="event-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="event-allday"
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="event-allday" className="text-sm font-medium">
            Toute la journée
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-start" className="block text-sm font-medium">
              Début <span className="text-destructive">*</span>
            </label>
            <Input
              id="event-start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1"
            />
            {errors.start && <p className="mt-1 text-xs text-destructive">{errors.start}</p>}
          </div>

          <div>
            <label htmlFor="event-end" className="block text-sm font-medium">
              Fin <span className="text-destructive">*</span>
            </label>
            <Input
              id="event-end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1"
            />
            {errors.end && <p className="mt-1 text-xs text-destructive">{errors.end}</p>}
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
