
import React, { useState, useEffect } from 'react';
import { Order, PaymentMethod, SystemSettings } from '@/src/types';
import { mockService } from '@/src/services/mockData';
import { CheckCircle, Mail, Smartphone, Package, AlertTriangle, Gift, PenTool, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderSuccessViewProps {
    order: Order;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order }) => {
    const [settings] = useState<SystemSettings>(mockService.getSettings());

    // Scroll to top when this view is mounted
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Verificações para exibir mensagens condicionais
    const hasBonusItem = order.items.some(item => item.includesFreePage);
    const hasCustomizableItem = order.items.some(item => item.isCustomizable);

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-brand-yellow"></div>

                <div className="p-8 text-center border-b border-slate-800">
                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce-slow">
                        <CheckCircle size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Pedido Recebido!</h2>
                    <p className="text-brand-gray text-lg">Seu pedido <span className="text-white font-mono font-bold">#{order.id}</span> foi recebido com sucesso.</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* SECTION 1: IMPORTANTE (Pagamento + Avisos) */}
                    <div>
                        <h3 className="font-bold text-brand-yellow mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                            <AlertTriangle size={18} className="text-brand-yellow" /> IMPORTANTE
                        </h3>

                        <div className="bg-slate-950 p-6 rounded-2xl border border-brand-yellow/20 shadow-inner space-y-6">

                            {/* 1. Instruções de Pagamento */}
                            <div>
                                <h4 className="text-brand-blue font-bold text-lg mb-4 border-b border-slate-800 pb-2">Instruções de Pagamento</h4>
                                {order.paymentMethod === PaymentMethod.SQUARE && (
                                    <div className="space-y-3">
                                        <p className="text-slate-300 text-base">Enviaremos um link de pagamento seguro para o seu WhatsApp e email.</p>

                                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center gap-3">
                                            <Mail className="text-brand-blue" size={24} />
                                            <span className="text-sm text-brand-gray break-all">Por favor Verifique: <strong className="text-white">{order.customerEmail}</strong></span>
                                        </div>

                                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center gap-3">
                                            <Smartphone className="text-brand-blue" size={24} />
                                            <span className="text-sm text-brand-gray">e o seu Whatsapp: <strong className="text-white">{order.customerPhone}</strong></span>
                                        </div>
                                    </div>
                                )}

                                {order.paymentMethod === PaymentMethod.PAYPAY && (
                                    <div className="space-y-3">
                                        <p className="text-slate-300 text-base">Enviaremos um link de pagamento seguro para o seu WhatsApp e email.</p>

                                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center gap-3">
                                            <Mail className="text-brand-blue" size={24} />
                                            <span className="text-sm text-brand-gray break-all">Por favor Verifique: <strong className="text-white">{order.customerEmail}</strong></span>
                                        </div>

                                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center gap-3">
                                            <Smartphone className="text-brand-blue" size={24} />
                                            <span className="text-sm text-brand-gray">e o seu Whatsapp: <strong className="text-white">{order.customerPhone}</strong></span>
                                        </div>
                                    </div>
                                )}

                                {order.paymentMethod === PaymentMethod.TRANSFER && settings && (
                                    <div className="space-y-5">
                                        <p className="text-slate-300 text-base mb-2">Realize a transferência para a conta:</p>

                                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 font-mono text-sm space-y-3 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-brand-blue text-white text-[10px] px-2 py-0.5 rounded-bl">Correio</div>
                                            <div className="flex justify-between"><span className="text-brand-gray">Banco</span> <span className="text-white font-bold">{settings.payment.jpBankName}</span></div>
                                            <div className="flex justify-between"><span className="text-brand-gray">Cód. Banco</span> <span className="text-white font-bold">{settings.payment.otherBankCode}</span></div>
                                            <div className="flex justify-between"><span className="text-brand-gray">Agência</span> <span className="text-white font-bold">{settings.payment.otherBranchName}</span></div>
                                            <div className="flex justify-between"><span className="text-brand-gray">Tipo</span> <span className="text-white font-bold">{settings.payment.otherAccountType}</span></div>
                                            <div className="flex justify-between border-t border-slate-700 pt-2"><span className="text-brand-gray">Conta</span> <span className="text-white font-bold">{settings.payment.jpAccountNumber}</span></div>
                                            <div className="flex justify-between"><span className="text-brand-gray">Titular</span> <span className="text-white font-bold">{settings.payment.jpHolderName}</span></div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-800">
                                            <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 flex items-start gap-3">
                                                <Smartphone className="text-brand-blue shrink-0 mt-0.5" size={20} />
                                                <p className="text-sm text-slate-300 leading-relaxed">
                                                    Entraremos em contato pelo WhatsApp para confirmar nossos dados.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Aviso de Personalização (Condicional) */}
                            {hasCustomizableItem && (
                                <div>
                                    <h4 className="text-brand-pink font-bold text-lg mb-2 flex items-center gap-2 border-b border-slate-800 pb-2">
                                        <PenTool size={20} /> Dados de Personalização
                                    </h4>
                                    <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-lg p-4">
                                        <p className="text-base text-slate-300 leading-relaxed">
                                            Seu pedido contém itens personalizados. Entraremos em contato pelo WhatsApp: <strong className="text-white">{order.customerPhone}</strong> para solicitar sua arte e detalhes do design.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 3. Aviso de Bônus CreativeFlix (Condicional) */}
                            {hasBonusItem && (
                                <div>
                                    <h4 className="text-brand-yellow font-bold text-lg mb-2 flex items-center gap-2 border-b border-slate-800 pb-2">
                                        <Gift size={20} /> Bônus Liberado
                                    </h4>
                                    <div className="bg-brand-yellow/5 border border-brand-yellow/20 rounded-lg p-4">
                                        <p className="text-base text-slate-300 leading-relaxed">
                                            Parabéns! Você ganhou 1 Página de links exclusiva e acesso à plataforma <strong>CreativeFlix</strong>.
                                            Enviaremos mais detalhes pelo Whatsapp: <strong className="text-white">{order.customerPhone}</strong> e no seu e-mail: <strong className="text-white">{order.customerEmail}</strong>.
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* SECTION 2: Resumo do Pedido */}
                    <div>
                        <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                            <Package size={16} className="text-slate-400" /> Resumo do Pedido
                        </h3>
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="max-h-64 overflow-y-auto custom-scrollbar p-4 space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-start border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                                        <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-900" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-bold truncate">{item.name}</p>
                                            <p className="text-xs text-slate-500">Qtd: {item.quantity}</p>
                                        </div>
                                        <div className="text-white font-bold text-sm">¥{(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-slate-900 p-4 border-t border-slate-800 flex justify-between items-center pt-3">
                                <span className="text-brand-gray font-bold">Total Final</span>
                                <span className="text-xl font-black text-white">¥{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                            <Info className="text-brand-blue shrink-0 mt-0.5" size={16} />
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Você poderá acompanhar o status atualizado do seu pedido, envio e detalhes de produção diretamente no seu Painel do Cliente.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-center">
                    <Link to="/customer/dashboard" className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-brand-blue/20 flex items-center gap-2 transform hover:-translate-y-1">
                        Acompanhar Meus Pedidos <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};
