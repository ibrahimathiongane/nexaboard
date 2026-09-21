import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface WorkspaceMember {
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

interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  plan: string;
  ownerId: string;
  members: WorkspaceMember[];
  _count?: {
    members: number;
    projects: number;
  };
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  isLoading: boolean;

  fetchWorkspaces: () => Promise<void>;
  setCurrentWorkspace: (id: string) => void;
  createWorkspace: (data: { name: string; description?: string }) => Promise<Workspace>;
  getCurrentWorkspace: () => Workspace | null;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: [],
      currentWorkspaceId: null,
      isLoading: false,

      fetchWorkspaces: async () => {
        set({ isLoading: true });
        try {
          const workspaces = await api.get<Workspace[]>('/api/v1/workspaces');
          set((state) => {
            const needsAutoSelect =
              (!state.currentWorkspaceId ||
                !workspaces.some((workspace) => workspace.id === state.currentWorkspaceId)) &&
              workspaces.length > 0;
            return {
              workspaces,
              currentWorkspaceId: needsAutoSelect
                ? workspaces[0].id
                : workspaces.length === 0
                  ? null
                  : state.currentWorkspaceId,
              isLoading: false,
            };
          });
        } catch (err) {
          console.error('Failed to fetch workspaces:', err);
          set({ isLoading: false });
        }
      },

      setCurrentWorkspace: (id) => set({ currentWorkspaceId: id }),

      createWorkspace: async (data) => {
        const workspace = await api.post<Workspace>('/api/v1/workspaces', data);
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
          currentWorkspaceId: workspace.id,
        }));
        return workspace;
      },

      getCurrentWorkspace: () => {
        const { workspaces, currentWorkspaceId } = get();
        return workspaces.find((w) => w.id === currentWorkspaceId) ?? null;
      },
    }),
    {
      name: 'workspace-storage',
      partialize: (state) => ({
        currentWorkspaceId: state.currentWorkspaceId,
      }),
    },
  ),
);
