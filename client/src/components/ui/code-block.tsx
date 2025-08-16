
import React, { useState } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Card } from "./card";
import { Copy, Edit, Check, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "", className }: CodeBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(isEditing ? editedCode : code);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "O código foi copiado para sua área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Alterações salvas",
      description: "Suas modificações foram aplicadas.",
    });
  };

  const handleCancel = () => {
    setEditedCode(code);
    setIsEditing(false);
  };

  return (
    <Card className={cn("my-4 overflow-hidden", className)}>
      {/* Header do terminal */}
      <div className="flex items-center justify-between bg-gray-900 text-gray-100 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {language && (
            <span className="ml-3 text-gray-300 font-mono">
              {language.toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-8 px-2 text-green-400 hover:text-green-300 hover:bg-gray-700"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo do código */}
      <div className="bg-gray-950 text-gray-100">
        {isEditing ? (
          <Textarea
            value={editedCode}
            onChange={(e) => setEditedCode(e.target.value)}
            className="min-h-[200px] bg-gray-950 text-gray-100 border-0 font-mono text-sm leading-relaxed resize-none focus:ring-0"
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
            }}
          />
        ) : (
          <pre className="p-4 overflow-x-auto">
            <code 
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
              }}
            >
              {isEditing ? editedCode : code}
            </code>
          </pre>
        )}
      </div>
    </Card>
  );
}
