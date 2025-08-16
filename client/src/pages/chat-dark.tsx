
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { chatApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
  X,
  Zap,
  Star,
  Circle,
  Triangle
} from "lucide-react";
import { useLanguage } from "@/components/chat/LanguageSelector";
import type { Conversation, Message } from "@shared/schema";

export default function ChatPage() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ease-out ${
      isPageLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      
      {/* FUNDO ULTRA-PREMIUM DARK NIGHT */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        
        {/* Grid Matrix Effect */}
        <div className="absolute inset-0 cyber-grid opacity-10" />
        
        {/* Animated Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          
          {/* Floating Squares - Ultra Enhanced */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-primary/8 rounded-lg animate-float rotate-45" style={{animationDelay: '0s'}} />
          <div className="absolute top-32 right-32 w-3 h-3 bg-accent/10 rounded-lg animate-drift" style={{animationDelay: '1s'}} />
          <div className="absolute top-48 left-16 w-5 h-5 bg-primary/6 rounded-lg animate-float rotate-12" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-32 right-20 w-4 h-4 bg-accent/8 rounded-lg animate-drift rotate-45" style={{animationDelay: '0.5s'}} />
          <div className="absolute bottom-16 left-24 w-2 h-2 bg-primary/12 rounded-lg animate-float" style={{animationDelay: '1.5s'}} />
          <div className="absolute top-64 right-12 w-3 h-3 bg-accent/7 rounded-lg animate-drift -rotate-12" style={{animationDelay: '3s'}} />
          <div className="absolute top-80 left-40 w-2 h-2 bg-primary/9 rounded-lg animate-float rotate-90" style={{animationDelay: '2.5s'}} />
          <div className="absolute bottom-48 left-60 w-4 h-4 bg-accent/6 rounded-lg animate-drift" style={{animationDelay: '4s'}} />
          <div className="absolute top-96 right-48 w-2 h-2 bg-primary/11 rounded-lg animate-float -rotate-45" style={{animationDelay: '3.5s'}} />
          <div className="absolute bottom-64 right-16 w-3 h-3 bg-accent/9 rounded-lg animate-drift rotate-180" style={{animationDelay: '1.2s'}} />
          
          {/* Additional Premium Shapes */}
          <div className="absolute top-40 left-80 w-6 h-1 bg-primary/5 rounded-full animate-float rotate-45" style={{animationDelay: '2.8s'}} />
          <div className="absolute bottom-40 right-80 w-1 h-6 bg-accent/7 rounded-full animate-drift -rotate-45" style={{animationDelay: '1.8s'}} />
          <div className="absolute top-72 left-32 w-8 h-1 bg-primary/4 rounded-full animate-float rotate-12" style={{animationDelay: '0.8s'}} />
          
          {/* Geometric Icons Floating */}
          <div className="absolute top-1/4 left-1/4 opacity-5 animate-float">
            <Triangle className="w-8 h-8 text-primary rotate-45" />
          </div>
          <div className="absolute top-3/4 right-1/4 opacity-7 animate-drift">
            <Circle className="w-6 h-6 text-accent" />
          </div>
          <div className="absolute top-1/2 left-3/4 opacity-6 animate-float">
            <Star className="w-7 h-7 text-primary rotate-12" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 opacity-4 animate-drift">
            <Zap className="w-5 h-5 text-accent -rotate-45" />
          </div>
        </div>
        
        {/* Holographic Gradients */}
        <div className="absolute inset-0 holographic opacity-20" />
        
        {/* Matrix Rain Effect */}
        <div className="absolute inset-0 matrix-rain opacity-5" />
        
        {/* Radial Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0s'}} />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-accent/4 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-primary/2 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        
        {/* Large Geometric Forms */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/3 rounded-3xl rotate-45 animate-float blur-lg" style={{animationDelay: '1s'}} />
        <div className="absolute top-3/4 right-1/4 w-28 h-28 bg-accent/4 rounded-full animate-drift blur-lg" style={{animationDelay: '3s'}} />
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-primary/2 rounded-2xl -rotate-12 animate-float blur-lg" style={{animationDelay: '2s'}} />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50 animate-slide-down">
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Mobile backdrop */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40 animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80' : 'relative w-80'} 
          transition-all duration-500 ease-out
        `}>
          <div className="animate-slide-right">
            <ChatSidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={handleSelectConversation}
              onNewChat={() => {
                setCurrentConversationId(null);
              }}
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header Ultra-Premium */}
          <div className="border-b border-gray-800/50 glass-card px-4 sm:px-6 py-4 animate-slide-down">
            <div className="flex items-center justify-between">
              
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <Button
                  variant={sidebarOpen ? "outline" : "default"}
                  size="sm"
                  onClick={toggleSidebar}
                  className="glass-button group relative overflow-hidden hover-lift"
                  title={sidebarOpen ? 'Ocultar Menu Lateral' : 'Mostrar Menu Lateral'}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <div className="relative z-10 flex items-center gap-2">
                    {sidebarOpen ? (
                      <>
                        <X className="h-4 w-4 animate-rotate-in" />
                        <span className="hidden sm:inline text-xs font-medium">Ocultar</span>
                      </>
                    ) : (
                      <>
                        <Menu className="h-4 w-4 animate-scale-in" />
                        <span className="hidden sm:inline text-xs font-medium">Menu</span>
                      </>
                    )}
                  </div>
                </Button>

                <div className="flex items-center gap-4 animate-scale-in">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-primary/30 glow-ring animate-float">
                      <AvatarFallback className="glass-card text-primary font-bold text-lg">
                        <Bot className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* AI Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary rounded-full border-2 border-background animate-pulse flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-primary-foreground animate-spin-slow" />
                    </div>
                    
                    {/* Energy Rings */}
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                    <div className="absolute -inset-2 rounded-full border border-primary/10 animate-ping" style={{animationDelay: '0.5s'}} />
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-xl font-bold gradient-text animate-fade-in">
                      {currentConversation?.title || "Catalyst IA Assistant"}
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 animate-slide-up">
                      <Zap className="h-3 w-3 text-primary animate-pulse" />
                      {currentConversation 
                        ? `${safeMessages.length} ${t('messages')}` 
                        : t('intelligentAIAssistant')
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3 animate-slide-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentConversationId(null);
                  }}
                  className="glass-button group hover-lift hidden sm:flex"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <PlusCircle className="h-4 w-4 mr-2 animate-float" />
                  {t('newConversation')}
                </Button>
              </div>
            </div>
          </div>

          <Separator className="border-gray-800/30" />

          {/* Messages Area */}
          <ScrollArea className="flex-1 custom-scrollbar">
            <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6 space-y-8">
              {!currentConversationId ? (
                // Welcome Screen Ultra-Premium
                <div className="max-w-3xl mx-auto text-center space-y-12 mt-20">
                  
                  {/* Hero Section */}
                  <div className="relative animate-scale-bounce">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-60 animate-pulse" />
                    <div className="relative">
                      <Avatar className="h-28 w-28 mx-auto border-4 border-primary/30 glow-ring energy-border animate-float">
                        <AvatarFallback className="glass-card text-primary text-3xl font-bold">
                          <Bot className="h-14 w-14" />
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Floating Icons */}
                      <div className="absolute -top-4 -right-4 animate-bounce-gentle">
                        <Sparkles className="h-8 w-8 text-primary animate-spin-slow" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 animate-float">
                        <Zap className="h-6 w-6 text-accent animate-pulse" />
                      </div>
                      
                      {/* Energy Rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                      <div className="absolute -inset-4 rounded-full border border-primary/10 animate-ping" style={{animationDelay: '1s'}} />
                      <div className="absolute -inset-8 rounded-full border border-accent/10 animate-ping" style={{animationDelay: '2s'}} />
                    </div>
                  </div>

                  {/* Welcome Text */}
                  <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                    <h2 className="text-4xl font-bold gradient-text hover-neon transition-all duration-300">
                      {t('welcomeToCatalystIA')}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      {t('welcomeDescription')}
                    </p>
                  </div>

                  {/* Features Grid Premium */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                    
                    {/* Smart Conversations */}
                    <div className="card-cyber group cursor-pointer animate-scale-in hover-magnetic" style={{animationDelay: '0.5s'}}>
                      <div className="relative z-10">
                        <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all duration-300 energy-border">
                          <MessageSquare className="h-6 w-6 text-primary animate-float" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground group-hover:gradient-text transition-all duration-300">
                          {t('smartConversations')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {t('smartConversationsDesc')}
                        </p>
                      </div>
                      
                      {/* Hover Effects */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                    </div>

                    {/* Image Generation */}
                    <div className="card-cyber group cursor-pointer animate-scale-in hover-magnetic" style={{animationDelay: '0.7s'}}>
                      <div className="relative z-10">
                        <div className="h-12 w-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-all duration-300 energy-border">
                          <ImageIcon className="h-6 w-6 text-accent animate-float" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground group-hover:gradient-text transition-all duration-300">
                          {t('imageGeneration')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {t('imageGenerationDesc')}
                        </p>
                      </div>
                      
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Zap className="h-4 w-4 text-accent animate-pulse" />
                      </div>
                    </div>

                    {/* Advanced AI */}
                    <div className="card-cyber group cursor-pointer animate-scale-in hover-magnetic sm:col-span-2 lg:col-span-1" style={{animationDelay: '0.9s'}}>
                      <div className="relative z-10">
                        <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all duration-300 energy-border">
                          <Sparkles className="h-6 w-6 text-primary animate-spin-slow" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground group-hover:gradient-text transition-all duration-300">
                          {t('advancedAI')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {t('advancedAIDesc')}
                        </p>
                      </div>
                      
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Star className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="text-sm text-muted-foreground mt-12 animate-fade-in flex items-center justify-center gap-2" style={{animationDelay: '1.1s'}}>
                    <Circle className="h-2 w-2 text-primary animate-pulse" />
                    {t('typeFirstMessage')}
                    <Circle className="h-2 w-2 text-primary animate-pulse" />
                  </div>
                </div>
              ) : messagesLoading ? (
                // Loading Messages Premium
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-scale-in" style={{ animationDelay: `${i * 150}ms` }}>
                      <div className="skeleton h-10 w-10 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="skeleton h-4 w-32 rounded" />
                        <div className="skeleton h-20 w-full rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Messages List Premium
                <div className="space-y-8 max-w-5xl mx-auto">
                  {safeMessages.map((message, index) => (
                    <div 
                      key={message.id} 
                      className="animate-scale-in hover-lift"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ChatMessage message={message} />
                    </div>
                  ))}

                  {/* Loading message Premium */}
                  {sendMessageMutation.isPending && (
                    <div className="flex gap-4 animate-scale-bounce">
                      <Avatar className="h-10 w-10 border-2 border-primary/30 animate-float">
                        <AvatarFallback className="glass-card text-primary">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="message-loading glass-card group">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <span className="text-sm font-medium">{t('processingMessage')}</span>
                          <div className="flex gap-1">
                            <Circle className="h-2 w-2 text-primary animate-pulse" />
                            <Circle className="h-2 w-2 text-primary animate-pulse" style={{animationDelay: '0.2s'}} />
                            <Circle className="h-2 w-2 text-primary animate-pulse" style={{animationDelay: '0.4s'}} />
                          </div>
                        </div>
                        
                        {/* Processing Animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-shimmer" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input Premium */}
          <div className="animate-slide-up">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={sendMessageMutation.isPending || createConversationMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
