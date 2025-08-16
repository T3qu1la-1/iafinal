
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Sparkles } from "lucide-react";

interface SystemPromptDialogProps {
  currentPrompt?: string;
  onSave: (prompt: string) => void;
  disabled?: boolean;
}

export default function SystemPromptDialog({ 
  currentPrompt = "", 
  onSave, 
  disabled = false 
}: SystemPromptDialogProps) {
  const [prompt, setPrompt] = useState(currentPrompt);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    try {
      await onSave(prompt);
      setOpen(false);
    } catch (error) {
      console.error("Erro ao salvar prompt:", error);
    }
  };

  const defaultPrompts = [
    {
      name: "Assistente Geral",
      prompt: "Você é um assistente IA prestativo e inteligente. Responda sempre em português brasileiro de forma clara e útil."
    },
    {
      name: "Professor",
      prompt: "Você é um professor experiente. Explique conceitos de forma didática, use exemplos práticos e incentive o aprendizado."
    },
    {
      name: "Programador",
      prompt: "Você é um programador sênior especializado. Foque em soluções de código, boas práticas e explicações técnicas detalhadas."
    },
    {
      name: "Criativo",
      prompt: "Você é um assistente criativo. Ajude com ideias inovadoras, brainstorming e soluções criativas para qualquer desafio."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="hover-lift h-8 text-xs"
        >
          <Settings className="h-3 w-3 mr-2" />
          Prompt do Sistema
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Configurar Prompt do Sistema
          </DialogTitle>
          <DialogDescription>
            Defina como a IA deve se comportar nesta conversa. O prompt do sistema ajuda a manter o foco e personalidade da IA.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="system-prompt">Prompt do Sistema</Label>
            <Textarea
              id="system-prompt"
              placeholder="Ex: Você é um especialista em marketing digital. Ajude com estratégias, campanhas e análises de performance..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-24 resize-none"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {prompt.length}/1000 caracteres
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm">Prompts Sugeridos</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {defaultPrompts.map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 text-left justify-start"
                  onClick={() => setPrompt(template.prompt)}
                >
                  <div>
                    <div className="font-medium text-xs">{template.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {template.prompt.slice(0, 60)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Prompt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
