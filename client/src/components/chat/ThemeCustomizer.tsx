
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Eye,
  Sparkles,
  Moon,
  Sun,
  Monitor
} from "lucide-react";

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const [theme, setTheme] = useState({
    name: "Custom Theme",
    mode: "dark",
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    accent: "#f59e0b",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    borderRadius: 8,
    fontSize: 14,
    animations: true,
    glassmorphism: true,
    gradients: true,
    shadows: true,
  });

  const presetThemes = [
    { name: "Cyberpunk", primary: "#ff00ff", secondary: "#00ffff", background: "#0a0a0a" },
    { name: "Ocean", primary: "#0ea5e9", secondary: "#06b6d4", background: "#0c4a6e" },
    { name: "Forest", primary: "#22c55e", secondary: "#84cc16", background: "#052e16" },
    { name: "Sunset", primary: "#f97316", secondary: "#ef4444", background: "#431407" },
    { name: "Royal", primary: "#8b5cf6", secondary: "#a855f7", background: "#312e81" },
    { name: "Monochrome", primary: "#6b7280", secondary: "#9ca3af", background: "#111827" },
  ];

  const handleColorChange = (key: string, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
    // Apply theme in real-time
    document.documentElement.style.setProperty(`--${key}`, value);
  };

  const applyPreset = (preset: any) => {
    setTheme(prev => ({ ...prev, ...preset }));
    Object.entries(preset).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value as string);
    });
  };

  const resetToLight = () => {
    const lightTheme = {
      name: "Tema Claro",
      mode: "light",
      primary: "#8b5cf6",
      secondary: "#06b6d4", 
      accent: "#f59e0b",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      borderRadius: 8,
      fontSize: 14,
      animations: true,
      glassmorphism: false,
      gradients: false,
      shadows: true,
    };
    
    setTheme(lightTheme);
    
    // Apply theme immediately
    document.documentElement.classList.remove('dark');
    Object.entries(lightTheme).forEach(([key, value]) => {
      if (typeof value === 'string' && key !== 'name' && key !== 'mode') {
        document.documentElement.style.setProperty(`--${key}`, value);
      }
    });
    
    // Store in localStorage
    localStorage.setItem('theme', 'light');
    localStorage.setItem('custom-theme', JSON.stringify(lightTheme));
  };

  const exportTheme = () => {
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    a.click();
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target?.result as string);
          setTheme(importedTheme);
        } catch (error) {
          alert('Erro ao importar tema. Verifique o formato do arquivo.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Customizar Tema</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Personalize a aparência do Zero-Two AI
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="colors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Cores</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="effects">Efeitos</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-16 h-10 border-0 p-1"
                    />
                    <Input
                      value={theme.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-16 h-10 border-0 p-1"
                    />
                    <Input
                      value={theme.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Cor de Destaque</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-16 h-10 border-0 p-1"
                    />
                    <Input
                      value={theme.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-16 h-10 border-0 p-1"
                    />
                    <Input
                      value={theme.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setTheme(prev => ({ ...prev, mode: 'dark' }))}
                  variant={theme.mode === 'dark' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Escuro
                </Button>
                <Button 
                  onClick={() => setTheme(prev => ({ ...prev, mode: 'light' }))}
                  variant={theme.mode === 'light' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Claro
                </Button>
                <Button 
                  onClick={() => setTheme(prev => ({ ...prev, mode: 'auto' }))}
                  variant={theme.mode === 'auto' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Auto
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Raio da Borda: {theme.borderRadius}px</Label>
                  <Slider
                    value={[theme.borderRadius]}
                    onValueChange={(value) => setTheme(prev => ({ ...prev, borderRadius: value[0] }))}
                    max={24}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Tamanho da Fonte: {theme.fontSize}px</Label>
                  <Slider
                    value={[theme.fontSize]}
                    onValueChange={(value) => setTheme(prev => ({ ...prev, fontSize: value[0] }))}
                    max={20}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Animações</Label>
                    <p className="text-sm text-muted-foreground">Efeitos de transição suaves</p>
                  </div>
                  <Switch
                    checked={theme.animations}
                    onCheckedChange={(checked) => setTheme(prev => ({ ...prev, animations: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Glassmorphism</Label>
                    <p className="text-sm text-muted-foreground">Efeito de vidro translúcido</p>
                  </div>
                  <Switch
                    checked={theme.glassmorphism}
                    onCheckedChange={(checked) => setTheme(prev => ({ ...prev, glassmorphism: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Gradientes</Label>
                    <p className="text-sm text-muted-foreground">Fundos com gradiente colorido</p>
                  </div>
                  <Switch
                    checked={theme.gradients}
                    onCheckedChange={(checked) => setTheme(prev => ({ ...prev, gradients: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Sombras</Label>
                    <p className="text-sm text-muted-foreground">Sombras profundas nos elementos</p>
                  </div>
                  <Switch
                    checked={theme.shadows}
                    onCheckedChange={(checked) => setTheme(prev => ({ ...prev, shadows: checked }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {presetThemes.map((preset) => (
                  <Card 
                    key={preset.name}
                    className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => applyPreset(preset)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white/20"
                          style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                        />
                        <span className="font-medium">{preset.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }} />
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.background }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-6 border-t">
            <Button onClick={exportTheme} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" className="flex-1 relative">
              <Upload className="h-4 w-4 mr-2" />
              Importar
              <input
                type="file"
                accept=".json"
                onChange={importTheme}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </Button>
            <Button className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Salvar Tema
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
