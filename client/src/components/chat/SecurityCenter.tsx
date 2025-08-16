import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  Smartphone,
  AlertTriangle,
  CheckCircle,
  History,
  Download,
  Trash2,
  Globe,
  UserX,
  Settings,
  FileText,
  Zap,
  Database,
  Wifi,
  Server,
  QrCode,
  Fingerprint
} from "lucide-react";

interface SecurityCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecurityCenter({ isOpen, onClose }: SecurityCenterProps) {
  const { toast } = useToast();
  
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    encryptionEnabled: true,
    privateMode: false,
    biometricAuth: false,
    sessionTimeout: 30,
    dataRetention: 90,
    analyticsEnabled: false,
    crashReporting: true,
  });

  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const [biometricDevices, setBiometricDevices] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<any[]>([
    { id: 1, timestamp: "2024-01-20 14:30", device: "Chrome - Windows", location: "São Paulo, BR", status: "success" },
    { id: 2, timestamp: "2024-01-20 09:15", device: "iPhone App", location: "São Paulo, BR", status: "success" },
    { id: 3, timestamp: "2024-01-19 22:45", device: "Chrome - Windows", location: "São Paulo, BR", status: "success" },
    { id: 4, timestamp: "2024-01-19 18:30", device: "Unknown Device", location: "Rio de Janeiro, BR", status: "blocked" },
  ]);

  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome - Windows", location: "São Paulo, BR", lastActive: "Agora", current: true },
    { id: 2, device: "Safari - iPhone", location: "São Paulo, BR", lastActive: "2h atrás", current: false },
    { id: 3, device: "Edge - Windows", location: "Rio de Janeiro, BR", lastActive: "1d atrás", current: false },
  ]);

  useEffect(() => {
    if (isOpen) {
      loadSecurityData();
    }
  }, [isOpen]);

  const loadSecurityData = async () => {
    try {
      // Simulação de carregamento de dados de segurança
      setLoading(true);
      // Em produção, esta seria uma chamada real para a API
      setTimeout(() => {
        setBiometricDevices([
          { id: '1', name: 'iPhone Touch ID', deviceType: 'mobile', createdAt: new Date() },
          { id: '2', name: 'Windows Hello', deviceType: 'desktop', createdAt: new Date() }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading security data:', error);
      setLoading(false);
    }
  };

  const setup2FA = async () => {
    setLoading(true);
    try {
      // Simulação de configuração 2FA
      setTimeout(() => {
        setQrCodeUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        setShowSetup2FA(true);
        setLoading(false);
        toast({
          title: "Configuração 2FA",
          description: "Use o Google Authenticator ou app similar para escanear o QR Code",
        });
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro",
        description: "Erro ao configurar 2FA",
        variant: "destructive",
      });
    }
  };

  const enable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Erro",
        description: "Digite um código de 6 dígitos válido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulação de ativação 2FA
      setTimeout(() => {
        setSecurity(prev => ({ ...prev, twoFactorEnabled: true }));
        setShowSetup2FA(false);
        setVerificationCode('');
        setLoading(false);
        toast({
          title: "Sucesso!",
          description: "2FA ativado com sucesso. Sua conta está mais segura!",
        });
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro",
        description: "Código inválido. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setSecurity(prev => ({ ...prev, twoFactorEnabled: false }));
        setLoading(false);
        toast({
          title: "2FA Desativado",
          description: "Autenticação de dois fatores foi desativada",
        });
      }, 500);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro",
        description: "Erro ao desativar 2FA",
        variant: "destructive",
      });
    }
  };

  const registerBiometric = async () => {
    setLoading(true);
    try {
      // Simulação de registro biométrico
      setTimeout(() => {
        setSecurity(prev => ({ ...prev, biometricAuth: true }));
        setBiometricDevices(prev => [...prev, {
          id: String(Date.now()),
          name: `${navigator.platform} - Biometric`,
          deviceType: 'biometric',
          createdAt: new Date()
        }]);
        setLoading(false);
        toast({
          title: "Sucesso!",
          description: "Autenticação biométrica configurada com sucesso!",
        });
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro",
        description: "Falha ao registrar dispositivo biométrico. Verifique se seu dispositivo suporta WebAuthn.",
        variant: "destructive",
      });
    }
  };

  const removeDevice = async (deviceId: string) => {
    try {
      setBiometricDevices(prev => prev.filter(device => device.id !== deviceId));
      toast({
        title: "Sucesso!",
        description: "Dispositivo removido com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao remover dispositivo",
        variant: "destructive",
      });
    }
  };

  const revokeSession = (sessionId: number) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    toast({
      title: "Sessão revogada",
      description: "A sessão foi finalizada com sucesso.",
    });
  };

  const exportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados serão exportados e enviados por email em até 24 horas.",
    });
  };

  const deleteAccount = () => {
    if (window.confirm("ATENÇÃO: Esta ação é irreversível. Tem certeza que deseja excluir sua conta?")) {
      toast({
        title: "Conta agendada para exclusão",
        description: "Sua conta será excluída em 30 dias. Você pode cancelar até lá.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Central de Segurança</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Proteja sua conta e dados pessoais com segurança avançada
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                {security.twoFactorEnabled || security.biometricAuth ? 'Muito Seguro' : 'Seguro'}
              </Badge>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="security" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="biometric">Biometria</TabsTrigger>
              <TabsTrigger value="privacy">Privacidade</TabsTrigger>
              <TabsTrigger value="sessions">Sessões</TabsTrigger>
              <TabsTrigger value="data">Dados</TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="space-y-6">
              {/* Security Status */}
              <Alert className={`border-${security.twoFactorEnabled ? 'green' : 'yellow'}-500/20 bg-${security.twoFactorEnabled ? 'green' : 'yellow'}-500/10`}>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Nível de segurança: <strong>{security.twoFactorEnabled ? 'Muito Alto' : 'Médio'}</strong>
                  {!security.twoFactorEnabled && ' - Recomendamos ativar 2FA para máxima proteção'}
                </AlertDescription>
              </Alert>

              {/* Two-Factor Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Autenticação de Dois Fatores (2FA)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA via Aplicativo Autenticador</p>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma camada extra de proteção com Google Authenticator
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        if (checked) setup2FA();
                        else disable2FA();
                      }}
                      disabled={loading}
                    />
                  </div>
                  
                  {!security.twoFactorEnabled && !showSetup2FA && (
                    <Button onClick={setup2FA} disabled={loading} className="w-full">
                      <Key className="h-4 w-4 mr-2" />
                      {loading ? 'Configurando...' : 'Configurar 2FA'}
                    </Button>
                  )}

                  {showSetup2FA && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="text-center">
                        <QrCode className="h-32 w-32 mx-auto mb-4 p-4 border rounded-lg" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Escaneie com Google Authenticator, Authy ou app similar
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Código de Verificação (6 dígitos)</Label>
                        <Input
                          type="text"
                          placeholder="000000"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={enable2FA} 
                          disabled={loading || verificationCode.length !== 6}
                          className="flex-1"
                        >
                          {loading ? 'Verificando...' : 'Ativar 2FA'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowSetup2FA(false)}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Encryption */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Criptografia End-to-End
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mensagens criptografadas</p>
                      <p className="text-sm text-muted-foreground">
                        Suas conversas são protegidas com AES-256
                      </p>
                    </div>
                    <Switch
                      checked={security.encryptionEnabled}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, encryptionEnabled: checked }))}
                    />
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Criptografia ativada protege suas mensagens contra interceptação
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Session Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Configurações de Sessão
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Timeout automático (minutos)</Label>
                    <Input
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                      min="5"
                      max="120"
                    />
                    <p className="text-xs text-muted-foreground">
                      Sessão será finalizada automaticamente após inatividade
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="biometric" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="h-5 w-5" />
                    Autenticação Biométrica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">WebAuthn / FIDO2</p>
                      <p className="text-sm text-muted-foreground">
                        Use impressão digital, Face ID ou chave de segurança
                      </p>
                    </div>
                    <Switch
                      checked={security.biometricAuth}
                      onCheckedChange={(checked) => {
                        if (checked) registerBiometric();
                        else setSecurity(prev => ({ ...prev, biometricAuth: false }));
                      }}
                      disabled={loading}
                    />
                  </div>

                  {!security.biometricAuth && (
                    <Button onClick={registerBiometric} disabled={loading} className="w-full">
                      <Fingerprint className="h-4 w-4 mr-2" />
                      {loading ? 'Registrando...' : 'Registrar Dispositivo Biométrico'}
                    </Button>
                  )}

                  {biometricDevices.length > 0 && (
                    <div className="space-y-2">
                      <Label>Dispositivos Registrados</Label>
                      {biometricDevices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">{device.deviceType}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeDevice(device.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              {/* Privacy Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <EyeOff className="h-5 w-5" />
                    Configurações de Privacidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Modo Privado</p>
                      <p className="text-sm text-muted-foreground">
                        Conversas não são salvas no histórico
                      </p>
                    </div>
                    <Switch
                      checked={security.privateMode}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, privateMode: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Relatórios de Erro</p>
                      <p className="text-sm text-muted-foreground">
                        Ajude a melhorar o app enviando relatórios anônimos
                      </p>
                    </div>
                    <Switch
                      checked={security.crashReporting}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, crashReporting: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Data Retention */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Retenção de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Manter dados por (dias)</Label>
                    <Input
                      type="number"
                      value={security.dataRetention}
                      onChange={(e) => setSecurity(prev => ({ ...prev, dataRetention: parseInt(e.target.value) || 90 }))}
                      min="7"
                      max="365"
                    />
                    <p className="text-xs text-muted-foreground">
                      Dados serão automaticamente removidos após este período
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Sessões Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.location} • {session.lastActive}
                            {session.current && " • Sessão atual"}
                          </p>
                        </div>
                        {!session.current && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => revokeSession(session.id)}
                          >
                            Revogar
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Seus Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button onClick={exportData} variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar todos os dados
                    </Button>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        A exportação inclui: conversas, configurações e dados de perfil
                      </AlertDescription>
                    </Alert>
                  </div>

                  <hr className="my-6" />

                  <div className="space-y-3">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Zona de Perigo</h4>
                      <p className="text-sm text-red-600 dark:text-red-300 mb-3">
                        Esta ação não pode ser desfeita
                      </p>
                      <Button
                        onClick={deleteAccount}
                        variant="destructive"
                        className="w-full"
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Excluir Conta Permanentemente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}