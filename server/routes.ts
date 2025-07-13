
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertTaskSchema, insertWorkflowSchema, insertUserStorySchema, insertPatientFlowStageSchema, insertScheduleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store WebSocket connections
  const connections = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    connections.add(ws);
    
    ws.on('close', () => {
      connections.delete(ws);
    });
  });

  // Helper function to broadcast to all connected clients
  const broadcast = (message: any) => {
    const data = JSON.stringify(message);
    connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  };

  // Dashboard stats
  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });

  // Workflows
  app.get('/api/workflows', async (req, res) => {
    try {
      const workflows = await storage.getWorkflows();
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch workflows' });
    }
  });

  app.post('/api/workflows', async (req, res) => {
    try {
      const validatedData = insertWorkflowSchema.parse(req.body);
      const workflow = await storage.createWorkflow(validatedData);
      broadcast({ type: 'workflow_created', data: workflow });
      res.json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid workflow data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create workflow' });
      }
    }
  });

  app.put('/api/workflows/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWorkflowSchema.partial().parse(req.body);
      const workflow = await storage.updateWorkflow(id, validatedData);
      if (!workflow) {
        return res.status(404).json({ message: 'Workflow not found' });
      }
      broadcast({ type: 'workflow_updated', data: workflow });
      res.json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid workflow data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update workflow' });
      }
    }
  });

  app.delete('/api/workflows/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWorkflow(id);
      if (!success) {
        return res.status(404).json({ message: 'Workflow not found' });
      }
      broadcast({ type: 'workflow_deleted', data: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete workflow' });
    }
  });

  // Tasks
  app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  });

  app.post('/api/tasks', async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      broadcast({ type: 'task_created', data: task });
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid task data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create task' });
      }
    }
  });

  app.put('/api/tasks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, validatedData);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      broadcast({ type: 'task_updated', data: task });
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid task data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update task' });
      }
    }
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      if (!success) {
        return res.status(404).json({ message: 'Task not found' });
      }
      broadcast({ type: 'task_deleted', data: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete task' });
    }
  });

  // Patient Flow Stages
  app.get('/api/patient-flow-stages', async (req, res) => {
    try {
      const stages = await storage.getPatientFlowStages();
      res.json(stages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch patient flow stages' });
    }
  });

  app.post('/api/patient-flow-stages', async (req, res) => {
    try {
      const validatedData = insertPatientFlowStageSchema.parse(req.body);
      const stage = await storage.createPatientFlowStage(validatedData);
      broadcast({ type: 'patient_flow_stage_created', data: stage });
      res.json(stage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid patient flow stage data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create patient flow stage' });
      }
    }
  });

  app.put('/api/patient-flow-stages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPatientFlowStageSchema.partial().parse(req.body);
      const stage = await storage.updatePatientFlowStage(id, validatedData);
      if (!stage) {
        return res.status(404).json({ message: 'Patient flow stage not found' });
      }
      broadcast({ type: 'patient_flow_stage_updated', data: stage });
      res.json(stage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid patient flow stage data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update patient flow stage' });
      }
    }
  });

  // User Stories (Kanban)
  app.get('/api/user-stories', async (req, res) => {
    try {
      const stories = await storage.getUserStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user stories' });
    }
  });

  app.post('/api/user-stories', async (req, res) => {
    try {
      const validatedData = insertUserStorySchema.parse(req.body);
      const story = await storage.createUserStory(validatedData);
      broadcast({ type: 'user_story_created', data: story });
      res.json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid user story data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create user story' });
      }
    }
  });

  app.put('/api/user-stories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertUserStorySchema.partial().parse(req.body);
      const story = await storage.updateUserStory(id, validatedData);
      if (!story) {
        return res.status(404).json({ message: 'User story not found' });
      }
      broadcast({ type: 'user_story_updated', data: story });
      res.json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid user story data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update user story' });
      }
    }
  });

  app.delete('/api/user-stories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteUserStory(id);
      if (!success) {
        return res.status(404).json({ message: 'User story not found' });
      }
      broadcast({ type: 'user_story_deleted', data: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete user story' });
    }
  });

  // Schedules
  app.get('/api/schedules', async (req, res) => {
    try {
      const schedules = await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch schedules' });
    }
  });

  app.post('/api/schedules', async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(validatedData);
      broadcast({ type: 'schedule_created', data: schedule });
      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid schedule data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create schedule' });
      }
    }
  });

  // Users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getActiveUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.get('/api/users/role/:role', async (req, res) => {
    try {
      const role = req.params.role;
      const users = await storage.getUsersByRole(role);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users by role' });
    }
  });

  // Notifications
  app.get('/api/notifications/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });

  app.get('/api/notifications/:userId/unread', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await storage.getUnreadNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch unread notifications' });
    }
  });

  app.put('/api/notifications/:id/read', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(id);
      if (!success) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  });

  return httpServer;
}
