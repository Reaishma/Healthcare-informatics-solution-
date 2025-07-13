import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, Clock, User } from "lucide-react";
import { Schedule, InsertSchedule, User as UserType } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function StaffScheduling() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState<Partial<InsertSchedule>>({
    userId: undefined,
    shiftStart: "",
    shiftEnd: "",
    isActive: true,
  });

  const { data: schedules = [], isLoading } = useQuery<Schedule[]>({
    queryKey: ['/api/schedules'],
    refetchInterval: 30000,
  });

  const { data: users = [] } = useQuery<UserType[]>({
    queryKey: ['/api/users'],
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (schedule: InsertSchedule) => {
      const response = await apiRequest('POST', '/api/schedules', schedule);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      setIsCreateDialogOpen(false);
      setFormData({ userId: undefined, shiftStart: "", shiftEnd: "", isActive: true });
      toast({
        title: "Success",
        description: "Schedule created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive",
      });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/schedules/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.userId && formData.shiftStart && formData.shiftEnd) {
      createScheduleMutation.mutate(formData as InsertSchedule);
    }
  };

  const getUserById = (id: number) => {
    return users.find(user => user.id === id);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'nurse': return 'bg-blue-100 text-blue-800';
      case 'technician': return 'bg-cyan-100 text-cyan-800';
      case 'administrator': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.shiftStart).toISOString().split('T')[0];
    return scheduleDate === selectedDate;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Staff Scheduling</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Staff Scheduling</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Schedule</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="userId">Staff Member</Label>
                <Select value={formData.userId?.toString()} onValueChange={(value) => setFormData({ ...formData, userId: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.username} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="shiftStart">Shift Start</Label>
                <Input
                  id="shiftStart"
                  type="datetime-local"
                  value={formData.shiftStart}
                  onChange={(e) => setFormData({ ...formData, shiftStart: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shiftEnd">Shift End</Label>
                <Input
                  id="shiftEnd"
                  type="datetime-local"
                  value={formData.shiftEnd}
                  onChange={(e) => setFormData({ ...formData, shiftEnd: e.target.value })}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={createScheduleMutation.isPending}>
                  {createScheduleMutation.isPending ? "Creating..." : "Create Schedule"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Date Filter */}
      <div className="flex items-center space-x-4">
        <Label htmlFor="date">Select Date:</Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto"
        />
      </div>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Total Staff</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSchedules.length}</div>
            <p className="text-sm text-muted-foreground">scheduled for {formatDate(selectedDate)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Active Shifts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredSchedules.filter(s => s.isActive).length}
            </div>
            <p className="text-sm text-muted-foreground">currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Coverage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/7</div>
            <p className="text-sm text-muted-foreground">round-the-clock coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {filteredSchedules.map((schedule) => {
          const user = getUserById(schedule.userId);
          
          return (
            <Card key={schedule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                      {user?.role.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {user?.username || 'Unknown User'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleColor(user?.role || 'unknown')}>
                          {user?.role || 'Unknown Role'}
                        </Badge>
                        <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                          {schedule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(schedule.shiftStart)} - {formatTime(schedule.shiftEnd)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(schedule.shiftStart)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteScheduleMutation.mutate(schedule.id)}
                        disabled={deleteScheduleMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSchedules.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No schedules found</h3>
          <p className="text-muted-foreground mb-4">
            No schedules found for {formatDate(selectedDate)}. Create a schedule to get started.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </Button>
        </div>
      )}
    </div>
  );
}

