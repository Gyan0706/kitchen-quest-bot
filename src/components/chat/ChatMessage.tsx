import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    intent?: string;
  };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg mb-4 transition-all duration-200",
      isUser 
        ? "bg-chat-user-bg text-chat-user-text ml-12 shadow-[var(--shadow-message)]" 
        : "bg-chat-bot-bg text-chat-bot-text mr-12 shadow-[var(--shadow-message)]"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {isUser ? 'You' : 'FoodBot'}
          </span>
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {message.intent && !isUser && (
            <Badge variant="secondary" className="text-xs">
              {message.intent}
            </Badge>
          )}
        </div>
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 bg-accent">
          <AvatarFallback className="bg-accent text-accent-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};