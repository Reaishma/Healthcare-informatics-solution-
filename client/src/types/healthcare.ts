export interface DashboardStats {
  activeWorkflows: number;
  pendingTasks: number;
  staffOnDuty: number;
  patientQueue: number;
}

export interface WorkflowMetrics {
  totalWorkflows: number;
  completedWorkflows: number;
  averageCompletionTime: number;
  bottlenecksDetected: number;
}

export interface PatientFlowData {
  stageName: string;
  patientCount: number;
  averageWaitTime: number;
  capacity: number;
  status: 'normal' | 'bottleneck' | 'critical';
}

export interface TaskAssignment {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  location?: string;
}

export interface StaffSchedule {
  id: number;
  staffId: number;
  staffName: string;
  role: string;
  shiftStart: Date;
  shiftEnd: Date;
  isActive: boolean;
}

export interface WorkflowStep {
  id: number;
  name: string;
  description: string;
  order: number;
  requiredRole: string;
  estimatedDuration: number;
  dependencies: number[];
}

export interface NotificationMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface SprintMetrics {
  sprintNumber: number;
  totalStories: number;
  completedStories: number;
  inProgressStories: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
  burndownRate: number;
  daysRemaining: number;
}

export interface PerformanceMetrics {
  workflowEfficiency: number;
  averageProcessTime: number;
  bottleneckResolutionTime: number;
  staffUtilization: number;
  patientSatisfactionScore: number;
}

