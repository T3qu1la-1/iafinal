import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Particles from "@/components/ui/particles";
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
  Eye,
  Cloud
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
      description: "IA avançada para conversas naturais e contextuais",
      color: "text-blue-500"
    },
    {
      icon: ImageIcon,
      title: "Geração de Imagens",
      description: "Crie imagens impressionantes com apenas uma descrição",
      color: "text-purple-500"
    },
    {
      icon: Zap,
      title: "Respostas Rápidas",
      description: "Processamento ultra-rápido com Catalyst IA",
      color: "text-amber-500"
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description: "Criptografia avançada e proteção total da privacidade",
      color: "text-green-500"
    },
    {
      icon: Globe,
      title: "Acesso Global",
      description: "Disponível 24/7 em qualquer lugar do mundo",
      color: "text-cyan-500"
    },
    {
      icon: Bot,
      title: "Catalyst IA",
      description: "Especialista em apresentações e criação de conteúdo",
      color: "text-rose-500"
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/30 to-pink-600/20 animate-gradient-x"></div>

        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-400/10 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-pink-400/10 via-transparent to-blue-400/10 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-purple-400/10 via-transparent to-cyan-400/10 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl rotate-45 animate-float-slow blur-sm"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full animate-float-medium blur-sm"></div>
        <div className="absolute top-1/2 left-3/4 w-28 h-28 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-2xl -rotate-12 animate-float-fast blur-sm"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full animate-float-slow blur-sm" style={{animationDelay: '1s'}}></div>

        {/* Large gradient orbs with dynamic movement */}
        <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-orbital-1"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-full blur-3xl animate-orbital-2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-500/25 to-blue-500/25 rounded-full blur-3xl animate-orbital-3 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Particle system */}
      <Particles className="opacity-40" quantity={200} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12 max-w-7xl mx-auto">

          {/* Hero Section - Takes more space */}
          <div className="xl:col-span-3 space-y-8 lg:space-y-12">
            {/* Header */}
            <div className="text-center xl:text-left space-y-6">
              <div className="flex items-center justify-center xl:justify-start gap-4 mb-8 animate-slide-in-left">
                <div className="relative animate-floating">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-glow">
                    {/* Custom AI Symbol */}
                    <svg 
                      className="h-8 w-8 text-white" 
                      viewBox="0 0 100 100" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Central cloud shape */}
                      <path 
                        d="M20 50C20 35 32 23 47 23C52 19 58 17 64 19C70 21 75 26 77 32C82 32 87 37 87 43C87 49 82 54 77 54H25C22 54 20 52 20 50Z" 
                        fill="currentColor" 
                        opacity="0.9"
                      />
                      {/* Connection nodes around the cloud */}
                      <circle cx="15" cy="30" r="3" fill="currentColor" />
                      <circle cx="85" cy="30" r="3" fill="currentColor" />
                      <circle cx="15" cy="70" r="3" fill="currentColor" />
                      <circle cx="85" cy="70" r="3" fill="currentColor" />
                      <circle cx="30" cy="15" r="3" fill="currentColor" />
                      <circle cx="70" cy="15" r="3" fill="currentColor" />
                      <circle cx="30" cy="85" r="3" fill="currentColor" />
                      <circle cx="70" cy="85" r="3" fill="currentColor" />

                      {/* Connection lines */}
                      <line x1="18" y1="30" x2="25" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="82" y1="30" x2="75" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="18" y1="70" x2="25" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="82" y1="70" x2="75" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="30" y1="18" x2="35" y2="25" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="70" y1="18" x2="65" y2="25" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="30" y1="82" x2="35" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="70" y1="82" x2="65" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

                      {/* AI Text */}
                      <text x="50" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">
                        AI
                      </text>
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce-gentle shadow-lg">
                    <Sparkles className="h-3 w-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_100%]">Catalyst IA</h1>
                  <p className="text-sm text-gray-400">Plataforma de Inteligência Artificial</p>
                </div>
              </div>

              <div className="space-y-6 animate-slide-in-right">
                <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight animate-fade-in">
                  <span className="animate-slide-up inline-block">{t("hero.title.part1")}</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_100%] animate-glow-pulse">
                    {t("hero.title.part2")}
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto xl:mx-0 leading-relaxed animate-slide-up">
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
                    className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in"
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
                    className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    {t("register_button")}
                  </Button>
                </div>

                {/* CTA pills */}
                <div className="flex flex-wrap gap-4 mt-8 justify-center xl:justify-start animate-slide-in-left">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    <Sparkles className="inline w-4 h-4 mr-2 text-purple-400" />
                    {t("cta.free")}
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    <Rocket className="inline w-4 h-4 mr-2 text-blue-400" />
                    {t("cta.fast")}
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    <Heart className="inline w-4 h-4 mr-2 text-red-400" />
                    {t("cta.love")}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-6 text-sm text-muted-foreground animate-fade-in">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t("start_free")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t("no_card_needed")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t("instant_access")}</span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="card-modern space-y-4 group hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300 shadow-lg">
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="font-bold text-base">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits List */}
            <div className="card-modern p-6 lg:p-8 space-y-6">
              <h3 className="text-2xl font-bold gradient-text text-center xl:text-left">
                {t("why_choose_catalyst")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-slide-in-left" style={{animationDelay: `${index * 50}ms`}}>
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '200ms'}}>
                <div className="text-3xl font-bold gradient-text">10K+</div>
                <div className="text-sm text-muted-foreground">{t("stats.active_users")}</div>
              </div>
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '300ms'}}>
                <div className="text-3xl font-bold gradient-text">50K+</div>
                <div className="text-sm text-muted-foreground">{t("stats.conversations")}</div>
              </div>
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '400ms'}}>
                <div className="text-3xl font-bold gradient-text">25K+</div>
                <div className="text-sm text-muted-foreground">{t("stats.images_generated")}</div>
              </div>
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '500ms'}}>
                <div className="text-3xl font-bold gradient-text">99.9%</div>
                <div className="text-sm text-muted-foreground">{t("stats.uptime")}</div>
              </div>
            </div>
          </div>

          {/* Auth Form - Takes less space */}
          <div className="xl:col-span-2 flex items-center justify-center">
            <div className="w-full max-w-md animate-slide-up">
              <Card id="auth-form" className="shadow-2xl border border-white/20 bg-white/10 backdrop-blur-2xl hover-lift rounded-3xl overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 opacity-50 blur-xl" />
                <div className="relative z-10">
                <CardHeader className="space-y-4 pb-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 animate-glow">
                    {/* Custom AI Symbol */}
                    <svg 
                      className="w-8 h-8 text-white" 
                      viewBox="0 0 100 100" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Central cloud shape */}
                      <path 
                        d="M20 50C20 35 32 23 47 23C52 19 58 17 64 19C70 21 75 26 77 32C82 32 87 37 87 43C87 49 82 54 77 54H25C22 54 20 52 20 50Z" 
                        fill="currentColor" 
                        opacity="0.9"
                      />
                      {/* Connection nodes around the cloud */}
                      <circle cx="15" cy="30" r="3" fill="currentColor" />
                      <circle cx="85" cy="30" r="3" fill="currentColor" />
                      <circle cx="15" cy="70" r="3" fill="currentColor" />
                      <circle cx="85" cy="70" r="3" fill="currentColor" />
                      <circle cx="30" cy="15" r="3" fill="currentColor" />
                      <circle cx="70" cy="15" r="3" fill="currentColor" />
                      <circle cx="30" cy="85" r="3" fill="currentColor" />
                      <circle cx="70" cy="85" r="3" fill="currentColor" />

                      {/* Connection lines */}
                      <line x1="18" y1="30" x2="25" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="82" y1="30" x2="75" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="18" y1="70" x2="25" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="82" y1="70" x2="75" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="30" y1="18" x2="35" y2="25" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="70" y1="18" x2="65" y2="25" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="30" y1="82" x2="35" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                      <line x1="70" y1="82" x2="65" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

                      {/* AI Text */}
                      <text x="50" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">
                        AI
                      </text>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {t("welcome_back")}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {t("access_your_account")}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                      <TabsTrigger value="login" className="font-semibold text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl transition-all">
                        <LogIn className="w-4 h-4 mr-2" />
                        {t("login")}
                      </TabsTrigger>
                      <TabsTrigger value="register" className="font-semibold text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl transition-all">
                        <UserPlus className="w-4 h-4 mr-2" />
                        {t("register")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-6">
                      <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-3">
                          <Label htmlFor="login-username" className="text-sm font-semibold text-white">
                            {t("username")}
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="login-username"
                              type="text"
                              placeholder={t("enter_username")}
                              value={loginData.username}
                              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={loginMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="login-password" className="text-sm font-semibold text-white">
                            {t("password")}
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="login-password"
                              type="password"
                              placeholder={t("enter_password")}
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={loginMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:transform-none"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              {t("logging_in")}
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" />
                              {t("login_platform")}
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-6">
                      <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-3">
                          <Label htmlFor="register-username" className="text-sm font-semibold text-white">
                            {t("username")}
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="register-username"
                              type="text"
                              placeholder={t("placeholders.choose_username")}
                              value={registerData.username}
                              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={registerMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="register-email" className="text-sm font-semibold text-white">
                            {t("email")}
                          </Label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="register-email"
                              type="email"
                              placeholder={t("enter_email")}
                              value={registerData.email}
                              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={registerMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="register-password" className="text-sm font-semibold text-white">
                            {t("password")}
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="register-password"
                              type="password"
                              placeholder={t("placeholders.password_requirements")}
                              value={registerData.password}
                              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={registerMutation.isPending}
                              required
                              minLength={6}
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:transform-none"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              {t("creating_account")}
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              {t("create_my_account")}
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="relative">
                    <div className="my-6 border-t border-white/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-sm px-4 text-xs text-gray-300 font-medium rounded-full border border-white/20">
                        {t("secure_platform")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span>{t("ssl_encryption")}</span>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {t("agree_to_terms")}
                        <Link href="/terms-of-service">
                          <span className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors cursor-pointer">
                            {t("terms_of_service")}
                          </span>
                        </Link>
                        {" e "}
                        <Link href="/privacy-policy">
                          <span className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors cursor-pointer">
                            {t("privacy_policy")}
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
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