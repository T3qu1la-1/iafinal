
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, Database, Users, FileText } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/auth">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Política de Privacidade</h1>
              <p className="text-gray-400 text-sm">Catalyst IA - Última atualização: Janeiro 2025</p>
            </div>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Sua Privacidade é Nossa Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-100">
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-400" />
                1. Informações que Coletamos
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Informações de Conta:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nome de usuário</li>
                    <li>Endereço de email</li>
                    <li>Senha criptografada</li>
                    <li>Data de criação da conta</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Dados de Uso:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Conversas com a IA (para melhorar o serviço)</li>
                    <li>Imagens geradas e prompts utilizados</li>
                    <li>Configurações de preferências</li>
                    <li>Logs de acesso e atividade</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Informações Técnicas:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Dados de performance e erro</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-400" />
                2. Como Usamos Suas Informações
              </h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Fornecimento do Serviço:</strong> Utilizamos suas informações para operar, manter e 
                  melhorar os serviços do Catalyst IA.
                </p>
                <p className="leading-relaxed">
                  <strong>Personalização:</strong> Adaptamos a experiência com base em suas preferências e 
                  histórico de uso.
                </p>
                <p className="leading-relaxed">
                  <strong>Comunicação:</strong> Enviamos notificações importantes sobre sua conta e atualizações 
                  do serviço.
                </p>
                <p className="leading-relaxed">
                  <strong>Segurança:</strong> Monitoramos atividades suspeitas e protegemos contra abuso.
                </p>
                <p className="leading-relaxed">
                  <strong>Desenvolvimento:</strong> Analisamos dados agregados e anonimizados para melhorar 
                  nossos algoritmos de IA.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-400" />
                3. Proteção de Dados
              </h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Criptografia:</strong> Todos os dados são criptografados em trânsito e em repouso 
                  usando padrões industriais.
                </p>
                <p className="leading-relaxed">
                  <strong>Acesso Restrito:</strong> Apenas pessoal autorizado tem acesso aos dados dos usuários, 
                  e apenas quando necessário.
                </p>
                <p className="leading-relaxed">
                  <strong>Segurança de Infraestrutura:</strong> Utilizamos servidores seguros com monitoramento 
                  24/7 e backups regulares.
                </p>
                <p className="leading-relaxed">
                  <strong>Anonimização:</strong> Dados analíticos são processados de forma anonimizada sempre 
                  que possível.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-400" />
                4. Compartilhamento de Informações
              </h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Não Vendemos Dados:</strong> Nunca vendemos, alugamos ou comercializamos suas 
                  informações pessoais.
                </p>
                <p className="leading-relaxed">
                  <strong>Fornecedores de Serviço:</strong> Podemos compartilhar dados com prestadores de 
                  serviços terceirizados que nos ajudam a operar nossos serviços, sempre sob contratos 
                  rigorosos de confidencialidade.
                </p>
                <p className="leading-relaxed">
                  <strong>Requisitos Legais:</strong> Podemos divulgar informações quando exigido por lei ou 
                  para proteger nossos direitos legais.
                </p>
                <p className="leading-relaxed">
                  <strong>Transferência de Negócios:</strong> Em caso de fusão ou aquisição, os dados podem 
                  ser transferidos, mas continuarão protegidos por esta política.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Seus Direitos</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">Acesso aos Dados:</h3>
                  <p className="text-sm">Solicite uma cópia de todos os dados que temos sobre você.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">Correção:</h3>
                  <p className="text-sm">Corrija informações incorretas ou desatualizadas.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">Exclusão:</h3>
                  <p className="text-sm">Solicite a exclusão de sua conta e dados associados.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">Portabilidade:</h3>
                  <p className="text-sm">Exporte seus dados em formato legível por máquina.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Cookies e Tecnologias Similares</h2>
              <p className="leading-relaxed">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, lembrar suas 
                preferências e analisar o uso do serviço. Você pode controlar o uso de cookies através 
                das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Retenção de Dados</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Dados de Conta:</strong> Mantidos enquanto sua conta estiver ativa ou conforme 
                  necessário para fornecer serviços.
                </p>
                <p className="leading-relaxed">
                  <strong>Conversas:</strong> Armazenadas para permitir continuidade das conversas e melhorar 
                  o serviço, com opção de exclusão pelo usuário.
                </p>
                <p className="leading-relaxed">
                  <strong>Logs de Sistema:</strong> Mantidos por até 90 dias para fins de segurança e debug.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Menores de Idade</h2>
              <p className="leading-relaxed">
                Nossos serviços não são destinados a menores de 13 anos. Não coletamos intencionalmente 
                informações pessoais de crianças menores de 13 anos. Se tomarmos conhecimento de tal coleta, 
                excluiremos essas informações imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Transferências Internacionais</h2>
              <p className="leading-relaxed">
                Seus dados podem ser processados em servidores localizados fora do seu país de residência. 
                Garantimos que todas as transferências são realizadas com salvaguardas adequadas para 
                proteger sua privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Atualizações desta Política</h2>
              <p className="leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre 
                mudanças significativas através do serviço ou por email. O uso continuado após as 
                alterações constitui aceitação da nova política.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Contato</h2>
              <p className="leading-relaxed">
                Para questões sobre privacidade, exercer seus direitos ou reportar preocupações, 
                entre em contato através do sistema de suporte integrado na plataforma.
              </p>
            </section>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-8">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Compromisso com a Privacidade</h3>
                  <p className="text-sm text-gray-300">
                    Estamos comprometidos em proteger sua privacidade e ser transparentes sobre como 
                    usamos seus dados. Esta política é revisada regularmente para garantir conformidade 
                    com as melhores práticas e regulamentações aplicáveis.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
