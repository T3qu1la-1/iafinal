
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Sparkles, Zap } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // ESCURO COMO PADRÃO
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Verificar preferência salva ou usar escuro como padrão
    const savedTheme = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // SEMPRE PREFERIR ESCURO COMO PADRÃO
    const shouldBeDark = savedTheme === 'false' ? false : true;
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
    
    // Salvar tema escuro como padrão se não há preferência
    if (!savedTheme) {
      localStorage.setItem('darkMode', 'true');
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('darkMode', newTheme.toString());
    
    // Transição suave
    document.documentElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    document.documentElement.classList.toggle('dark', newTheme);
    
    // Reset da animação
    setTimeout(() => {
      setIsAnimating(false);
      document.documentElement.style.transition = '';
    }, 600);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      disabled={isAnimating}
      className={`
        group relative h-10 w-10 p-0 rounded-xl overflow-hidden
        bg-sidebar-accent/50 hover:bg-sidebar-accent/80
        border border-sidebar-border/40 hover:border-sidebar-border/80
        backdrop-blur-xl transition-all duration-500 ease-out
        hover:scale-110 hover:rotate-12 hover-glow
        focus:outline-none focus:ring-4 focus:ring-sidebar-primary/30
        ${isAnimating ? 'animate-spin-slow' : ''}
      `}
      title={isDark ? "Modo claro" : "Modo escuro"}
    >
      {/* Background holográfico */}
      <div className="absolute inset-0 bg-gradient-to-br from-sidebar-primary/10 via-sidebar-accent/10 to-sidebar-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy" />
      
      {/* Efeito shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Container do ícone */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {isDark ? (
          <div className="relative">
            {/* Sol com efeitos */}
            <Sun className={`h-5 w-5 transition-all duration-500 ${
              isAnimating 
                ? 'text-yellow-400 animate-spin' 
                : 'text-yellow-500 group-hover:text-yellow-400 animate-float'
            }`} />
            
            {/* Raios de sol */}
            <div className="absolute inset-0 animate-ping opacity-30">
              <Sun className="h-5 w-5 text-yellow-400" />
            </div>
            
            {/* Brilho adicional */}
            <div className="absolute -inset-1 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
              <Zap className="h-7 w-7 text-yellow-300 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Lua com efeitos */}
            <Moon className={`h-5 w-5 transition-all duration-500 ${
              isAnimating 
                ? 'text-blue-400 animate-spin' 
                : 'text-blue-600 group-hover:text-blue-400 animate-float'
            }`} />
            
            {/* Estrelas ao redor da lua */}
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <Sparkles className="h-2 w-2 text-purple-400 animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>
            
            {/* Halo da lua */}
            <div className="absolute inset-0 animate-ping opacity-20">
              <Moon className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        )}
      </div>
      
      {/* Ondas de energia ao clicar */}
      <div className={`
        absolute inset-0 rounded-xl border-2 border-sidebar-primary/50
        ${isAnimating ? 'animate-ping' : 'opacity-0'}
      `} />
      
      {/* Partículas mágicas */}
      <div className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-1 left-1 w-1 h-1 bg-sidebar-primary/60 rounded-full animate-pulse" />
        <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-yellow-400/80 rounded-full animate-pulse" style={{animationDelay: '0.3s'}} />
        <div className="absolute bottom-1 left-2 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{animationDelay: '0.6s'}} />
        <div className="absolute bottom-2 right-1 w-0.5 h-0.5 bg-purple-400/70 rounded-full animate-pulse" style={{animationDelay: '0.9s'}} />
        <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-sidebar-primary/80 rounded-full animate-ping" style={{animationDelay: '1.2s'}} />
      </div>
      
      {/* Efeito de energia circular */}
      <div className={`
        absolute inset-0 rounded-full border border-sidebar-primary/30
        ${isAnimating ? 'animate-pulse scale-150 opacity-0' : 'scale-100 opacity-0'}
        transition-all duration-600
      `} />
    </Button>
  );
}
