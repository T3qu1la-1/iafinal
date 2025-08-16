import type { Message } from "@shared/schema";
import { formatMessage, containsCode } from "@/lib/messageFormatter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { t } = useTranslation();
  const isUser = message.role === "user";
  const hasCode = containsCode(message.content);

  return (
    <div className={`flex gap-4 ${
      isUser ? 'justify-end' : 'justify-start'
    }`}>
      {!isUser && (
        <Avatar className="h-8 w-8 border-2 border-primary/20 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-sm">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`
        flex flex-col gap-2 max-w-[85%]
        ${isUser ? 'items-end' : 'items-start'}
      `}>
        <div className={`
          rounded-2xl px-4 py-3 shadow-sm hover-lift transition-all duration-200
          ${isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-md' 
            : 'bg-muted text-foreground rounded-tl-md border'
          }
          ${hasCode ? 'p-2' : ''}
        `}>
          <div className={`text-sm leading-relaxed ${
            hasCode ? '' : 'whitespace-pre-wrap'
          }`}>
            {isUser ? (
              // Mensagens do usuário mantém texto simples
              <span>{message.content}</span>
            ) : (
              // Mensagens da IA usam formatação completa
              <div className="ai-message-content">
                {formatMessage(message.content)}
              </div>
            )}
          </div>

          {message.imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border animate-image-load">
              <img 
                src={message.imageUrl} 
                alt={t('alt_texts.generated_by_ai')}
                className="w-full h-auto max-w-sm hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground px-1">
          {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 border-2 border-primary/20 flex-shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}