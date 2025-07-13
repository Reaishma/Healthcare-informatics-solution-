import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";

interface NotificationData {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}

export default function NotificationToast() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        let notification: NotificationData | null = null;
        
        switch (data.type) {
          case 'task_completed':
            notification = {
              id: Date.now().toString(),
              type: 'success',
              title: 'Task Completed',
              message: `${data.data.title} has been completed`,
              timestamp: new Date(),
            };
            break;
          case 'workflow_updated':
            notification = {
              id: Date.now().toString(),
              type: 'info',
              title: 'Workflow Updated',
              message: `${data.data.name} workflow has been updated`,
              timestamp: new Date(),
            };
            break;
          case 'user_story_moved':
            notification = {
              id: Date.now().toString(),
              type: 'info',
              title: 'Story Moved',
              message: `${data.data.title} moved to ${data.data.status}`,
              timestamp: new Date(),
            };
            break;
        }
        
        if (notification) {
          setNotifications(prev => [notification!, ...prev.slice(0, 4)]);
          
          // Auto-remove after 5 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification!.id));
          }, 5000);
        }
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    }
  }, [lastMessage]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed top-20 right-6 space-y-3 z-50">
      {notifications.map((notification) => (
        <Card key={notification.id} className="max-w-sm shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 ${getIconBg(notification.type)} rounded-full flex items-center justify-center`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={() => removeNotification(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

