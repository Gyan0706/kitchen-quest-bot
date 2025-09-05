import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  intent?: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages: Message[];
}

export const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Mock AI responses based on food management intents
  const generateResponse = (userMessage: string): { content: string; intent: string } => {
    const message = userMessage.toLowerCase();
    
    // Recipe recommendations
    if (message.includes('recipe') || message.includes('cook') || message.includes('meal')) {
      return {
        content: "I'd be happy to help with recipe recommendations! Based on your dietary preferences and available inventory, I can suggest personalized meals. What type of cuisine are you in the mood for, or do you have specific ingredients you'd like to use?",
        intent: "recipe_planning"
      };
    }
    
    // Inventory management
    if (message.includes('inventory') || message.includes('ingredients') || message.includes('grocery')) {
      return {
        content: "Let me help you manage your inventory! I can track your ingredients, check expiration dates, and generate grocery lists. Would you like to add items to your inventory or check what's running low?",
        intent: "inventory_management"
      };
    }
    
    // Meal planning
    if (message.includes('plan') || message.includes('week') || message.includes('schedule')) {
      return {
        content: "Perfect! I can create personalized meal plans based on your dietary goals, preferences, and available ingredients. Would you like a weekly meal plan, or are you planning for a specific day?",
        intent: "meal_planning"
      };
    }
    
    // Nutrition advice
    if (message.includes('nutrition') || message.includes('healthy') || message.includes('calories')) {
      return {
        content: "I can provide detailed nutritional analysis for any meal or recipe! I'll help you track calories, macronutrients, and ensure your meals align with your health goals. What would you like to know about?",
        intent: "nutritional_analysis"
      };
    }
    
    // Default response
    return {
      content: "Hello! I'm your food management assistant. I can help you with recipe recommendations, meal planning, inventory management, and nutritional advice. What would you like to explore today?",
      intent: "general_assistance"
    };
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const createNewConversation = (): Conversation => {
    const id = `conv_${Date.now()}`;
    return {
      id,
      title: "New Conversation",
      lastMessage: "",
      timestamp: new Date(),
      messageCount: 0,
      messages: []
    };
  };

  const handleNewConversation = () => {
    const newConv = createNewConversation();
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) {
      handleNewConversation();
      return;
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message immediately
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            lastMessage: content,
            messageCount: conv.messageCount + 1,
            title: conv.messageCount === 0 ? content.slice(0, 30) + '...' : conv.title
          }
        : conv
    ));

    setIsLoading(true);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const { content: responseContent, intent } = generateResponse(content);
      
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        intent
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, assistantMessage],
              lastMessage: responseContent,
              messageCount: conv.messageCount + 1,
              timestamp: new Date()
            }
          : conv
      ));

      toast({
        title: "Response received",
        description: `Intent: ${intent}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with first conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      handleNewConversation();
    }
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card shadow-[var(--shadow-chat)]">
          <h1 className="text-xl font-semibold text-foreground">
            {activeConversation?.title || "Food Management Assistant"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Recipe Planning • Inventory Management • Nutrition Analysis
          </p>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {activeConversation?.messages.length === 0 ? (
              <div className="text-center p-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-medium mb-2">Welcome to your Food Assistant!</h3>
                <p className="text-muted-foreground mb-6">
                  I can help you with recipes, meal planning, inventory management, and nutritional advice.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["What should I cook today?", "Help me plan my meals", "Check my inventory"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeConversation?.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground p-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="ml-2">FoodBot is thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="max-w-4xl mx-auto">
            <ChatInput 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};