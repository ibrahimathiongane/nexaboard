'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NoteForm } from '@/components/forms/note-form';

interface Note {
  id: string;
  title: string;
  icon: string | null;
  contentMd: string | null;
  project: { id: string; name: string; color: string } | null;
  createdAt: string;
  updatedAt: string;
  _count: { comments: number; children: number };
}

export default function NotesPage() {
  const { currentWorkspaceId } = useWorkspaceStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<Note[]>('/api/v1/notes');
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  function handleEdit(note: Note) {
    setEditingNote(note);
    setFormOpen(true);
  }

  function handleCreate() {
    setEditingNote(undefined);
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button size="sm" onClick={handleCreate}>Nouvelle note</Button>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Aucune note pour le moment</p>
            <Button className="mt-4" size="sm" onClick={handleCreate}>
              Créer une note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="cursor-pointer hover:border-primary/50"
              onClick={() => handleEdit(note)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {note.icon && <span className="mr-2">{note.icon}</span>}
                  {note.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {note.contentMd && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {note.contentMd}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {note.project?.name || 'Sans projet'}
                  </span>
                  <span>
                    {new Date(note.updatedAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NoteForm
        workspaceId={currentWorkspaceId}
        note={editingNote}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchNotes}
      />
    </div>
  );
}
