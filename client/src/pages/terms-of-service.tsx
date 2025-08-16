
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Shield, Users } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfServicePage() {
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
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Termos de Serviço</h1>
              <p className="text-gray-400 text-sm">Catalyst IA - Última atualização: Janeiro 2025</p>
            </div>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Bem-vindo aos Termos de Serviço do Catalyst IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-100">
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                1. Aceitação dos Termos
              </h2>
              <p className="leading-relaxed">
                Ao acessar e usar o Catalyst IA, você concorda em cumprir e estar vinculado a estes Termos de Serviço. 
                Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Descrição do Serviço</h2>
              <p className="leading-relaxed mb-3">
                O Catalyst IA é uma plataforma de inteligência artificial que oferece:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Conversas interativas com IA avançada</li>
                <li>Geração de imagens através de descrições textuais</li>
                <li>Ferramentas de produtividade e criatividade</li>
                <li>Interface personalalizável e recursos colaborativos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Conta de Usuário</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Responsabilidades:</strong> Você é responsável por manter a confidencialidade de sua conta 
                  e senha, e por todas as atividades que ocorrem sob sua conta.
                </p>
                <p className="leading-relaxed">
                  <strong>Informações Precisas:</strong> Você concorda em fornecer informações precisas, atuais e 
                  completas durante o processo de registro.
                </p>
                <p className="leading-relaxed">
                  <strong>Uso Pessoal:</strong> Sua conta é para uso pessoal e não pode ser compartilhada com terceiros.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Uso Aceitável</h2>
              <p className="leading-relaxed mb-3">Você concorda em NÃO usar o serviço para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Atividades ilegais ou que violem leis locais, estaduais, nacionais ou internacionais</li>
                <li>Criar ou disseminar conteúdo ofensivo, difamatório, discriminatório ou prejudicial</li>
                <li>Interferir ou interromper os serviços ou servidores conectados aos serviços</li>
                <li>Tentar acessar contas de outros usuários ou áreas restritas do sistema</li>
                <li>Usar o serviço para spam, phishing ou outras atividades maliciosas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Conteúdo Gerado</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Propriedade:</strong> Você mantém os direitos sobre o conteúdo que cria usando nossos serviços.
                </p>
                <p className="leading-relaxed">
                  <strong>Licença:</strong> Ao usar nossos serviços, você nos concede uma licença limitada para processar 
                  e armazenar seu conteúdo conforme necessário para fornecer os serviços.
                </p>
                <p className="leading-relaxed">
                  <strong>Responsabilidade:</strong> Você é responsável pelo conteúdo que gera e deve garantir que 
                  não viole direitos de terceiros.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Privacidade e Dados</h2>
              <p className="leading-relaxed">
                Seus dados pessoais são tratados de acordo com nossa 
                <Link href="/privacy-policy">
                  <span className="text-blue-400 hover:text-blue-300 underline cursor-pointer">
                    Política de Privacidade
                  </span>
                </Link>
                , que faz parte integrante destes Termos de Serviço.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Limitação de Responsabilidade</h2>
              <p className="leading-relaxed">
                O Catalyst IA é fornecido "como está" e "conforme disponível". Não garantimos que o serviço 
                será ininterrupto, livre de erros ou completamente seguro. Nossa responsabilidade é limitada 
                ao máximo permitido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Modificações dos Termos</h2>
              <p className="leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão 
                em vigor imediatamente após a publicação. O uso continuado dos serviços após as alterações 
                constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Suspensão e Encerramento</h2>
              <p className="leading-relaxed">
                Podemos suspender ou encerrar sua conta a qualquer momento, com ou sem aviso, por violação 
                destes termos ou por qualquer outro motivo que consideremos apropriado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Contato</h2>
              <p className="leading-relaxed">
                Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco através do 
                sistema de suporte integrado na plataforma.
              </p>
            </section>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-8">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Compromisso com a Transparência</h3>
                  <p className="text-sm text-gray-300">
                    Estamos comprometidos em fornecer um serviço transparente, seguro e confiável. 
                    Estes termos são projetados para proteger tanto você quanto nossos serviços.
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
