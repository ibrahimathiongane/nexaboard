'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

interface Member {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Propriétaire',
  ADMIN: 'Administrateur',
  MEMBER: 'Membre',
};

const ROLE_VARIANTS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  OWNER: 'default',
  ADMIN: 'secondary',
  MEMBER: 'outline',
};

export default function TeamPage() {
  const { currentWorkspaceId, getCurrentWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const currentUser = useAuthStore((s) => s.user);
  const workspace = getCurrentWorkspace();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('MEMBER');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!currentWorkspaceId) return;
    try {
      setLoading(true);
      const data = await api.get<Member[]>(
        `/api/v1/workspaces/${currentWorkspaceId}/members`,
      );
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [currentWorkspaceId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!currentWorkspaceId || !inviteEmail.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post(`/api/v1/workspaces/${currentWorkspaceId}/members`, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setInviteEmail('');
      setInviteRole('MEMBER');
      setModalOpen(false);
      await Promise.all([fetchMembers(), fetchWorkspaces()]);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur lors de l'invitation");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(memberId: string, userId: string) {
    if (!currentWorkspaceId) return;
    setRemovingId(memberId);
    try {
      await api.delete(`/api/v1/workspaces/${currentWorkspaceId}/members/${userId}`);
      await Promise.all([fetchMembers(), fetchWorkspaces()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setRemovingId(null);
    }
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

  const displayMembers = workspace?.members ?? members;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Équipe</h1>
          <p className="text-sm text-muted-foreground">
            {displayMembers.length} membre{displayMembers.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          Inviter un membre
        </Button>
      </div>

      {displayMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Aucun membre pour le moment</p>
            <Button className="mt-4" size="sm" onClick={() => setModalOpen(true)}>
              Inviter un membre
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {displayMembers.map((member) => {
            const initials = `${member.user.firstName.charAt(0)}${member.user.lastName.charAt(0)}`.toUpperCase();
            const isCurrentUser = member.userId === currentUser?.id;
            const isOwner = member.role === 'OWNER';
            return (
              <Card key={member.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {member.user.firstName} {member.user.lastName}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-muted-foreground">(vous)</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.user.email}
                    </p>
                  </div>
                  <Badge variant={ROLE_VARIANTS[member.role] ?? 'outline'}>
                    {ROLE_LABELS[member.role] ?? member.role}
                  </Badge>
                  {!isOwner && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={removingId === member.id}
                      onClick={() => handleRemove(member.id, member.userId)}
                    >
                      {removingId === member.id ? '...' : 'Retirer'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Inviter un membre">
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Adresse e-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="membre@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Rôle
            </label>
            <select
              id="role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="MEMBER">Membre</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Envoi...' : 'Envoyer l\'invitation'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
