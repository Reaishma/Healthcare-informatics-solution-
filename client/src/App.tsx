import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebSocketProvider } from "@/providers/websocket-provider";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import WorkflowDesign from "@/pages/workflow-design";
import TaskManagement from "@/pages/task-management";
import StaffScheduling from "@/pages/staff-scheduling";
import PatientFlow from "@/pages/patient-flow";
import Analytics from "@/pages/analytics";
import KanbanBoard from "@/pages/kanban-board";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-background">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/workflow-design" component={WorkflowDesign} />
            <Route path="/task-management" component={TaskManagement} />
            <Route path="/staff-scheduling" component={StaffScheduling} />
            <Route path="/patient-flow" component={PatientFlow} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/kanban-board" component={KanbanBoard} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  );
}

export default App;

