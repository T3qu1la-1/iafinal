import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Bot,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
  Shield,
  Zap,
  Globe,
  Check,
  LogIn,
  UserPlus,
  Star,
  Rocket,
  Crown,
  Heart,
  Brain,
  Eye
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      toast({
        title: t("toast.required_fields"),
        description: t("toast.fill_all_fields"),
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.username.trim() || !registerData.email.trim() || !registerData.password.trim()) {
      toast({
        title: t("toast.required_fields"),
        description: t("toast.fill_all_fields"),
        variant: "destructive",
      });
      return;
    }
    if (!registerData.email.includes("@")) {
      toast({
        title: t("toast.invalid_email.title"),
        description: t("toast.invalid_email.description"),
        variant: "destructive",
      });
      return;
    }
    if (registerData.password.length < 6) {
      toast({
        title: t("toast.password_too_short.title"),
        description: t("toast.password_too_short.description"),
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(registerData);
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Conversas Inteligentes",
      description: "IA avançada para conversas naturais e contextuais"
    },
    {
      icon: ImageIcon,
      title: "Geração de Imagens",
      description: "Crie imagens impressionantes com apenas uma descrição"
    },
    {
      icon: Zap,
      title: "Respostas Rápidas",
      description: "Processamento ultra-rápido com Catalyst IA"
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description: "Criptografia avançada e proteção total da privacidade"
    },
    {
      icon: Globe,
      title: "Acesso Global",
      description: "Disponível 24/7 em qualquer lugar do mundo"
    },
    {
      icon: Bot,
      title: "Catalyst IA",
      description: "Especialista em apresentações e criação de conteúdo"
    }
  ];

  const benefits = [
    "Interface moderna e intuitiva",
    "Suporte completo em português brasileiro",
    "Geração gratuita de imagens de alta qualidade",
    "Histórico de conversas organizado",
    "Suporte a múltiplas sessões simultâneas",
    "Atualizações automáticas da IA"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 dark:bg-gray-900">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* DARK NIGHT BACKGROUND - Quadradinhos Elegantes */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Quadradinhos decorativos sutis */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-3 h-3 bg-gray-400/5 rounded-sm animate-pulse" />
          <div className="absolute top-32 right-32 w-2 h-2 bg-gray-300/8 rounded-sm animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-48 left-16 w-4 h-4 bg-gray-500/6 rounded-sm animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-32 right-20 w-2.5 h-2.5 bg-gray-400/7 rounded-sm animate-pulse" style={{animationDelay: '0.5s'}} />
          <div className="absolute bottom-16 left-24 w-1.5 h-1.5 bg-gray-300/10 rounded-sm animate-pulse" style={{animationDelay: '1.5s'}} />
          <div className="absolute top-64 right-12 w-2 h-2 bg-gray-500/5 rounded-sm animate-pulse" style={{animationDelay: '3s'}} />
          <div className="absolute top-80 left-40 w-1 h-1 bg-gray-400/8 rounded-sm animate-pulse" style={{animationDelay: '2.5s'}} />
          <div className="absolute bottom-48 left-60 w-3 h-3 bg-gray-300/6 rounded-sm animate-pulse" style={{animationDelay: '4s'}} />
          <div className="absolute top-96 right-48 w-1.5 h-1.5 bg-gray-500/7 rounded-sm animate-pulse" style={{animationDelay: '3.5s'}} />
          <div className="absolute bottom-64 right-16 w-2.5 h-2.5 bg-gray-400/5 rounded-sm animate-pulse" style={{animationDelay: '1.2s'}} />
        </div>
        
        {/* Gradientes sutis */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-transparent to-gray-700/10 animate-pulse" />
        
        {/* Formas geométricas elegantes */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gray-700/5 rounded-2xl rotate-45 animate-pulse blur-sm" />
        <div className="absolute top-3/4 right-1/4 w-20 h-20 bg-gray-600/8 rounded-full animate-pulse blur-sm" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-3/4 w-18 h-18 bg-gray-800/6 rounded-2xl -rotate-12 animate-pulse blur-sm" style={{animationDelay: '1s'}} />
      </div>

      {/* Grid pattern sutil */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }}></div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12 max-w-7xl mx-auto">

          {/* Hero Section - Takes more space */}
          <div className="xl:col-span-3 space-y-8 lg:space-y-12">
            {/* Header */}
            <div className="text-center xl:text-left space-y-6">
              <div className="flex items-center justify-center xl:justify-start gap-4 mb-8 animate-slide-in-left">
                <div className="relative animate-floating">
                  <div className="h-16 w-16 bg-gray-800 dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-700/50">
                    <Bot className="h-8 w-8 text-gray-300" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center animate-bounce-gentle shadow-lg">
                    <Sparkles className="h-3 w-3 text-gray-200 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-100 dark:text-gray-200">Catalyst IA</h1>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Plataforma de Inteligência Artificial</p>
                </div>
              </div>

              <div className="space-y-6 animate-slide-in-right">
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-100 dark:text-gray-200 leading-tight animate-fade-in">
                  <span className="animate-slide-up inline-block">{t("hero.title.part1")}</span>
                  <br />
                  <span className="text-gray-300 dark:text-gray-400">
                    {t("hero.title.part2")}
                  </span>
                </h2>
                <p className="text-xl text-gray-400 dark:text-gray-500 max-w-2xl mx-auto xl:mx-0 leading-relaxed animate-slide-up">
                  {t("hero.description")}
                </p>

                {/* Botões de ação rápida */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-md mx-auto xl:mx-0">
                  <Button
                    onClick={() => {
                      document.getElementById('auth-form')?.scrollIntoView({behavior: 'smooth'});
                      const loginTab = document.querySelector('[value="login"]') as HTMLElement;
                      if (loginTab) loginTab.click();
                    }}
                    className="flex-1 h-12 text-base font-semibold bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-200 border border-gray-700 hover:border-gray-600 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-fade-in"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    {t("login_button")}
                  </Button>
                  <Button
                    onClick={() => {
                      document.getElementById('auth-form')?.scrollIntoView({behavior: 'smooth'});
                      const registerTab = document.querySelector('[value="register"]') as HTMLElement;
                      if (registerTab) registerTab.click();
                    }}
                    className="flex-1 h-12 text-base font-semibold bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-200 border border-gray-600 hover:border-gray-500 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-fade-in"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    {t("register_button")}
                  </Button>
                </div>

                {/* CTA pills */}
                <div className="flex flex-wrap gap-4 mt-8 justify-center xl:justify-start animate-slide-in-left">
                  <div className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-gray-200 border border-gray-700/40">
                    <Sparkles className="inline w-4 h-4 mr-2 text-gray-400" />
                    {t("cta.free")}
                  </div>
                  <div className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-gray-200 border border-gray-700/40">
                    <Rocket className="inline w-4 h-4 mr-2 text-gray-400" />
                    {t("cta.fast")}
                  </div>
                  <div className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-gray-200 border border-gray-700/40">
                    <Heart className="inline w-4 h-4 mr-2 text-gray-400" />
                    {t("cta.love")}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-6 text-sm text-gray-500 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400" />
                  <span>{t("start_free")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400" />
                  <span>{t("no_card_needed")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400" />
                  <span>{t("instant_access")}</span>
                </div>
              </div>
            </div>

            {/* Features Grid - Dark Night */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-900/80 dark:bg-gray-800/90 border border-gray-800/60 p-6 rounded-2xl space-y-4 group hover:scale-105 transition-all duration-300 animate-fade-in backdrop-blur-sm hover:bg-gray-800/90 dark:hover:bg-gray-700/90" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-700/50 rounded-2xl flex items-center justify-center group-hover:bg-gray-600/60 transition-all duration-300 shadow-lg">
                      <feature.icon className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-base text-gray-200 group-hover:text-white transition-colors">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Benefits List - Dark Night */}
            <div className="bg-gray-900/80 dark:bg-gray-800/90 border border-gray-800/60 p-6 lg:p-8 space-y-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-gray-200 text-center xl:text-left">
                {t("why_choose_catalyst")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors animate-slide-in-left" style={{animationDelay: `${index * 50}ms`}}>
                    <Check className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats - Dark Night */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '200ms'}}>
                <div className="text-3xl font-bold text-gray-200">10K+</div>
                <div className="text-sm text-gray-500">{t("stats.active_users")}</div>
              </div>
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '300ms'}}>
                <div className="text-3xl font-bold text-gray-200">50K+</div>
                <div className="text-sm text-gray-500">{t("stats.conversations")}</div>
              </div>
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '400ms'}}>
                <div className="text-3xl font-bold text-gray-200">25K+</div>
                <div className="text-sm text-gray-500">{t("stats.images_generated")}</div>
              </div>
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '500ms'}}>
                <div className="text-3xl font-bold text-gray-200">99.9%</div>
                <div className="text-sm text-gray-500">{t("stats.uptime")}</div>
              </div>
            </div>
          </div>

          {/* Auth Form - Dark Night Elegante */}
          <div className="xl:col-span-2 flex items-center justify-center">
            <div className="w-full max-w-md animate-slide-up">
              <Card id="auth-form" className="shadow-2xl border border-gray-800/60 bg-gray-900/90 dark:bg-gray-800/95 backdrop-blur-2xl hover-lift rounded-3xl overflow-hidden relative">
                {/* Quadradinhos decorativos no card */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="absolute top-4 right-8 w-1 h-1 bg-gray-500/20 rounded-sm animate-pulse" />
                  <div className="absolute top-12 left-6 w-0.5 h-0.5 bg-gray-400/30 rounded-sm animate-pulse" style={{animationDelay: '0.5s'}} />
                  <div className="absolute bottom-20 right-12 w-1.5 h-1.5 bg-gray-600/15 rounded-sm animate-pulse" style={{animationDelay: '1s'}} />
                  <div className="absolute bottom-8 left-4 w-0.5 h-0.5 bg-gray-500/25 rounded-sm animate-pulse" style={{animationDelay: '1.5s'}} />
                </div>
                <div className="relative z-10">
                  <CardHeader className="space-y-4 pb-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-700 dark:bg-gray-600 rounded-2xl flex items-center justify-center mb-4 border border-gray-600/50">
                      <Bot className="w-8 h-8 text-gray-300" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-100 mb-2">
                        {t("welcome_back")}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {t("access_your_account")}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl">
                        <TabsTrigger value="login" className="font-semibold text-gray-300 data-[state=active]:bg-gray-700/60 data-[state=active]:text-white rounded-xl transition-all">
                          <LogIn className="w-4 h-4 mr-2" />
                          {t("login")}
                        </TabsTrigger>
                        <TabsTrigger value="register" className="font-semibold text-gray-300 data-[state=active]:bg-gray-700/60 data-[state=active]:text-white rounded-xl transition-all">
                          <UserPlus className="w-4 h-4 mr-2" />
                          {t("register")}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="login" className="space-y-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                          <div className="space-y-3">
                            <Label htmlFor="login-username" className="text-sm font-semibold text-gray-200">
                              {t("username")}
                            </Label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-gray-400 transition-colors" />
                              <Input
                                id="login-username"
                                type="text"
                                placeholder={t("enter_username")}
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                className="pl-12 h-12 text-base bg-gray-800/60 border border-gray-700/40 text-gray-200 placeholder:text-gray-500 rounded-xl focus:border-gray-600 focus:ring-2 focus:ring-gray-600/20 backdrop-blur-sm transition-all"
                                disabled={loginMutation.isPending}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="login-password" className="text-sm font-semibold text-gray-200">
                              {t("password")}
                            </Label>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-gray-400 transition-colors" />
                              <Input
                                id="login-password"
                                type="password"
                                placeholder={t("enter_password")}
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="pl-12 h-12 text-base bg-gray-800/60 border border-gray-700/40 text-gray-200 placeholder:text-gray-500 rounded-xl focus:border-gray-600 focus:ring-2 focus:ring-gray-600/20 backdrop-blur-sm transition-all"
                                disabled={loginMutation.isPending}
                                required
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("logging_in")}
                              </>
                            ) : (
                              <>
                                <LogIn className="mr-2 h-4 w-4" />
                                {t("login")}
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="register" className="space-y-6">
                        <form onSubmit={handleRegister} className="space-y-5">
                          <div className="space-y-3">
                            <Label htmlFor="register-username" className="text-sm font-semibold text-gray-200">
                              {t("username")}
                            </Label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-gray-400 transition-colors" />
                              <Input
                                id="register-username"
                                type="text"
                                placeholder={t("enter_username")}
                                value={registerData.username}
                                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                className="pl-12 h-12 text-base bg-gray-800/60 border border-gray-700/40 text-gray-200 placeholder:text-gray-500 rounded-xl focus:border-gray-600 focus:ring-2 focus:ring-gray-600/20 backdrop-blur-sm transition-all"
                                disabled={registerMutation.isPending}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="register-email" className="text-sm font-semibold text-gray-200">
                              {t("email")}
                            </Label>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-gray-400 transition-colors" />
                              <Input
                                id="register-email"
                                type="email"
                                placeholder={t("enter_email")}
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                className="pl-12 h-12 text-base bg-gray-800/60 border border-gray-700/40 text-gray-200 placeholder:text-gray-500 rounded-xl focus:border-gray-600 focus:ring-2 focus:ring-gray-600/20 backdrop-blur-sm transition-all"
                                disabled={registerMutation.isPending}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="register-password" className="text-sm font-semibold text-gray-200">
                              {t("password")}
                            </Label>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-gray-400 transition-colors" />
                              <Input
                                id="register-password"
                                type="password"
                                placeholder={t("enter_password")}
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                className="pl-12 h-12 text-base bg-gray-800/60 border border-gray-700/40 text-gray-200 placeholder:text-gray-500 rounded-xl focus:border-gray-600 focus:ring-2 focus:ring-gray-600/20 backdrop-blur-sm transition-all"
                                disabled={registerMutation.isPending}
                                required
                                minLength={6}
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("creating_account")}
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                {t("register")}
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}