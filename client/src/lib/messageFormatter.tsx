
import React from "react";
import { CodeBlock } from "@/components/ui/code-block";

// Função para detectar e extrair blocos de código
function extractCodeBlocks(text: string) {
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Adiciona texto antes do bloco de código
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      });
    }

    // Adiciona o bloco de código
    parts.push({
      type: 'code',
      language: match[1] || '',
      content: match[2].trim()
    });

    lastIndex = codeBlockRegex.lastIndex;
  }

  // Adiciona o texto restante
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }

  return parts;
}

// Função para formatar texto com negrito e código inline
function formatText(text: string) {
  // Processa `código` (código inline)
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Processa **texto** (negrito forte)
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Processa *texto* (negrito simples) - evita conflito com **
  text = text.replace(/(?<!\*)\*(?!\*)([^*]+?)\*(?!\*)/g, '<strong>$1</strong>');
  
  return text;
}

// Função principal para processar a mensagem completa
export function formatMessage(content: string): React.ReactNode[] {
  const parts = extractCodeBlocks(content);
  
  return parts.map((part, index) => {
    if (part.type === 'code') {
      return (
        <CodeBlock
          key={index}
          code={part.content}
          language={part.language}
        />
      );
    } else {
      // Formatar texto com negrito e código inline
      const formattedText = formatText(part.content);
      
      return (
        <div 
          key={index}
          dangerouslySetInnerHTML={{ __html: formattedText }}
          className="whitespace-pre-wrap message-content"
        />
      );
    }
  });
}

// Função para detectar se uma mensagem contém código
export function containsCode(text: string): boolean {
  return /```[\s\S]*?```/.test(text);
}
