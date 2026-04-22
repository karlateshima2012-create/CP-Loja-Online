
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Lock, Scale, AlertCircle, HelpCircle, ArrowLeft } from 'lucide-react';

export const LegalDocs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'privacy') {
      setActiveTab('privacy');
    } else {
      setActiveTab('terms');
    }
    window.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 pb-20 pt-8 animate-fade-in">
      
      {/* Header */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Scale size={14} /> Central Jurídica
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-6">
          Termos & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-pink">Privacidade</span>
        </h1>
        <p className="text-brand-gray max-w-2xl mx-auto text-lg">
          Transparência total sobre como operamos, como cuidamos dos seus dados e as regras da nossa parceria.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 mb-8 sticky top-24 z-30 shadow-2xl">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-4 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${
              activeTab === 'terms'
                ? 'bg-slate-800 text-white shadow-lg border border-slate-700'
                : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText size={18} className={activeTab === 'terms' ? 'text-brand-blue' : ''} />
            Termos de Uso
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-4 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${
              activeTab === 'privacy'
                ? 'bg-slate-800 text-white shadow-lg border border-slate-700'
                : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Lock size={18} className={activeTab === 'privacy' ? 'text-brand-pink' : ''} />
            Política de Privacidade
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12 shadow-xl">
          
          {activeTab === 'terms' && (
            <div className="prose prose-invert prose-slate max-w-none animate-fade-in">
              <h2 className="text-white font-bold text-2xl flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                <FileText className="text-brand-blue" /> Termos e Condições de Uso
              </h2>
              
              <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
                <p>
                  Bem-vindo à <strong>Creative Print</strong>. Ao acessar nosso site, adquirir nossos produtos ou utilizar nossos serviços digitais (incluindo a plataforma CreativeFlix), você concorda com os termos descritos abaixo.
                </p>

                <h3 className="text-white font-bold text-lg mt-8">1. Sobre os Produtos Personalizados</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Natureza do Produto:</strong> Nossos produtos (cartões NFC, displays, itens 3D) são produzidos sob demanda. Pequenas variações de cor e acabamento são inerentes ao processo de impressão 3D e não constituem defeito.</li>
                  <li><strong>Aprovação de Arte:</strong> Para itens personalizados, o cliente deve fornecer os arquivos (Logo, QR Code) e aprovar a prova digital enviada. A Creative Print não se responsabiliza por erros ortográficos ou de design após a aprovação final do cliente.</li>
                  <li><strong>Tecnologia NFC:</strong> Utilizamos chips padrão de mercado (NTAG215). A compatibilidade depende do dispositivo do usuário final (celular de quem recebe o cartão). Não garantimos funcionamento em aparelhos antigos sem suporte a NFC.</li>
                </ul>

                <h3 className="text-white font-bold text-lg mt-8">2. Prazos e Entregas</h3>
                <p>
                  Operamos no Japão. Os prazos de produção variam de 3 a 7 dias úteis após a confirmação do pagamento e aprovação da arte. O envio é realizado via Japan Post ou Kuroneko Yamato. Não nos responsabilizamos por atrasos decorrentes de catástrofes naturais ou falhas operacionais das transportadoras, embora prestemos todo suporte necessário.
                </p>

                <h3 className="text-white font-bold text-lg mt-8">3. Serviços Digitais (CreativeFlix & Sites)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Disponibilidade:</strong> Garantimos 99% de uptime para as páginas digitais hospedadas em nossa infraestrutura.</li>
                  <li><strong>Conteúdo:</strong> O cliente é inteiramente responsável pelo conteúdo, links e imagens inseridos em sua página digital. A Creative Print reserva-se o direito de suspender páginas que violem leis japonesas ou direitos autorais.</li>
                  <li><strong>Planos:</strong> O plano "Vitalício" refere-se à vida útil do produto físico ou da plataforma. Reservamo-nos o direito de alterar funcionalidades dos planos gratuitos mediante aviso prévio.</li>
                </ul>

                <h3 className="text-white font-bold text-lg mt-8">4. Política de Trocas e Devoluções</h3>
                <p>
                  Conforme o Código Comercial do Japão (Tokutei Sho-torihiki Ho), produtos personalizados não são elegíveis para devolução por arrependimento, pois não podem ser revendidos. Aceitamos trocas apenas em caso de defeito de fabricação comprovado em até 7 dias após o recebimento.
                </p>

                <h3 className="text-white font-bold text-lg mt-8">5. Marketplace e Parceiros</h3>
                <p>
                  Produtos marcados como "Vendido por [Parceiro]" são de responsabilidade comercial do parceiro indicado. A Creative Print atua como plataforma de tecnologia, produção e facilitação de pagamento.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="prose prose-invert prose-slate max-w-none animate-fade-in">
              <h2 className="text-white font-bold text-2xl flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                <ShieldCheck className="text-brand-pink" /> Política de Privacidade
              </h2>

              <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 flex gap-4">
                   <AlertCircle className="text-brand-pink shrink-0" />
                   <p className="text-xs">
                     A <strong>Creative Print</strong> respeita sua privacidade e segue as diretrizes da Lei de Proteção de Informações Pessoais do Japão (Kojin Joho Hogo Ho).
                   </p>
                </div>

                <h3 className="text-white font-bold text-lg mt-8">1. Coleta de Dados</h3>
                <p>Coletamos apenas as informações essenciais para a prestação dos nossos serviços:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Dados de Identificação:</strong> Nome, telefone e e-mail para contato e criação de conta.</li>
                  <li><strong>Dados de Entrega:</strong> Endereço completo e código postal para envio dos produtos físicos.</li>
                  <li><strong>Dados Financeiros:</strong> Para parceiros, coletamos dados bancários para repasse de comissões. Para clientes, os pagamentos são processados por gateways externos (Square, PayPay), não armazenamos números de cartão de crédito.</li>
                </ul>

                <h3 className="text-white font-bold text-lg mt-8">2. Uso das Informações</h3>
                <p>Seus dados são utilizados exclusivamente para:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Processar e enviar seus pedidos.</li>
                  <li>Gerenciar sua página digital no Creative Print Connect.</li>
                  <li>Comunicar status de produção e entrega.</li>
                  <li>Realizar pagamentos de comissões (no caso de Parceiros).</li>
                </ul>

                <h3 className="text-white font-bold text-lg mt-8">3. Compartilhamento de Dados</h3>
                <p>
                  Não vendemos nem alugamos seus dados. Compartilhamos informações apenas com prestadores de serviço essenciais para a operação, como empresas de logística (Japan Post/Kuroneko) para a entrega do seu pedido.
                </p>

                <h3 className="text-white font-bold text-lg mt-8">4. Segurança</h3>
                <p>
                  Utilizamos criptografia SSL em todas as transações e armazenamos senhas de forma hash (criptografada). Nossos bancos de dados são protegidos contra acesso não autorizado.
                </p>

                <h3 className="text-white font-bold text-lg mt-8">5. Seus Direitos</h3>
                <p>
                  Você tem o direito de solicitar a visualização, correção ou exclusão dos seus dados pessoais armazenados em nossos sistemas a qualquer momento. Para isso, entre em contato através do email: <strong>suporte@creativeprintjp.com</strong>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
            <button 
                onClick={() => navigate(-1)} 
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar
            </button>
        </div>

        <div className="mt-12 text-center text-slate-500 text-xs">
          <p>Dúvidas adicionais?</p>
          <p className="flex items-center justify-center gap-2 mt-2">
            <HelpCircle size={14}/> Suporte: suporte@creativeprintjp.com | Tel: 090-1188-6491 (Shiga, JP)
          </p>
        </div>

      </div>
    </div>
  );
};
