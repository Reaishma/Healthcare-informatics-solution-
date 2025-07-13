
import { UserStory, User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Check } from "lucide-react";

interface KanbanCardProps {
  story: UserStory;
  users: User[];
}

export default function KanbanCard({ story, users }: KanbanCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('storyId', story.id.toString());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'text-gray-600';
      case 'in_progress': return 'text-yellow-600';
      case 'review': return 'text-blue-600';
      case 'done': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusCode = (status: string) => {
    switch (status) {
      case 'backlog': return 'USER';
      case 'in_progress': return 'USER';
      case 'review': return 'USER';
      case 'done': return 'USER';
      default: return 'USER';
    }
  };

  const assignedUser = story.assignedToId ? users.find(u => u.id === story.assignedToId) : null;

  return (
    <Card 
      className="cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={handleDragStart}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant="secondary" 
            className={`text-xs font-medium ${getStatusColor(story.status)}`}
          >
            {getStatusCode(story.status)}-{story.id}
          </Badge>
          {story.status === 'done' ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        
        <p className="text-sm font-medium text-foreground mb-1">{story.title}</p>
        <p className="text-xs text-muted-foreground mb-2">
          Story Points: {story.storyPoints}
        </p>
        
        {assignedUser && (
          <div className="flex items-center mt-2">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
              {assignedUser.role.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              Assigned to {assignedUser.role}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
