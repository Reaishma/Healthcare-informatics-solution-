import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Network, 
  CheckSquare, 
  Calendar, 
  Users, 
  BarChart3, 
  Columns, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/workflow-design", icon: Network, label: "Workflow Design" },
  { href: "/task-management", icon: CheckSquare, label: "Task Management" },
  { href: "/staff-scheduling", icon: Calendar, label: "Staff Scheduling" },
  { href: "/patient-flow", icon: Users, label: "Patient Flow" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/kanban-board", icon: Columns, label: "Kanban Board" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-surface shadow-sm border-r border-border">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

