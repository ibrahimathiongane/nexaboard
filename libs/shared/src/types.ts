export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  timezone: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  archived: boolean;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  points?: number;
  projectId: string;
  parentId?: string;
  order: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: Record<string, unknown>;
  contentMd?: string;
  icon?: string;
  cover?: string;
  projectId?: string;
  parentId?: string;
  published: boolean;
  archived: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  recurrence?: Record<string, unknown>;
  color: string;
  taskId?: string;
  externalId?: string;
  provider?: string;
  workspaceId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
