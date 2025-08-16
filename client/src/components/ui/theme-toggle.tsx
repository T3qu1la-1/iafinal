
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Sparkles } from 'lucide-react';

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Inicializar com tema escuro como padrão
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark'; // ESCURO COMO PADRÃO
    
    setTheme(initialTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);
    
    // Se não há tema salvo, salvar o escuro como padrão
    if (!savedTheme) {
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Animação suave de transição
    document.documentElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Reset da animação
    setTimeout(() => {
      setIsAnimating(false);
      document.documentElement.style.transition = '';
    }, 500);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      disabled={isAnimating}
      className={`
        group relative p-3 rounded-xl overflow-hidden
        bg-gray-800/60 hover:bg-gray-700/70 
        border border-gray-700/40 hover:border-gray-600/60
        backdrop-blur-lg transition-all duration-500 ease-out
        hover:scale-110 hover:rotate-12
        focus:outline-none focus:ring-4 focus:ring-primary/30
        ${isAnimating ? 'animate-spin-slow' : ''}
        ${className}
      `}
      title={theme === 'dark' ? "Modo claro" : "Modo escuro"}
    >
      {/* Background com efeito holográfico */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
      
      {/* Efeito de brilho ao hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Ícone principal */}
      <div className="relative z-10 flex items-center justify-center">
        {theme === 'dark' ? (
          <div className="relative">
            <Sun className="h-5 w-5 text-yellow-400 transition-all duration-300 group-hover:text-yellow-300 group-hover:drop-shadow-lg animate-float" />
            <div className="absolute inset-0 animate-ping">
              <Sun className="h-5 w-5 text-yellow-400/30" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <Moon className="h-5 w-5 text-blue-400 transition-all duration-300 group-hover:text-blue-300 group-hover:drop-shadow-lg animate-float" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-2.5 w-2.5 text-blue-300 animate-pulse" />
            </div>
          </div>
        )}
      </div>
      
      {/* Efeito de onda ao clicar */}
      <div className={`
        absolute inset-0 rounded-xl
        ${isAnimating ? 'animate-ping bg-primary/20' : ''}
      `} />
      
      {/* Partículas de brilho */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1 left-1 w-1 h-1 bg-primary/40 rounded-full animate-pulse" style={{animationDelay: '0s'}} />
        <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-accent/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
        <div className="absolute bottom-1 left-2 w-1 h-1 bg-primary/30 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-2 right-1 w-0.5 h-0.5 bg-accent/40 rounded-full animate-pulse" style={{animationDelay: '1.5s'}} />
      </div>
    </Button>
  );
}
