import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { chatApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import SystemPromptDialog from "./SystemPromptDialog";
import ThemeCustomizer from "./ThemeCustomizer";
import ProfileManager from "./ProfileManager";
import FunFeatures from "./FunFeatures";
import SecurityCenter from "./SecurityCenter";
import AdvancedImageGenerator from "./AdvancedImageGenerator";
import ImageGallery, { addImageToGallery } from "./ImageGallery";
import { LanguageSettingsButton } from "./LanguageSelector";
import { useTranslation } from 'react-i18next';
import {
  Plus,
  MessageSquare,
  Trash2,
  User,
  LogOut,
  Bot,
  Sparkles,
  Calendar,
  ChevronRight,
  ChevronDown,
  Search,
  BarChart3,
  Palette,
  Gamepad2,
  Shield,
  Image as ImageIcon,
  Crown,
  Construction,
  Sun,
  Moon
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Conversation } from "@shared/schema";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
}

export default function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [funOpen, setFunOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [imageGenOpen, setImageGenOpen] = useState(false);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  // Statistics for conversations
  const totalMessages = conversations.length;

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations by date
  const groupedConversations = filteredConversations.reduce((groups, conversation) => {
    const date = new Date(conversation.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupName: string;
    if (date.toDateString() === today.toDateString()) {
      groupName = t('today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupName = t('yesterday');
    } else {
      groupName = format(date, "dd/MM/yyyy", { locale: ptBR });
    }

    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(conversation);
    return groups;
  }, {} as Record<string, Conversation[]>);

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      return await chatApi.deleteConversation(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Conversa excluída",
        description: "A conversa foi removida com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir conversa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    deleteConversationMutation.mutate(conversationId);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="h-full bg-gray-950/95 dark:bg-gray-900/98 border-r border-gray-800/50 flex flex-col backdrop-blur-xl relative overflow-hidden">
      {/* Quadradinhos decorativos sutis no background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-16 left-6 w-2 h-2 bg-gray-400/5 rounded-sm animate-pulse" />
        <div className="absolute top-32 right-8 w-1 h-1 bg-gray-300/8 rounded-sm animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-48 left-4 w-1.5 h-1.5 bg-gray-500/6 rounded-sm animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-32 right-5 w-1 h-1 bg-gray-400/7 rounded-sm animate-pulse" style={{animationDelay: '0.5s'}} />
        <div className="absolute bottom-16 left-8 w-0.5 h-0.5 bg-gray-300/10 rounded-sm animate-pulse" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-64 right-3 w-1 h-1 bg-gray-500/5 rounded-sm animate-pulse" style={{animationDelay: '3s'}} />
      </div>
      
      {/* Header Dark Night Elegante */}
      <div className="p-5 border-b border-gray-800/40 relative z-10">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <Avatar className="h-12 w-12 border border-gray-700/50 bg-gray-800/80">
              <AvatarFallback className="bg-gray-800 text-gray-200 font-semibold">
                <Bot className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-gray-600 rounded-full border-2 border-gray-950 flex items-center justify-center">
              <Sparkles className="h-2 w-2 text-gray-300" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-100 truncate">Catalyst IA</h2>
            <p className="text-xs text-gray-400 truncate">
              {t('virtualAssistant') || 'Seu assistente virtual'}
            </p>
          </div>
          {/* Theme Toggle com Ícone de Sol/Lua */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-800/40 hover:bg-gray-700/50 border border-gray-700/30 hover:border-gray-600/40 transition-all duration-300 hover:scale-110"
          >
            <Sun className="h-4 w-4 text-gray-400 hover:text-yellow-500 transition-colors hidden dark:block" />
            <Moon className="h-4 w-4 text-gray-600 hover:text-gray-800 transition-colors block dark:hidden" />
          </Button>
        </div>

        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-3 bg-gray-800/60 hover:bg-gray-700/70 text-gray-200 font-medium 
                     border border-gray-700/40 hover:border-gray-600/50 transition-all duration-300 
                     hover:scale-[1.02] rounded-xl h-12"
        >
          <Plus className="h-5 w-5" />
          {t('newConversation') || 'Nova Conversa'}
        </Button>
      </div>

      {/* Search Dark */}
      <div className="p-4 border-b border-gray-800/40 relative z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder={t('searchConversations')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm bg-gray-800/60 border border-gray-700/40 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600
                     placeholder:text-gray-500 transition-all duration-300 text-gray-200"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="p-3 space-y-2 border-b border-gray-800/40 relative z-10">
        <Collapsible open={statsOpen} onOpenChange={setStatsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between hover:bg-gray-800/40 h-9 text-gray-300 hover:text-gray-200"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{t('statistics')}</span>
              </div>
              {statsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2 px-2">
              <div className="bg-gray-800/50 border border-gray-700/30 p-3 rounded-lg">
                <div className="text-xs text-gray-500">{t('conversations')}</div>
                <div className="text-lg font-bold text-gray-200">{conversations.length}</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/30 p-3 rounded-lg">
                <div className="text-xs text-gray-500">{t('total')}</div>
                <div className="text-lg font-bold text-gray-200">{totalMessages}</div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 relative z-10">
        <div className="p-3 space-y-1">
          {Object.keys(groupedConversations).length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="h-16 w-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="font-semibold text-sm mb-2 text-gray-300">{t('noConversationsYet')}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t('clickNewConversation')}
              </p>
            </div>
          ) : (
            Object.entries(groupedConversations).map(([groupName, groupConversations]) => (
              <div key={groupName} className="mb-6">
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <Calendar className="h-3 w-3 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {groupName}
                  </span>
                </div>

                <div className="space-y-1">
                  {groupConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => onSelectConversation(conversation.id)}
                      className={`
                        group cursor-pointer p-3 rounded-xl transition-all duration-300 hover:scale-[1.02]
                        ${currentConversationId === conversation.id 
                          ? 'bg-gray-700/60 border border-gray-600/40' 
                          : 'bg-gray-800/30 hover:bg-gray-800/50 border border-gray-800/40 hover:border-gray-700/50'}
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MessageSquare className={`h-4 w-4 flex-shrink-0 transition-colors 
                          ${currentConversationId === conversation.id ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate transition-colors
                            ${currentConversationId === conversation.id ? 'text-gray-200' : 'text-gray-300 group-hover:text-gray-200'}`}>
                            {conversation.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {format(new Date(conversation.createdAt), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteConversation(e, conversation.id)}
                            className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400"
                            disabled={deleteConversationMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {currentConversationId === conversation.id && (
                        <ChevronRight className="h-4 w-4 text-gray-300 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* User Profile & Menu Dark Night */}
      <div className="p-4 border-t border-gray-800/40 bg-gray-950/60 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8 border border-gray-700/50">
            <AvatarFallback className="bg-gray-800 text-gray-300 text-sm font-semibold">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-gray-200">
              {user?.username || "Usuário"}
            </p>
            <p className="text-xs text-gray-500">
              {t('freePlan')}
            </p>
          </div>
        </div>

        <div className="space-y-3 relative">
          {/* Quadradinhos decorativos no menu */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-2 right-4 w-1 h-1 bg-gray-500/20 rounded-sm animate-pulse" />
            <div className="absolute top-8 left-6 w-0.5 h-0.5 bg-gray-400/30 rounded-sm animate-pulse" style={{animationDelay: '0.5s'}} />
            <div className="absolute bottom-12 right-8 w-1.5 h-1.5 bg-gray-600/15 rounded-sm animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute bottom-6 left-2 w-0.5 h-0.5 bg-gray-500/25 rounded-sm animate-pulse" style={{animationDelay: '1.5s'}} />
          </div>
          
          {/* Menu Dark Night - Elegante e Minimalista */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <Button
              variant="ghost"
              onClick={() => setProfileOpen(true)}
              className="group relative h-12 p-3 overflow-hidden rounded-xl
                         bg-gray-900/80 dark:bg-gray-800/90 
                         hover:bg-gray-800/90 dark:hover:bg-gray-700/90
                         border border-gray-700/40 hover:border-gray-600/60
                         backdrop-blur-sm transition-all duration-300 ease-out
                         hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent 
                            opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
              
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-gray-600/60 transition-all duration-300">
                  <User className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {t('profile')}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    Configurações
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setThemeOpen(true)}
              className="group relative h-12 p-3 overflow-hidden rounded-xl
                         bg-gray-900/80 dark:bg-gray-800/90 
                         hover:bg-gray-800/90 dark:hover:bg-gray-700/90
                         border border-gray-700/40 hover:border-gray-600/60
                         backdrop-blur-sm transition-all duration-300 ease-out
                         hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent 
                            opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
              
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-gray-600/60 transition-all duration-300">
                  <Palette className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {t('themes')}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    Personalização
                  </p>
                </div>
              </div>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            <Button
              variant="ghost"
              onClick={() => setSecurityOpen(true)}
              className="group relative h-12 p-3 overflow-hidden rounded-xl
                         bg-gray-900/80 dark:bg-gray-800/90 
                         hover:bg-gray-800/90 dark:hover:bg-gray-700/90
                         border border-gray-700/40 hover:border-gray-600/60
                         backdrop-blur-sm transition-all duration-300 ease-out
                         hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent 
                            opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
              
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-gray-600/60 transition-all duration-300">
                  <Shield className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {t('security')}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    2FA / WebAuthn
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setFunOpen(true)}
              className="group relative h-12 p-3 overflow-hidden rounded-xl
                         bg-gray-900/80 dark:bg-gray-800/90 
                         hover:bg-gray-800/90 dark:hover:bg-gray-700/90
                         border border-gray-700/40 hover:border-gray-600/60
                         backdrop-blur-sm transition-all duration-300 ease-out
                         hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent 
                            opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
              
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-gray-600/60 transition-all duration-300">
                  <Gamepad2 className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {t('fun')}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    Recursos Extra
                  </p>
                </div>
              </div>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            <Button
              variant="ghost"
              onClick={() => toast({
                title: "🚧 Em Desenvolvimento",
                description: "A funcionalidade de geração de imagens está sendo desenvolvida!",
                variant: "default"
              })}
              className="group relative h-12 p-3 overflow-hidden rounded-xl
                         bg-gray-900/60 dark:bg-gray-800/70 
                         hover:bg-gray-800/70 dark:hover:bg-gray-700/80
                         border border-gray-700/30 hover:border-gray-600/40
                         backdrop-blur-sm transition-all duration-300 ease-out
                         hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10
                         opacity-70 hover:opacity-90"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent 
                            opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
              
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="p-1.5 rounded-lg bg-gray-700/40 group-hover:bg-gray-600/50 transition-all duration-300">
                  <Construction className="h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-300 group-hover:text-gray-200 transition-colors">
                      Imagens
                    </p>
                    <span className="text-[8px] bg-gray-600/50 text-gray-300 px-1.5 py-0.5 
                                   rounded-full font-bold tracking-wider border border-gray-600/30">
                      BETA
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    Geração IA
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setImageGalleryOpen(true)}
              className="group relative h-12 p-3 overflow-hidden rounded-xl
                         bg-gray-900/80 dark:bg-gray-800/90 
                         hover:bg-gray-800/90 dark:hover:bg-gray-700/90
                         border border-gray-700/40 hover:border-gray-600/60
                         backdrop-blur-sm transition-all duration-300 ease-out
                         hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent 
                            opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
              
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-gray-600/60 transition-all duration-300">
                  <ImageIcon className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    Galeria
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    Imagens Criadas
                  </p>
                </div>
              </div>
            </Button>
          </div>

          {/* Admin Panel */}
          {user?.role === 'admin' && (
            <div className="grid grid-cols-1 gap-2 mb-2 relative z-10">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/admin'}
                className="h-10 text-xs justify-start bg-yellow-900/20 hover:bg-yellow-800/30 text-yellow-300 border border-yellow-700/30"
              >
                <Crown className="h-3 w-3 mr-2 text-yellow-500" />
                <span className="font-medium">Painel Admin</span>
              </Button>
            </div>
          )}

          {/* Language Settings */}
          <div className="grid grid-cols-1 gap-2 relative z-10">
            <LanguageSettingsButton />
          </div>

          {/* System Prompt */}
          <div className="mt-4 relative z-10">
            <SystemPromptDialog
              currentPrompt={conversations.find(c => c.id === currentConversationId)?.systemPrompt || ""}
              onSave={async (prompt) => {
                if (!currentConversationId) return;
                
                try {
                  await fetch(`/api/conversations/${currentConversationId}/system-prompt`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ systemPrompt: prompt }),
                  });
                  
                  queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
                  
                  toast({
                    title: "✅ Prompt salvo!",
                    description: "O prompt do sistema foi configurado com sucesso. Suas próximas mensagens usarão esta personalidade.",
                  });
                } catch (error) {
                  toast({
                    title: "❌ Erro",
                    description: "Não foi possível salvar o prompt. Tente novamente.",
                    variant: "destructive",
                  });
                }
              }}
              disabled={!currentConversationId}
            />
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full h-10 text-xs justify-start hover:bg-red-900/20 hover:text-red-300 text-gray-300 mt-2"
          >
            <LogOut className="h-3 w-3 mr-2" />
            {t('logout')}
          </Button>
        </div>
      </div>

      {/* Modal Components */}
      {profileOpen && (
        <ProfileManager
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      )}

      {themeOpen && (
        <ThemeCustomizer
          isOpen={themeOpen}
          onClose={() => setThemeOpen(false)}
        />
      )}

      {funOpen && (
        <FunFeatures
          isOpen={funOpen}
          onClose={() => setFunOpen(false)}
        />
      )}

      {securityOpen && (
        <SecurityCenter
          isOpen={securityOpen}
          onClose={() => setSecurityOpen(false)}
        />
      )}

      {imageGenOpen && (
        <AdvancedImageGenerator
          isOpen={imageGenOpen}
          onClose={() => setImageGenOpen(false)}
          onGenerate={async (params) => {
            try {
              const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  prompt: params.prompt,
                  size: params.ratio === "1:1" ? "1024x1024" : 
                        params.ratio === "16:9" ? "1344x768" :
                        params.ratio === "9:16" ? "768x1344" : "1024x1024"
                }),
              });

              if (!response.ok) {
                throw new Error('Erro ao gerar imagem');
              }

              const data = await response.json();

              const savedImage = addImageToGallery({
                imageUrl: data.image,
                prompt: params.prompt,
                style: params.style,
                size: params.ratio === "1:1" ? "1024x1024" : 
                      params.ratio === "16:9" ? "1344x768" :
                      params.ratio === "9:16" ? "768x1344" : "1024x1024",
                model: "Gemini Pro"
              });

              toast({
                title: "Imagem gerada com sucesso!",
                description: "A imagem foi criada usando Google Gemini e salva na galeria.",
              });

            } catch (error) {
              toast({
                title: "Erro ao gerar imagem",
                description: error instanceof Error ? error.message : "Erro desconhecido",
                variant: "destructive",
              });
            }
          }}
        />
      )}

      {imageGalleryOpen && (
        <ImageGallery
          isOpen={imageGalleryOpen}
          onClose={() => setImageGalleryOpen(false)}
        />
      )}
    </div>
  );
}