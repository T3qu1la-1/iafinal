
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Gamepad2, 
  Trophy, 
  Zap, 
  Heart, 
  Star, 
  Gift,
  Dice6,
  Music,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Target,
  Award,
  Sparkles,
  Rocket,
  Crown
} from "lucide-react";

interface FunFeaturesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FunFeatures({ isOpen, onClose }: FunFeaturesProps) {
  const { toast } = useToast();
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [level, setLevel] = useState(5);
  const [achievements, setAchievements] = useState([
    { id: 1, name: "Primeiro Chat", description: "Envie sua primeira mensagem", completed: true, points: 50 },
    { id: 2, name: "Maratonista", description: "Use o chat por 7 dias seguidos", completed: true, points: 200 },
    { id: 3, name: "Artista", description: "Gere 10 imagens", completed: false, points: 150, progress: 7 },
    { id: 4, name: "Conversador", description: "Envie 100 mensagens", completed: false, points: 100, progress: 84 },
    { id: 5, name: "Explorador", description: "Use 5 prompts diferentes", completed: true, points: 75 },
  ]);

  // Fun games and interactions
  const fortuneCookies = [
    "Sua criatividade florescerá hoje! 🌸",
    "Uma conversa interessante mudará sua perspectiva 💭",
    "Suas ideias brilharão como estrelas ⭐",
    "O conhecimento que você busca está próximo 📚",
    "Hoje é um dia perfeito para aprender algo novo 🎓",
    "Sua curiosidade será recompensada 🔍",
    "As melhores conversas estão por vir 💬",
  ];

  const dadingPhrases = [
    "Que tal um café virtual? ☕",
    "A IA está se sentindo criativa hoje! 🎨",
    "Hora de explorar novas ideias! 💡",
    "Seu nível de awesomeness: MÁXIMO! 🚀",
    "Plot twist: você é incrível! 🌟",
  ];

  const playVoiceResponse = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const generateFortune = () => {
    const fortune = fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)];
    toast({
      title: "🥠 Biscoito da Sorte",
      description: fortune,
      duration: 5000,
    });
    playVoiceResponse(fortune);
  };

  const rollDice = () => {
    const number = Math.floor(Math.random() * 6) + 1;
    const phrase = dadingPhrases[Math.floor(Math.random() * dadingPhrases.length)];
    toast({
      title: `🎲 Você tirou: ${number}`,
      description: phrase,
      duration: 4000,
    });
  };

  const getLevelProgress = () => {
    const pointsForCurrentLevel = (level - 1) * 200;
    const pointsForNextLevel = level * 200;
    const currentLevelPoints = totalPoints - pointsForCurrentLevel;
    const totalLevelPoints = pointsForNextLevel - pointsForCurrentLevel;
    return Math.min((currentLevelPoints / totalLevelPoints) * 100, 100);
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast({
        title: "🎵 Modo Foco Ativado",
        description: "Música ambiente para melhor concentração",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Centro de Diversão</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Interações divertidas e gamificação
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="gamification" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="gamification">Níveis</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              <TabsTrigger value="games">Jogos</TabsTrigger>
              <TabsTrigger value="voice">Voz & Som</TabsTrigger>
            </TabsList>

            <TabsContent value="gamification" className="space-y-6">
              {/* User Level */}
              <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Nível {level}</h3>
                        <p className="text-sm text-muted-foreground">Especialista em IA</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      {totalPoints} XP
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso para o nível {level + 1}</span>
                      <span>{Math.round(getLevelProgress())}%</span>
                    </div>
                    <Progress value={getLevelProgress()} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Streak */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="p-4">
                    <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Dias consecutivos</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-4">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">42</div>
                    <div className="text-sm text-muted-foreground">Conversas criadas</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-4">
                    <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">18</div>
                    <div className="text-sm text-muted-foreground">Imagens geradas</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`${achievement.completed ? 'bg-green-500/10 border-green-500/20' : 'bg-muted/50'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${achievement.completed ? 'bg-green-500' : 'bg-muted'}`}>
                          {achievement.completed ? (
                            <Trophy className="h-5 w-5 text-white" />
                          ) : (
                            <Target className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {!achievement.completed && achievement.progress && (
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progresso</span>
                                <span>{achievement.progress}/10</span>
                              </div>
                              <Progress value={(achievement.progress / 10) * 100} className="h-1" />
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={achievement.completed ? "default" : "secondary"}>
                        +{achievement.points} XP
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="games" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Gift className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Biscoito da Sorte</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Receba uma mensagem motivacional aleatória
                    </p>
                    <Button onClick={generateFortune} className="w-full">
                      Abrir Biscoito 🥠
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Dice6 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Dado da Sorte</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Role o dado e ganhe uma frase divertida
                    </p>
                    <Button onClick={rollDice} variant="outline" className="w-full">
                      Rolar Dado 🎲
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Gerador de Prompts</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ideias criativas para suas conversas
                    </p>
                    <Button variant="outline" className="w-full">
                      Gerar Prompt ✨
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Rocket className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Desafio Diário</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete tarefas e ganhe XP extra
                    </p>
                    <Button variant="outline" className="w-full">
                      Ver Desafio 🚀
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      Síntese de Voz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Respostas faladas</span>
                      <Button
                        variant={voiceEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                      >
                        {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={() => playVoiceResponse("Olá! Esta é uma demonstração da síntese de voz do Zero-Two AI.")}
                      variant="outline" 
                      className="w-full"
                      disabled={!voiceEnabled}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Testar Voz
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="h-5 w-5" />
                      Ambiente Sonoro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Música de foco</span>
                      <Button
                        variant={isPlaying ? "default" : "outline"}
                        size="sm"
                        onClick={toggleMusic}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Volume</div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
