
import { useQuery } from "@tanstack/react-query";
import { Network, CheckSquare, Users, Clock } from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import PatientFlowMonitor from "@/components/dashboard/patient-flow-monitor";
import TaskAssignmentPanel from "@/components/dashboard/task-assignment-panel";
import KanbanBoard from "@/components/kanban/kanban-board";
import NotificationToast from "@/components/notifications/notification-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000,
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-muted rounded-lg animate-pulse" />
          <div className="h-96 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotificationToast />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Workflows"
          value={stats?.activeWorkflows || 0}
          icon={<Network className="h-6 w-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending Tasks"
          value={stats?.pendingTasks || 0}
          icon={<CheckSquare className="h-6 w-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
          trend={{ value: 8, isPositive: false }}
        />
        <StatsCard
          title="Staff on Duty"
          value={stats?.staffOnDuty || 0}
          icon={<Users className="h-6 w-6 text-green-600" />}
          iconBgColor="bg-green-100"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Patient Queue"
          value={stats?.patientQueue || 0}
          icon={<Clock className="h-6 w-6 text-cyan-600" />}
          iconBgColor="bg-cyan-100"
          trend={{ value: 0, isPositive: false, isNeutral: true }}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PatientFlowMonitor />
        <TaskAssignmentPanel />
      </div>

      {/* Kanban Board */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Agile Workflow Board</CardTitle>
            <div className="flex items-center space-x-2">
              <select className="text-sm border border-input rounded-lg px-3 py-1">
                <option>Current Sprint</option>
                <option>Sprint 2</option>
                <option>Sprint 1</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <KanbanBoard />
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sprint Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed Stories</span>
              <span className="text-sm font-medium">12 of 18</span>
            </div>
            <Progress value={67} className="h-2" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-foreground">67%</p>
                <p className="text-sm text-muted-foreground">Sprint Completion</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-foreground">6</p>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Process Time</span>
              <span className="text-sm font-medium">23 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bottleneck Resolution</span>
              <span className="text-sm font-medium">8.5 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Staff Utilization</span>
              <span className="text-sm font-medium">87%</span>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-700 font-medium">
                  Efficiency improved by 15% this sprint
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
