import { UserStory, User } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import KanbanCard from "./kanban-card";

interface KanbanColumnProps {
  title: string;
  status: string;
  color: string;
  stories: UserStory[];
  users: User[];
  onStoryMove: (storyId: number, newStatus: string) => void;
}

export default function KanbanColumn({ 
  title, 
  status, 
  color, 
  stories, 
  users, 
  onStoryMove 
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const storyId = parseInt(e.dataTransfer.getData('storyId'));
    if (storyId) {
      onStoryMove(storyId, status);
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'bg-gray-200';
      case 'in_progress': return 'bg-yellow-200';
      case 'review': return 'bg-blue-200';
      case 'done': return 'bg-green-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div 
      className={`${color} rounded-lg p-4 min-h-96`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground">{title}</h3>
        <Badge className={`${getBadgeColor(status)} text-muted-foreground`}>
          {stories.length}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {stories.map(story => (
          <KanbanCard
            key={story.id}
            story={story}
            users={users}
          />
        ))}
      </div>
    </div>
  );
}

