import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserStory, User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import KanbanColumn from "./kanban-column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLUMN_STATUSES = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-50' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50' },
  { id: 'review', title: 'Review', color: 'bg-blue-50' },
  { id: 'done', title: 'Done', color: 'bg-green-50' },
];

export default function KanbanBoard() {
  const queryClient = useQueryClient();
  
  const { data: stories = [], isLoading } = useQuery<UserStory[]>({
    queryKey: ['/api/user-stories'],
    refetchInterval: 30000,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const updateStoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<UserStory> }) => {
      const response = await apiRequest('PUT', `/api/user-stories/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-stories'] });
    },
  });

  const handleStoryMove = (storyId: number, newStatus: string) => {
    updateStoryMutation.mutate({ id: storyId, updates: { status: newStatus } });
  };

  const getStoriesByStatus = (status: string) => {
    return stories.filter(story => story.status === status);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Agile Workflow Board</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {COLUMN_STATUSES.map(status => (
            <div key={status.id} className="bg-muted rounded-lg p-4 h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Agile Workflow Board</h2>
        <div className="flex items-center space-x-2">
          <Select defaultValue="current">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Sprint</SelectItem>
              <SelectItem value="sprint2">Sprint 2</SelectItem>
              <SelectItem value="sprint1">Sprint 1</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Story
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUMN_STATUSES.map(column => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            status={column.id}
            color={column.color}
            stories={getStoriesByStatus(column.id)}
            users={users}
            onStoryMove={handleStoryMove}
          />
        ))}
      </div>
    </div>
  );
}

