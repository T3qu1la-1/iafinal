import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageSelector";

interface ChatInputProps {
  onSendMessage: (content: string, generateImage?: boolean) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showRateLimit, setShowRateLimit] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSentTime = useRef(0);
  const RATE_LIMIT_DELAY = 3000; // 3 seconds
  const { t } = useLanguage();

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSend = (forceImageMode = false) => {
    const content = message.trim();
    if (!content || disabled) return;

    // Rate limiting check
    const now = Date.now();
    if (now - lastSentTime.current < RATE_LIMIT_DELAY) {
      setShowRateLimit(true);
      setTimeout(() => setShowRateLimit(false), 3000);
      return;
    }

    lastSentTime.current = now;
    
    // Check if user wants to generate an image
    const shouldGenerateImage = forceImageMode || imageMode || detectImageIntent(content);
    onSendMessage(content, shouldGenerateImage);
    setMessage("");
    setImageMode(false);
  };

  // Detect if user wants to generate an image based on keywords
  const detectImageIntent = (text: string): boolean => {
    const imageKeywords = [
      'gerar imagem', 'criar imagem', 'desenhar', 'ilustrar', 'fazer um desenho',
      'generate image', 'create image', 'draw', 'picture of', 'show me',
      'imagen de', 'criar foto', 'fazer foto', 'mostrar'
    ];
    
    const lowerText = text.toLowerCase();
    return imageKeywords.some(keyword => lowerText.includes(keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={imageMode ? t('chatInput.placeholderImage') : t('chatInput.placeholderMessage')}
            className={`resize-none rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pr-20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-primary min-h-[44px] transition-all ${
              imageMode ? 'border-purple-300 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-900/10' : ''
            }`}
            rows={1}
            disabled={disabled}
          />
          <div className="absolute right-2 top-2 flex gap-1">
            <Button
              onClick={() => setImageMode(!imageMode)}
              disabled={disabled}
              size="sm"
              variant={imageMode ? "default" : "ghost"}
              className={`p-2 h-8 w-8 transition-all ${
                imageMode 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg' 
                  : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
              title={imageMode ? t('chatInput.imageMode') : t('chatInput.activateImageMode')}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleSend()}
              disabled={!message.trim() || disabled}
              size="sm"
              className="p-2 h-8 w-8"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {imageMode && (
          <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            <span>{t('chatInput.imageModeActive')}</span>
          </div>
        )}
        
        {showRateLimit && (
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{t('chatInput.rateLimitWarning')}</span>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          {t('chatInput.disclaimer')}
        </p>
      </div>
    </div>
  );
}
