import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  BarChart3, 
  Settings, 
  Crown, 
  Activity,
  TrendingUp,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Server,
  Eye,
  Trash2,
  Clock,
  Globe
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminStats {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Redirect if not authenticated or not admin
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  if (user.role !== "admin") {
    return <Redirect to="/" />;
  }

  // Fetch admin data
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/admin/conversations"],
    refetchInterval: 60000,
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-x"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-400/5 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Painel Administrativo
                </h1>
                <p className="text-gray-300">
                  Bem-vindo, {user.username} • Sistema Catalyst IA
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Chat
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalUsers || 0}
              </div>
              <p className="text-xs text-gray-300">
                Usuários registrados na plataforma
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversas Totais</CardTitle>
              <MessageCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalConversations || 0}
              </div>
              <p className="text-xs text-gray-300">
                Conversas criadas pelos usuários
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens Totais</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalMessages || 0}
              </div>
              <p className="text-xs text-gray-300">
                Mensagens processadas pela IA
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              <BarChart3 className="mr-2 h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-white/20">
              <Users className="mr-2 h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="conversations" className="text-white data-[state=active]:bg-white/20">
              <MessageCircle className="mr-2 h-4 w-4" />
              Conversas
            </TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-white/20">
              <Server className="mr-2 h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-400" />
                    Status do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>API Gemini</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Raikken (Fallback)</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Base de Dados</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Operacional
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Geração de Imagens</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Ativo
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Sistema iniciado às {format(new Date(), "HH:mm", { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>APIs funcionando normalmente</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span>Admin {user.username} conectado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription className="text-gray-300">
                  Lista de todos os usuários registrados na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {usersLoading ? (
                      <div className="text-center py-8">Carregando usuários...</div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">Nenhum usuário encontrado</div>
                    ) : (
                      users.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{u.username}</p>
                              <p className="text-sm text-gray-400">{u.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={
                                u.role === "admin" 
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              }
                            >
                              {u.role === "admin" ? "Admin" : "Usuário"}
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {u.plan}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle>Conversas da Plataforma</CardTitle>
                <CardDescription className="text-gray-300">
                  Todas as conversas criadas pelos usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {conversationsLoading ? (
                      <div className="text-center py-8">Carregando conversas...</div>
                    ) : conversations.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">Nenhuma conversa encontrada</div>
                    ) : (
                      conversations.map((conv) => (
                        <div key={conv.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{conv.title}</p>
                              <p className="text-sm text-gray-400">
                                Criada em {formatDate(conv.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/20">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Info */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-400" />
                    Informações do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Versão:</span>
                    <span className="text-blue-400">Catalyst IA v2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ambiente:</span>
                    <span className="text-green-400">Desenvolvimento</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base de Dados:</span>
                    <span className="text-purple-400">SQLite3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IA Principal:</span>
                    <span className="text-yellow-400">Google Gemini 2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IA Fallback:</span>
                    <span className="text-orange-400">Raikken API</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-400" />
                    Ações Administrativas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <Shield className="mr-2 h-4 w-4" />
                    Gerenciar Permissões
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <Database className="mr-2 h-4 w-4" />
                    Backup da Base de Dados
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <Globe className="mr-2 h-4 w-4" />
                    Configurações da API
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Reiniciar Sistema
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}