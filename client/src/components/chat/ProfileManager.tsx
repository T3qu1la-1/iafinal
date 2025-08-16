
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Camera, 
  Upload, 
  Save, 
  Crown, 
  Shield, 
  Sparkles,
  Eye,
  EyeOff,
  Edit3
} from "lucide-react";

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileManager({ isOpen, onClose }: ProfileManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    username: user?.username || "",
    email: user?.email || "",
    plan: user?.plan || "free",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A foto deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create preview using FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewAvatar(result);
        setProfile(prev => ({ ...prev, avatar: result }));
        setIsUploading(false);
        
        toast({
          title: "Foto carregada",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        toast({
          title: "Erro no upload",
          description: "Não foi possível carregar a imagem.",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da foto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    setProfile(prev => ({ ...prev, avatar: avatarUrl }));
  };

  const saveProfile = async () => {
    try {
      // Here you would make an API call to save the profile
      toast({
        title: "Perfil salvo!",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500"><Crown className="h-3 w-3 mr-1" />Premium</Badge>;
      case 'pro':
        return <Badge className="bg-gradient-to-r from-orange-500 to-red-500"><Sparkles className="h-3 w-3 mr-1" />Pro</Badge>;
      default:
        return <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" />Gratuito</Badge>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Meu Perfil</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas informações pessoais
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage 
                  src={previewAvatar || profile.avatar} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
                  {profile.name?.[0] || profile.username?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                </div>
              )}
              
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateRandomAvatar}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Aleatório
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />

            <div className="flex items-center gap-2">
              {getPlanBadge(profile.plan)}
              <Badge variant="outline" className="text-xs">
                Desde {new Date(user?.createdAt || Date.now()).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  value={profile.username}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Conte um pouco sobre você..."
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {profile.bio.length}/500 caracteres
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">42</div>
              <div className="text-xs text-muted-foreground">Conversas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1.2k</div>
              <div className="text-xs text-muted-foreground">Mensagens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">18</div>
              <div className="text-xs text-muted-foreground">Imagens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">7d</div>
              <div className="text-xs text-muted-foreground">Tempo online</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={saveProfile}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
