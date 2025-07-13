import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Activity, 
  Target,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Task, Workflow, PatientFlowStage, UserStory } from "@shared/schema";

export default function Analytics() {
  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
    refetchInterval: 30000,
  });

  const { data: workflows = [], isLoading: workflowsLoading } = useQuery<Workflow[]>({
    queryKey: ['/api/workflows'],
    refetchInterval: 30000,
  });

  const { data: stages = [], isLoading: stagesLoading } = useQuery<PatientFlowStage[]>({
    queryKey: ['/api/patient-flow-stages'],
    refetchInterval: 30000,
  });

  const { data: userStories = [], isLoading: storiesLoading } = useQuery<UserStory[]>({
    queryKey: ['/api/user-stories'],
    refetchInterval: 30000,
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000,
  });

  if (tasksLoading || workflowsLoading || stagesLoading || storiesLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate metrics
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
  const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const activeWorkflows = workflows.filter(w => w.status === 'active').length;
  const completedWorkflows = workflows.filter(w => w.status === 'completed').length;
  const workflowCompletionRate = workflows.length > 0 ? (completedWorkflows / workflows.length) * 100 : 0;

  const totalPatients = stages.reduce((sum, stage) => sum + stage.currentCount, 0);
  const totalCapacity = stages.reduce((sum, stage) => sum + stage.capacity, 0);
  const utilizationRate = totalCapacity > 0 ? (totalPatients / totalCapacity) * 100 : 0;

  const bottlenecks = stages.filter(s => s.status === 'bottleneck').length;
  const criticalStages = stages.filter(s => s.status === 'critical').length;

  const completedStories = userStories.filter(s => s.status === 'done').length;
  const inProgressStories = userStories.filter(s => s.status === 'in_progress').length;
  const sprintCompletion = userStories.length > 0 ? (completedStories / userStories.length) * 100 : 0;

  const totalStoryPoints = userStories.reduce((sum, story) => sum + story.storyPoints, 0);
  const completedStoryPoints = userStories
    .filter(s => s.status === 'done')
    .reduce((sum, story) => sum + story.storyPoints, 0);

  const averageWaitTime = stages.length > 0 
    ? stages.reduce((sum, stage) => sum + stage.averageWaitTime, 0) / stages.length 
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics & Performance</h1>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Task Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round(taskCompletionRate)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+15%</span>
              <span className="text-muted-foreground ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Workflow Efficiency</p>
                <p className="text-2xl font-bold">{Math.round(workflowCompletionRate)}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resource Utilization</p>
                <p className="text-2xl font-bold">{Math.round(utilizationRate)}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">-3%</span>
              <span className="text-muted-foreground ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sprint Progress</p>
                <p className="text-2xl font-bold">{Math.round(sprintCompletion)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Task Management Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed Tasks</span>
              <span className="font-medium">{completedTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Tasks</span>
              <span className="font-medium">{pendingTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overdue Tasks</span>
              <span className="font-medium text-red-600">{overdueTasks}</span>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="text-sm font-medium">{Math.round(taskCompletionRate)}%</span>
              </div>
              <Progress value={taskCompletionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Workflow Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Workflows</span>
              <span className="font-medium">{activeWorkflows}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed Workflows</span>
              <span className="font-medium">{completedWorkflows}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Process Time</span>
              <span className="font-medium">23 min</span>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Efficiency Rate</span>
                <span className="text-sm font-medium">{Math.round(workflowCompletionRate)}%</span>
              </div>
              <Progress value={workflowCompletionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Patient Flow Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Flow Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Patients</span>
              <span className="font-medium">{totalPatients}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Capacity</span>
              <span className="font-medium">{totalCapacity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bottlenecks</span>
              <span className="font-medium text-yellow-600">{bottlenecks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Critical Stages</span>
              <span className="font-medium text-red-600">{criticalStages}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Wait Time</span>
              <span className="font-medium">{Math.round(averageWaitTime)} min</span>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Stories</span>
              <span className="font-medium">{userStories.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed Stories</span>
              <span className="font-medium">{completedStories}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <span className="font-medium">{inProgressStories}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Story Points</span>
              <span className="font-medium">{completedStoryPoints} / {totalStoryPoints}</span>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Sprint Completion</span>
                <span className="text-sm font-medium">{Math.round(sprintCompletion)}%</span>
              </div>
              <Progress value={sprintCompletion} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Task completion rate improved by 15% this sprint
                </span>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  Workflow efficiency increased by 8% this month
                </span>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-700 font-medium">
                  {bottlenecks} bottlenecks detected requiring attention
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

