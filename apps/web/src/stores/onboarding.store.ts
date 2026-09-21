import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OnboardingStep = 'welcome' | 'workspace' | 'project' | 'invite' | 'done';

interface OnboardingState {
  isComplete: boolean;
  currentStep: OnboardingStep;
  isOpen: boolean;
  workspaceId: string | null;

  openOnboarding: () => void;
  closeOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  setWorkspaceId: (id: string) => void;
  completeOnboarding: () => void;
}

const STEP_ORDER: OnboardingStep[] = ['welcome', 'workspace', 'project', 'invite', 'done'];

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      isComplete: false,
      currentStep: 'welcome',
      isOpen: false,
      workspaceId: null,

      openOnboarding: () => set({ isOpen: true }),
      closeOnboarding: () => set({ isOpen: false }),
      nextStep: () => {
        const current = get().currentStep;
        const idx = STEP_ORDER.indexOf(current);
        if (idx < STEP_ORDER.length - 1) {
          set({ currentStep: STEP_ORDER[idx + 1] });
        }
      },
      prevStep: () => {
        const current = get().currentStep;
        const idx = STEP_ORDER.indexOf(current);
        if (idx > 0) {
          set({ currentStep: STEP_ORDER[idx - 1] });
        }
      },
      goToStep: (step) => set({ currentStep: step }),
      setWorkspaceId: (id) => set({ workspaceId: id }),
      completeOnboarding: () => set({ isComplete: true, isOpen: false }),
    }),
    {
      name: 'nexaboard-onboarding',
      partialize: (state) => ({
        isComplete: state.isComplete,
        workspaceId: state.workspaceId,
      }),
    },
  ),
);
