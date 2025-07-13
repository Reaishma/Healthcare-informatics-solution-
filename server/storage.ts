
import { 
  users, workflows, tasks, patientFlowStages, schedules, userStories, notifications,
  type User, type InsertUser, type Workflow, type InsertWorkflow, 
  type Task, type InsertTask, type PatientFlowStage, type InsertPatientFlowStage,
  type Schedule, type InsertSchedule, type UserStory, type InsertUserStory,
  type Notification, type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, count, avg } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  getActiveUsers(): Promise<User[]>;

  // Workflow methods
  getWorkflows(): Promise<Workflow[]>;
  getWorkflow(id: number): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, updates: Partial<InsertWorkflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: number): Promise<boolean>;

  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTasksByStatus(status: string): Promise<Task[]>;
  getTasksByAssignee(userId: number): Promise<Task[]>;
  getTasksByWorkflow(workflowId: number): Promise<Task[]>;

  // Patient flow methods
  getPatientFlowStages(): Promise<PatientFlowStage[]>;
  getPatientFlowStage(id: number): Promise<PatientFlowStage | undefined>;
  createPatientFlowStage(stage: InsertPatientFlowStage): Promise<PatientFlowStage>;
  updatePatientFlowStage(id: number, updates: Partial<InsertPatientFlowStage>): Promise<PatientFlowStage | undefined>;
  deletePatientFlowStage(id: number): Promise<boolean>;

  // Schedule methods
  getSchedules(): Promise<Schedule[]>;
  getSchedule(id: number): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: number, updates: Partial<InsertSchedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: number): Promise<boolean>;
  getSchedulesByUser(userId: number): Promise<Schedule[]>;
  getActiveSchedules(): Promise<Schedule[]>;

  // User story methods
  getUserStories(): Promise<UserStory[]>;
  getUserStory(id: number): Promise<UserStory | undefined>;
  createUserStory(story: InsertUserStory): Promise<UserStory>;
  updateUserStory(id: number, updates: Partial<InsertUserStory>): Promise<UserStory | undefined>;
  deleteUserStory(id: number): Promise<boolean>;
  getUserStoriesByStatus(status: string): Promise<UserStory[]>;

  // Notification methods
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  getUnreadNotifications(userId: number): Promise<Notification[]>;

  // Analytics methods
  getDashboardStats(): Promise<{
    activeWorkflows: number;
    pendingTasks: number;
    staffOnDuty: number;
    patientQueue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(and(eq(users.role, role), eq(users.isActive, true)));
  }

  async getActiveUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isActive, true));
  }

  // Workflow methods
  async getWorkflows(): Promise<Workflow[]> {
    return await db.select().from(workflows).orderBy(desc(workflows.createdAt));
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow || undefined;
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const [newWorkflow] = await db.insert(workflows).values(workflow).returning();
    return newWorkflow;
  }

  async updateWorkflow(id: number, updates: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    const [updated] = await db.update(workflows)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workflows.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteWorkflow(id: number): Promise<boolean> {
    const result = await db.delete(workflows).where(eq(workflows.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db.update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.status, status));
  }

  async getTasksByAssignee(userId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.assignedToId, userId));
  }

  async getTasksByWorkflow(workflowId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.workflowId, workflowId));
  }

  // Patient flow methods
  async getPatientFlowStages(): Promise<PatientFlowStage[]> {
    return await db.select().from(patientFlowStages).orderBy(patientFlowStages.order);
  }

  async getPatientFlowStage(id: number): Promise<PatientFlowStage | undefined> {
    const [stage] = await db.select().from(patientFlowStages).where(eq(patientFlowStages.id, id));
    return stage || undefined;
  }

  async createPatientFlowStage(stage: InsertPatientFlowStage): Promise<PatientFlowStage> {
    const [newStage] = await db.insert(patientFlowStages).values(stage).returning();
    return newStage;
  }

  async updatePatientFlowStage(id: number, updates: Partial<InsertPatientFlowStage>): Promise<PatientFlowStage | undefined> {
    const [updated] = await db.update(patientFlowStages)
      .set(updates)
      .where(eq(patientFlowStages.id, id))
      .returning();
    return updated || undefined;
  }

  async deletePatientFlowStage(id: number): Promise<boolean> {
    const result = await db.delete(patientFlowStages).where(eq(patientFlowStages.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Schedule methods
  async getSchedules(): Promise<Schedule[]> {
    return await db.select().from(schedules).orderBy(desc(schedules.shiftStart));
  }

  async getSchedule(id: number): Promise<Schedule | undefined> {
    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, id));
    return schedule || undefined;
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }

  async updateSchedule(id: number, updates: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const [updated] = await db.update(schedules)
      .set(updates)
      .where(eq(schedules.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSchedule(id: number): Promise<boolean> {
    const result = await db.delete(schedules).where(eq(schedules.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getSchedulesByUser(userId: number): Promise<Schedule[]> {
    return await db.select().from(schedules).where(eq(schedules.userId, userId));
  }

  async getActiveSchedules(): Promise<Schedule[]> {
    return await db.select().from(schedules).where(eq(schedules.isActive, true));
  }

  // User story methods
  async getUserStories(): Promise<UserStory[]> {
    return await db.select().from(userStories).orderBy(desc(userStories.createdAt));
  }

  async getUserStory(id: number): Promise<UserStory | undefined> {
    const [story] = await db.select().from(userStories).where(eq(userStories.id, id));
    return story || undefined;
  }

  async createUserStory(story: InsertUserStory): Promise<UserStory> {
    const [newStory] = await db.insert(userStories).values(story).returning();
    return newStory;
  }

  async updateUserStory(id: number, updates: Partial<InsertUserStory>): Promise<UserStory | undefined> {
    const [updated] = await db.update(userStories)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userStories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteUserStory(id: number): Promise<boolean> {
    const result = await db.delete(userStories).where(eq(userStories.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserStoriesByStatus(status: string): Promise<UserStory[]> {
    return await db.select().from(userStories).where(eq(userStories.status, status));
  }

  // Notification methods
  async getNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
      .orderBy(desc(notifications.createdAt));
  }

  // Analytics methods
  async getDashboardStats(): Promise<{
    activeWorkflows: number;
    pendingTasks: number;
    staffOnDuty: number;
    patientQueue: number;
  }> {
    const [activeWorkflowsCount] = await db.select({ count: count() })
      .from(workflows)
      .where(eq(workflows.status, 'active'));

    const [pendingTasksCount] = await db.select({ count: count() })
      .from(tasks)
      .where(eq(tasks.status, 'pending'));

    const [staffOnDutyCount] = await db.select({ count: count() })
      .from(users)
      .where(eq(users.isActive, true));

    const [patientQueueCount] = await db.select({ count: count() })
      .from(patientFlowStages);

    return {
      activeWorkflows: activeWorkflowsCount?.count || 0,
      pendingTasks: pendingTasksCount?.count || 0,
      staffOnDuty: staffOnDutyCount?.count || 0,
      patientQueue: patientQueueCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
