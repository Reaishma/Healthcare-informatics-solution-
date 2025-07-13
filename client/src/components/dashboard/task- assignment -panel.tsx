
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Task, User } from "@shared/schema";

export default function TaskAssignmentPanel() {
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
    refetchInterval: 30000,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'overdue': return 'Overdue';
      default: return 'Pending';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'nurse': return 'bg-blue-500';
      case 'technician': return 'bg-cyan-500';
      case 'administrator': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getUserById = (id: number) => {
    return users.find(user => user.id === id);
  };

  const recentTasks = tasks.slice(0, 4);

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Task Assignment</CardTitle>
          <Button size="sm" variant="ghost">
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {recentTasks.map((task) => {
            const assignedUser = task.assignedToId ? getUserById(task.assignedToId) : null;
            
            return (
              <div key={task.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className={`w-8 h-8 ${assignedUser ? getRoleColor(assignedUser.role) : 'bg-gray-500'} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                  {assignedUser ? assignedUser.role.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {assignedUser ? `Assigned to ${assignedUser.role}` : 'Unassigned'}
                    {task.location && ` - ${task.location}`}
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs font-medium ${
                    task.status === 'completed' ? 'text-green-700' :
                    task.status === 'in_progress' ? 'text-yellow-700' :
                    task.status === 'overdue' ? 'text-red-700' :
                    'text-gray-700'
                  }`}
                >
                  {getStatusText(task.status)}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
