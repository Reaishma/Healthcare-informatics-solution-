import { Bell, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Header() {
  const [currentUser] = useState({
    name: "Administrator",
    role: "System Admin",
    initials: "AN"
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications', 1, 'unread'],
    refetchInterval: 30000,
  });

  return (
    <header className="bg-surface shadow-sm border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Heart className="text-primary text-2xl" />
            <h1 className="text-xl font-semibold text-foreground">HealthFlow</h1>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Sprint 3</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Day 8 of 14</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {notifications.length}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
              {currentUser.initials}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-foreground">{currentUser.name}</div>
              <div className="text-xs text-muted-foreground">{currentUser.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

