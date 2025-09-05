import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled || isLoading) return;

    const messageToSend = message.trim();
    setMessage("");
    await onSendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about recipes, meal planning, or inventory..."
          disabled={disabled || isLoading}
          className="bg-chat-input-bg border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>
      <Button 
        type="submit" 
        disabled={!message.trim() || disabled || isLoading}
        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-message)] transition-all duration-200 hover:shadow-lg hover:scale-105"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};