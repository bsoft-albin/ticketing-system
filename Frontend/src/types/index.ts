export const TicketStatus = {
  OPEN: 0,
  IN_PROGRESS: 1,
  RESOLVED: 2,
  CLOSED: 3,
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export const TicketPriority = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3,
} as const;

export type TicketPriority = typeof TicketPriority[keyof typeof TicketPriority];

export const TicketType = {
  BUG: 0,
  FEATURE: 1,
  ENHANCEMENT: 2,
} as const;

export type TicketType = typeof TicketType[keyof typeof TicketType];

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

export interface UserDto {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
}

export interface TicketDto {
  id: string;
  title: string;
  description: string;
  appId: string;
  appName: string;
  createdBy: string;
  creatorName: string;
  assignedTo?: string;
  assigneeName?: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  createdAt: string;
}

export interface ProjectAppDto {
  id: string;
  name: string;
  description: string;
  type: number;
  createdAt: string;
}

export interface ApplicationDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  user: UserDto;
}

export interface DashboardSummaryDto {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  pendingTickets: number;
}

export interface StatusStatDto {
  status: string;
  count: number;
}

export interface PriorityStatDto {
  priority: string;
  count: number;
}

export interface AppStatDto {
  appName: string;
  count: number;
}

export interface AuditLogDto {
  id: string;
  entityName: string;
  entityId: string;
  action: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}
