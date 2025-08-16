import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { chatApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Image as ImageIcon, 
  MessageSquare, 
  Loader2,
  PlusCircle,
  Menu,
  X
} from "lucide-react";
import { useLanguage } from "@/components/chat/LanguageSelector";
import type { Conversation, Message } from "@shared/schema";

export default function ChatPage() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    refetchInterval: 2000, // Refresh every 2 seconds
  });

  // Fetch messages for current conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", currentConversationId, "messages"],
    enabled: !!currentConversationId,
    refetchInterval: 2000, // Refresh every 2 seconds for messages
    staleTime: 0, // Always fetch fresh data
  });

  // Ensure messages is always an array
  const safeMessages = messages || [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages, currentConversationId]);

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await chatApi.createConversation(title);
      return res;
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Nova conversa criada",
        description: "Você pode começar a conversar agora!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar conversa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (params: { conversationId: string; content: string; generateImage?: boolean }) => {
      const res = await chatApi.sendMessage(params.conversationId, params.content, params.generateImage);
      return res;
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ["/api/conversations", variables.conversationId, "messages"] 
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<Message[]>([
        "/api/conversations", 
        variables.conversationId, 
        "messages"
      ]);

      // Optimistically update to the new value
      const optimisticUserMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: variables.conversationId,
        content: variables.content,
        role: "user",
        createdAt: new Date(),
        metadata: null,
        imageUrl: null,
        imagePrompt: null,
        imageStyle: null,
        reactions: null,
        encrypted: null,
        editedAt: null,
        parentId: null,
      };

      queryClient.setQueryData<Message[]>(
        ["/api/conversations", variables.conversationId, "messages"],
        (old = []) => [...old, optimisticUserMessage]
      );

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onSuccess: async (data, variables) => {
      // Update with the actual response from server
      queryClient.setQueryData<Message[]>(
        ["/api/conversations", variables.conversationId, "messages"],
        (old = []) => {
          // Remove temp message and add real messages
          const filtered = old.filter(msg => !msg.id.startsWith('temp-'));
          return [...filtered, data.userMessage, data.aiMessage];
        }
      );

      // Also invalidate conversations to update titles if needed
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (error: Error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["/api/conversations", variables.conversationId, "messages"],
          context.previousMessages
        );
      }

      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
    },
  });



  const handleSendMessage = (content: string, generateImage?: boolean) => {    
    if (!content.trim()) return;

    if (!currentConversationId) {
      // Create conversation with the message content as title and send the message
      const title = content.length > 50 ? content.substring(0, 50) + "..." : content;

      createConversationMutation.mutate(title, {
        onSuccess: async (conversation) => {
          // Set the current conversation ID immediately
          setCurrentConversationId(conversation.id);

          // Force refresh conversations list
          await queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });

          // Send the message after conversation is created
          sendMessageMutation.mutate({
            conversationId: conversation.id,
            content: content,
            generateImage: generateImage
          });
        }
      });
      return;
    }

    sendMessageMutation.mutate({
      conversationId: currentConversationId,
      content: content,
      generateImage: generateImage
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-muted/30 animate-fade-in">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80' : 'relative w-80'} 
        transition-transform duration-300 ease-in-out
        glass-sidebar
      `}>
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={() => {
            setCurrentConversationId(null);
          }}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="glass-card rounded-none border-x-0 border-t-0 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant={sidebarOpen ? "outline" : "default"}
                size="sm"
                onClick={toggleSidebar}
                className="hover-lift transition-all duration-200 relative group"
                title={sidebarOpen ? 'Ocultar Menu Lateral' : 'Mostrar Menu Lateral'}
              >
                <div className="flex items-center gap-2">
                  {sidebarOpen ? (
                    <>
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs font-medium">Ocultar</span>
                    </>
                  ) : (
                    <>
                      <Menu className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs font-medium">Menu</span>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-primary/10 rounded-md scale-0 group-hover:scale-100 transition-transform duration-200 -z-10"></div>
              </Button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary rounded-full border-2 border-background animate-pulse">
                    <Sparkles className="h-2 w-2 text-primary-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <h1 className="text-lg font-bold gradient-text">
                    {currentConversation?.title || "Catalyst IA Assistant"}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {currentConversation 
                      ? `${safeMessages.length} ${t('messages')}` 
                      : t('intelligentAIAssistant')
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentConversationId(null);
                }}
                className="hover-lift hidden sm:flex"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {t('newConversation')}
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Messages Area */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6 space-y-6">
            {!currentConversationId ? (
              // Welcome Screen
              <div className="max-w-2xl mx-auto text-center space-y-8 mt-20 animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <Avatar className="h-20 w-20 mx-auto border-4 border-primary/20 relative">
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                      <Bot className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold gradient-text">
                    {t('welcomeToCatalystIA')}
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    {t('welcomeDescription')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
                  <div className="card-modern space-y-3 animate-fade-in">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">{t('smartConversations')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('smartConversationsDesc')}
                    </p>
                  </div>

                  <div className="card-modern space-y-3 animate-fade-in">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">{t('imageGeneration')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('imageGenerationDesc')}
                    </p>
                  </div>

                  <div className="card-modern space-y-3 sm:col-span-2 lg:col-span-1 animate-fade-in">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">{t('advancedAI')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('advancedAIDesc')}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mt-8 animate-fade-in">
                  {t('typeFirstMessage')}
                </div>
              </div>
            ) : messagesLoading ? (
              // Loading Messages
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="skeleton h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-24" />
                      <div className="skeleton h-16 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Messages List
              <div className="space-y-6 max-w-4xl mx-auto">
                {safeMessages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ChatMessage message={message} />
                  </div>
                ))}

                {/* Loading message */}
                {sendMessageMutation.isPending && (
                  <div className="flex gap-4 animate-fade-in">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-primary text-white text-sm">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-md px-4 py-3 border animate-pulse">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">{t('processingMessage')}</span>
                        <span className="loading-dots text-sm"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending || createConversationMutation.isPending}
        />
      </div>
    </div>
  );
}