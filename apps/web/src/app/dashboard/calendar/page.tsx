'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarEventForm } from '@/components/forms/calendar-event-form';

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  task: { id: string; title: string } | null;
}

export default function CalendarPage() {
  const { currentWorkspaceId } = useWorkspaceStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);

  const fetchEvents = useCallback(async () => {
    if (!currentWorkspaceId) {
      setEvents([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      const data = await api.get<CalendarEvent[]>(
        `/api/v1/calendar/workspace/${currentWorkspaceId}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`,
      );
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [currentDate, currentWorkspaceId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function navigateMonth(direction: number) {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  }

  function handleEdit(event: CalendarEvent) {
    setEditingEvent(event);
    setFormOpen(true);
  }

  function handleCreate() {
    setEditingEvent(undefined);
    setFormOpen(true);
  }

  const monthName = currentDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendrier</h1>
        <Button size="sm" onClick={handleCreate}>
          Nouvel événement
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
          ←
        </Button>
        <h2 className="text-lg font-medium capitalize">{monthName}</h2>
        <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
          →
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Aucun événement ce mois-ci</p>
            <Button className="mt-4" size="sm" onClick={handleCreate}>
              Créer un événement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <Card
              key={event.id}
              className="cursor-pointer hover:border-primary/50"
              onClick={() => handleEdit(event)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: event.color }} />
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {new Date(event.start).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.start).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CalendarEventForm
        workspaceId={currentWorkspaceId}
        event={editingEvent}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
}
