import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { PatientFlowStage, InsertPatientFlowStage } from "@shared/schema";
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
import { Progress } from "@/components/ui/progress";

export default function PatientFlow() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertPatientFlowStage>>({
    name: "",
    description: "",
    capacity: 10,
    currentCount: 0,
    averageWaitTime: 0,
    status: "normal",
    order: 1,
  });

  const { data: stages = [], isLoading } = useQuery<PatientFlowStage[]>({
    queryKey: ['/api/patient-flow-stages'],
    refetchInterval: 10000, // More frequent updates for patient flow
  });

  const createStageMutation = useMutation({
    mutationFn: async (stage: InsertPatientFlowStage) => {
      const response = await apiRequest('POST', '/api/patient-flow-stages', stage);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patient-flow-stages'] });
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "", capacity: 10, currentCount: 0, averageWaitTime: 0, status: "normal", order: 1 });
      toast({
        title: "Success",
        description: "Patient flow stage created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create patient flow stage",
        variant: "destructive",
      });
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertPatientFlowStage> }) => {
      const response = await apiRequest('PUT', `/api/patient-flow-stages/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patient-flow-stages'] });
      toast({
        title: "Success",
        description: "Patient flow stage updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update patient flow stage",
        variant: "destructive",
      });
    },
  });

  const deleteStageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/patient-flow-stages/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patient-flow-stages'] });
      toast({
        title: "Success",
        description: "Patient flow stage deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete patient flow stage",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.capacity !== undefined) {
      createStageMutation.mutate(formData as InsertPatientFlowStage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'bottleneck': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'bottleneck': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUtilization = (stage: PatientFlowStage) => {
    return Math.round((stage.currentCount / stage.capacity) * 100);
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-blue-600';
      case 'bottleneck': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const adjustPatientCount = (stageId: number, delta: number) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage) {
      const newCount = Math.max(0, Math.min(stage.capacity, stage.currentCount + delta));
      updateStageMutation.mutate({
        id: stageId,
        updates: { currentCount: newCount }
      });
    }
  };

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Patient Flow</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Stage
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Patient Flow Monitor</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Patient Flow Stage</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Stage Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter stage name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter stage description"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bottleneck">Bottleneck</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={createStageMutation.isPending}>
                  {createStageMutation.isPending ? "Creating..." : "Create Stage"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Stages</p>
                <p className="text-2xl font-bold">{stages.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{stages.reduce((sum, stage) => sum + stage.currentCount, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bottlenecks</p>
                <p className="text-2xl font-bold">{stages.filter(s => s.status === 'bottleneck').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">{stages.filter(s => s.status === 'critical').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Current Workflow Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Normal Flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Bottleneck Detected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Critical Delay</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Flow Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStages.map((stage) => (
          <Card key={stage.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(stage.status)}
                  <CardTitle className="text-lg">{stage.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(stage.status)}>
                  {stage.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Patients</span>
                  <span className="font-medium">{stage.currentCount} / {stage.capacity}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Utilization</span>
                    <span className="text-sm font-medium">{getUtilization(stage)}%</span>
                  </div>
                  <Progress 
                    value={getUtilization(stage)} 
                    className="h-2"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Wait Time</span>
                  <span className="font-medium">{stage.averageWaitTime} min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Adjust Count</span>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => adjustPatientCount(stage.id, -1)}
                      disabled={stage.currentCount === 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{stage.currentCount}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => adjustPatientCount(stage.id, 1)}
                      disabled={stage.currentCount === stage.capacity}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteStageMutation.mutate(stage.id)}
                    disabled={deleteStageMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedStages.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No patient flow stages created yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first patient flow stage to start monitoring patient movement.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Stage
          </Button>
        </div>
      )}
    </div>
  );
}

