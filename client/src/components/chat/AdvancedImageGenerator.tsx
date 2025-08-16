
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Image as ImageIcon, 
  Palette, 
  Settings, 
  Wand2, 
  Download,
  Heart,
  Share2,
  Copy,
  Sparkles,
  Camera,
  Brush,
  Zap,
  Crown,
  Grid3X3,
  Layers,
  Filter
} from "lucide-react";

interface AdvancedImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: any) => void;
}

export default function AdvancedImageGenerator({ isOpen, onClose, onGenerate }: AdvancedImageGeneratorProps) {
  const { toast } = useToast();
  
  const [params, setParams] = useState({
    prompt: "",
    negativePrompt: "",
    style: "realistic",
    ratio: "1:1",
    quality: "standard",
    steps: 20,
    scale: 7.5,
    seed: -1,
    batch: 1,
    model: "sdxl",
    sampler: "euler_a",
    upscale: false,
    faceRestore: false,
    prompt_magic: true,
  });

  const styles = [
    { id: "realistic", name: "Realista", description: "Fotos ultra-realistas", preview: "🏞️" },
    { id: "artistic", name: "Artístico", description: "Arte conceitual e pinturas", preview: "🎨" },
    { id: "anime", name: "Anime", description: "Estilo anime e mangá", preview: "👾" },
    { id: "cartoon", name: "Cartoon", description: "Desenho animado", preview: "🎪" },
    { id: "cyberpunk", name: "Cyberpunk", description: "Futuro neon", preview: "🌃" },
    { id: "fantasy", name: "Fantasia", description: "Mundo mágico", preview: "🧙‍♂️" },
    { id: "horror", name: "Terror", description: "Atmosfera sombria", preview: "👻" },
    { id: "minimalist", name: "Minimalista", description: "Design limpo", preview: "⚪" },
  ];

  const ratios = [
    { id: "1:1", name: "Quadrado", width: 1024, height: 1024 },
    { id: "16:9", name: "Paisagem", width: 1344, height: 768 },
    { id: "9:16", name: "Retrato", width: 768, height: 1344 },
    { id: "4:3", name: "Foto", width: 1152, height: 896 },
    { id: "3:4", name: "Retrato Foto", width: 896, height: 1152 },
    { id: "21:9", name: "Ultrawide", width: 1536, height: 640 },
  ];

  const models = [
    { id: "sdxl", name: "SDXL Turbo", description: "Rápido e de alta qualidade" },
    { id: "sd15", name: "Stable Diffusion 1.5", description: "Clássico e confiável" },
    { id: "sd21", name: "Stable Diffusion 2.1", description: "Versão aprimorada" },
    { id: "dalle", name: "DALL-E 3", description: "GPT para imagens" },
    { id: "midjourney", name: "Midjourney", description: "Qualidade artística" },
  ];

  const promptTemplates = [
    {
      name: "Retrato Profissional",
      prompt: "professional headshot of [subject], clean background, studio lighting, high resolution, sharp focus",
      style: "realistic"
    },
    {
      name: "Paisagem Épica",
      prompt: "epic landscape, dramatic lighting, cinematic, ultra wide shot, 8k resolution, highly detailed",
      style: "realistic"
    },
    {
      name: "Arte Conceitual",
      prompt: "[subject] concept art, digital painting, dramatic lighting, vibrant colors, trending on artstation",
      style: "artistic"
    },
    {
      name: "Personagem Anime",
      prompt: "anime character [description], cel shading, vibrant colors, detailed, studio quality",
      style: "anime"
    },
  ];

  const generateRandomSeed = () => {
    const seed = Math.floor(Math.random() * 1000000);
    setParams(prev => ({ ...prev, seed }));
  };

  const applyTemplate = (template: any) => {
    setParams(prev => ({
      ...prev,
      prompt: template.prompt,
      style: template.style
    }));
  };

  const handleGenerate = () => {
    if (!params.prompt.trim()) {
      toast({
        title: "Prompt obrigatório",
        description: "Digite uma descrição para gerar a imagem.",
        variant: "destructive",
      });
      return;
    }

    const selectedRatio = ratios.find(r => r.id === params.ratio);
    
    const generationParams = {
      ...params,
      width: selectedRatio?.width || 1024,
      height: selectedRatio?.height || 1024,
    };

    onGenerate(generationParams);
    
    toast({
      title: "🎨 Gerando imagem...",
      description: "Sua imagem está sendo criada com os parâmetros avançados.",
    });
  };

  const enhancePrompt = () => {
    // AI-powered prompt enhancement
    const enhancedPrompt = params.prompt + ", highly detailed, professional quality, stunning, masterpiece";
    setParams(prev => ({ ...prev, prompt: enhancedPrompt }));
    
    toast({
      title: "✨ Prompt aprimorado!",
      description: "Adicionamos termos para melhorar a qualidade.",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Gerar Imagens</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Crie imagens incríveis totalmente grátis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Gratuito
              </Badge>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            
            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Descreva a imagem que você quer gerar</Label>
              <Textarea
                id="prompt"
                data-testid="input-image-prompt"
                value={params.prompt}
                onChange={(e) => setParams(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="Uma paisagem bonita com montanhas ao pôr do sol..."
                className="min-h-[120px] resize-none"
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {params.prompt.length}/1000 caracteres
                </p>
                <Button variant="outline" size="sm" onClick={enhancePrompt}>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Aprimorar Prompt
                </Button>
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-3">
              <Label>Estilo da Imagem</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {styles.map((style) => (
                  <Card
                    key={style.id}
                    className={`cursor-pointer transition-all ${
                      params.style === style.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setParams(prev => ({ ...prev, style: style.id }))}
                    data-testid={`style-${style.id}`}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl mb-2">{style.preview}</div>
                      <div className="font-medium text-sm">{style.name}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <Label>Tamanho da Imagem</Label>
              <Select value={params.ratio} onValueChange={(value) => setParams(prev => ({ ...prev, ratio: value }))}>
                <SelectTrigger data-testid="select-image-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ratios.map((ratio) => (
                    <SelectItem key={ratio.id} value={ratio.id}>
                      {ratio.name} ({ratio.width}x{ratio.height})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button 
                onClick={handleGenerate} 
                className="flex-1 h-12"
                disabled={!params.prompt.trim()}
                data-testid="button-generate-image"
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                Gerar Imagem
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
