import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { PatientFlowStage } from "@shared/schema";

export default function PatientFlowMonitor() {
  const { data: stages = [], isLoading } = useQuery<PatientFlowStage[]>({
    queryKey: ['/api/patient-flow-stages'],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Patient Flow Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-blue-500';
      case 'bottleneck': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getUtilization = (stage: PatientFlowStage) => {
    return Math.round((stage.currentCount / stage.capacity) * 100);
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Patient Flow Monitor</CardTitle>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stages.map((stage) => (
              <div key={stage.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">{stage.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {stage.currentCount} patients
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(stage.status)}`}
                    style={{ width: `${getUtilization(stage)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg. wait: {stage.averageWaitTime} min
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-3">Current Workflow Status</h4>
            <div className="flex items-center justify-between">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
