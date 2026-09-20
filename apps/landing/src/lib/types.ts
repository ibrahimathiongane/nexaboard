export type TeamSize = '1-5' | '6-10' | '11-20' | '20+';
export type CurrentTool = 'trello' | 'notion' | 'asana' | 'clickup' | 'other' | 'none';
export type Interest = 'tasks' | 'notes' | 'calendar' | 'all_in_one' | 'cost_savings';

export interface SubscribedData {
  id: string;
  email: string;
  position: number;
  referralCode?: string;
}

export interface LandingState {
  email: string;
  setEmail: (v: string) => void;
  teamSize: TeamSize;
  setTeamSize: (v: TeamSize) => void;
  currentTool: CurrentTool;
  setCurrentTool: (v: CurrentTool) => void;
  interest: Interest;
  setInterest: (v: Interest) => void;
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  status: 'idle' | 'loading' | 'success' | 'error';
  setStatus: (v: 'idle' | 'loading' | 'success' | 'error') => void;
  errorMessage: string;
  setErrorMessage: (v: string) => void;
  openModalWithEmail: (email?: string) => void;
}
