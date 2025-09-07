import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string | number;
  messageCount: number;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export const ChatSidebar = ({ 
  conversations, 
  activeConversationId, 
  onSelectConversation, 
  onNewConversation 
}: ChatSidebarProps) => {
  return (
    <div className="w-80 bg-chat-sidebar-bg border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Food Assistant
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNewConversation}
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Ask about recipes, meal planning, inventory management, and nutritional advice.
        </p>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Start your first conversation!</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start p-3 h-auto flex-col items-start gap-2 transition-all duration-200",
                  activeConversationId === conversation.id 
                    ? "bg-primary/10 border border-primary/20 shadow-sm" 
                    : "hover:bg-muted/50"
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="font-medium text-sm truncate max-w-[200px]">
                    {conversation.title}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {conversation.messageCount}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground text-left truncate w-full">
                  {conversation.lastMessage}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(conversation.timestamp).toLocaleDateString()}
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Ready to help
          </div>
        </div>
      </div>
    </div>
  );
};