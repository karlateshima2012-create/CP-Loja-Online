
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Order, OrderStatus, PaymentMethod } from '@/src/types';
import {
    CheckCircle, Truck, Calendar, Hammer, Package, Ban, ShoppingBag, Star, User, Mail, Phone, MapPin, CreditCard, Eye, AlertCircle, ChevronLeft, FileText, ClipboardCheck, Info, Store, Printer, Receipt, PenTool, Save, Check
} from 'lucide-react';

export const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    // Estados locais para edição manual
    const [tempTracking, setTempTracking] = useState('');
    const [tempStatus, setTempStatus] = useState<OrderStatus>(OrderStatus.PENDING_PAYMENT);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (id) {
            const found = mockService.getOrders().find(o => o.id === id);
            if (found) {
                setOrder(found);
                setTempTracking(found.trackingCode || '');
                setTempStatus(found.status);
            }
            setLoading(false);
        }
    }, [id]);

    // Atualização via Botões de Fluxo (Workflow Rápido)
    const handleWorkflowStatusChange = (newStatus: OrderStatus) => {
        if (order) {
            // Prioriza o que está digitado no input (tempTracking), senão usa o que já estava salvo
            let codeToSave = tempTracking.trim() !== '' ? tempTracking : order.trackingCode;

            // Se for mudar para ENVIADO e ainda não tiver código, solicita
            if (newStatus === OrderStatus.SHIPPED && !codeToSave) {
                const inputCode = window.prompt("Insira o Código de Rastreio (Kuroneko / JP Post):", '');
                if (inputCode === null) return; // Cancelou
                codeToSave = inputCode;
            }

            // Atualiza Mock
            mockService.updateOrderDetails(order.id, {
                status: newStatus,
                trackingCode: codeToSave
            });

            // Atualiza Estado Local para refletir na hora
            const updatedOrder = { ...order, status: newStatus, trackingCode: codeToSave };
            setOrder(updatedOrder);
            setTempStatus(newStatus);
            setTempTracking(codeToSave || '');
        }
    };

    // Atualização Manual com Botão Salvar (Corrigido e Otimizado)
    const handleManualSave = () => {
        if (!order) return;

        setIsSaving(true);

        // Simula delay de rede e salva
        setTimeout(() => {
            mockService.updateOrderDetails(order.id, {
                status: tempStatus,
                trackingCode: tempTracking
            });

            // Atualiza o objeto order principal com os dados dos inputs temporários
            setOrder({ ...order, status: tempStatus, trackingCode: tempTracking });

            setIsSaving(false);
            setSaveSuccess(true);

            // Remove mensagem de sucesso após 2s
            setTimeout(() => setSaveSuccess(false), 2000);
        }, 500);
    };

    const handleProvisionPage = () => {
        if (!order) return;
        setIsSaving(true);
        setTimeout(() => {
            mockService.updateOrderDetails(order.id, { freePageCreated: true });
            setOrder({ ...order, freePageCreated: true });
            setIsSaving(false);
            alert("Página Provisionada com Sucesso! O cliente Ricardo Honda agora possui um perfil CreativeFlix vinculado.");
        }, 1000);
    };

    if (loading) return <div className="p-8 text-white">Carregando pedido...</div>;
    if (!order) return <div className="p-8 text-white">Pedido não encontrado.</div>;

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PAID: return 'text-green-400 bg-green-900/30 border-green-500/30';
            case OrderStatus.WAITING_FORM: return 'text-orange-400 bg-orange-900/30 border-orange-500/30';
            case OrderStatus.CUSTOMIZATION_RECEIVED: return 'text-purple-400 bg-purple-900/30 border-purple-500/30';
            case OrderStatus.PRODUCTION: return 'text-blue-400 bg-blue-900/30 border-blue-500/30';
            case OrderStatus.SHIPPED: return 'text-emerald-400 bg-emerald-900/30 border-emerald-500/30';
            case OrderStatus.RECEIVED: return 'text-teal-400 bg-teal-900/30 border-teal-500/30';
            case OrderStatus.COMPLETED: return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
            case OrderStatus.BUDGET_SENT: return 'text-cyan-400 bg-cyan-900/30 border-cyan-500/30';
            case OrderStatus.CANCELLED: return 'text-red-400 bg-red-900/30 border-red-500/30';
            default: return 'text-slate-400 bg-slate-900 border-slate-700';
        }
    };

    const translateStatus = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING_PAYMENT: return 'Aguardando Pagamento';
            case OrderStatus.BUDGET_SENT: return 'Orçamento Enviado';
            case OrderStatus.PAID: return 'Pago';
            case OrderStatus.WAITING_FORM: return 'Aguardando Formulário';
            case OrderStatus.CUSTOMIZATION_RECEIVED: return 'Personalização Recebida';
            case OrderStatus.PRODUCTION: return 'Em Produção';
            case OrderStatus.SHIPPED: return 'Finalizado / Enviado';
            case OrderStatus.RECEIVED: return 'Recebido pelo Cliente';
            case OrderStatus.COMPLETED: return 'Concluído';
            case OrderStatus.CANCELLED: return 'Cancelado';
            default: return status;
        }
    };

    // --- REGRA DE IMPOSTO DE CONSUMO (JAPÃO 10%) ---
    const calculateTaxReverse = (grossAmount: number) => {
        const net = Math.round(grossAmount / 1.10);
        const tax = grossAmount - net;
        return { net, tax, gross: grossAmount };
    };

    // Agregar Totais
    let totalItemsNet = 0;
    let totalItemsTax = 0;
    let totalItemsGross = 0;

    order.items.forEach(item => {
        const itemTotalGross = item.price * item.quantity;
        const financials = calculateTaxReverse(itemTotalGross);

        totalItemsNet += financials.net;
        totalItemsTax += financials.tax;
        totalItemsGross += financials.gross;
    });

    const shippingFee = order.totalAmount - totalItemsGross;
    const isPickup = order.shippingAddress && order.shippingAddress.includes("RETIRADA NA LOJA");

    // --- BASE HTML FOR PRINT ---
    // Helper para gerar o HTML comum entre Orçamento e Recibo
    const generatePrintHtml = (title: string, docType: 'QUOTE' | 'RECEIPT') => {
        const today = new Date();
        const expiryDate = new Date(today);
        expiryDate.setDate(today.getDate() + 7);
        const isReceipt = docType === 'RECEIPT';

        // Definição dos textos baseados no tipo de documento
        const labels = isReceipt ? {
            base: '税抜金額', // Base (Sem Imposto)
            tax: '消費税 (10%)', // Imposto (10%)
            subtotal: '小計', // Subtotal Itens
            shipping: '送料', // Frete / Envio
            total: '合計金額', // TOTAL GERAL
            free: '無料' // Grátis
        } : {
            base: 'Base (Sem Imposto)',
            tax: 'Imposto (10%)',
            subtotal: 'Subtotal Itens',
            shipping: 'Frete / Envio',
            total: 'TOTAL GERAL',
            free: 'Grátis'
        };

        const logoSvg = `
            <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" style="height: 50px; width: auto;">
                <rect x="0" y="0" width="40" height="40" rx="2" fill="#E5157A" />
                <rect x="0" y="44" width="40" height="40" rx="2" fill="#38b6ff" />
                <rect x="44" y="44" width="40" height="40" rx="2" fill="#FFF200" />
                <rect x="44" y="0" width="18" height="18" rx="1" fill="#FFF200" />
                <rect x="44" y="22" width="18" height="18" rx="1" fill="#38b6ff" />
                <rect x="66" y="22" width="18" height="18" rx="1" fill="#E5157A" />
            </svg>
        `;

        // Footer Content Selection
        let footerHtml = '';
        if (isReceipt) {
            // Layout Japonês em Duas Colunas para Recibo/Fatura
            footerHtml = `
                <div class="footer-grid">
                    <div class="footer-col">
                        <h4>名義：Creative Print</h4>
                        <p>〒528-0065<br/>滋賀県甲賀市水口町春日 42-17</p>
                        <p>Tel: 090-1188-6491 Karla Teshima</p>
                    </div>
                    <div class="footer-col">
                        <h4>お支払い方法</h4>
                        <p>ゆうちょ銀行<br/>
                        銀行コード：9900<br/>
                        支店番号：538（ゴサンハチ）<br/>
                        種目：普通預金<br/>
                        口座番号：0894850<br/>
                        口座名義：テシマ カルラ</p>
                    </div>
                </div>
            `;
        } else {
            // Layout Simples Centralizado para Orçamento
            footerHtml = `
                <div class="footer-simple">
                    <p style="font-weight:900; font-size:14px; margin-bottom:4px; color:#333;">Creative Print</p>
                    <p>Responsável: Karla Teshima | Tel: 090 1188 6491</p>
                    <p>Shiga - Koka - Minakuchi</p>
                </div>
            `;
        }

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${isReceipt ? '請求書' : 'Orçamento'} #${order.id}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #38b6ff; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo-area { display: flex; align-items: center; gap: 15px; }
                    .company-name { font-size: 24px; font-weight: 900; line-height: 1; }
                    .company-sub { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-top: 5px; }
                    .invoice-title { text-align: right; }
                    .invoice-title h1 { margin: 0; color: #333; font-size: 32px; text-transform: uppercase; }
                    .invoice-title p { margin: 5px 0 0; color: #666; }
                    
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                    .info-box h3 { font-size: 12px; text-transform: uppercase; color: #999; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
                    .info-box p { margin: 5px 0; font-size: 14px; font-weight: 500; }
                    
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    th { text-align: left; background: #f8f9fa; padding: 12px; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 1px solid #ddd; }
                    td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
                    .text-right { text-align: right; }
                    
                    .totals { display: flex; justify-content: flex-end; }
                    .totals-box { width: 300px; }
                    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
                    .final-total { border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; font-weight: 900; font-size: 18px; }
                    
                    /* Footer Styles */
                    .footer-simple { margin-top: 60px; padding-top: 20px; border-top: 1px dashed #ccc; text-align: center; font-size: 12px; color: #666; }
                    
                    .footer-grid { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 30px; border-top: 2px solid #38b6ff; }
                    .footer-col { width: 48%; font-size: 12px; color: #444; line-height: 1.6; }
                    .footer-col h4 { font-size: 13px; font-weight: 900; margin: 0 0 8px 0; color: #000; }
                    
                    @media print {
                        body { padding: 0; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-area">
                        ${logoSvg}
                        <div>
                            <div class="company-name">CREATIVE<br/><span style="color:#38b6ff">PRINT</span></div>
                            <div class="company-sub">Tecnologia • NFC • 3D</div>
                        </div>
                    </div>
                    <div class="invoice-title">
                        <h1>${isReceipt ? '請求書' : 'Orçamento'}</h1>
                        <p>#${order.id}</p>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-box">
                        <h3>Dados do Cliente</h3>
                        <p><strong>${order.customerName}</strong></p>
                        <p>${order.customerEmail}</p>
                        <p>${order.customerPhone || ''}</p>
                        <p>${order.shippingAddress || ''}</p>
                    </div>
                    <div class="info-box">
                        <h3>Detalhes</h3>
                        <p>Data Emissão: ${new Date().toLocaleDateString()}</p>
                        ${docType === 'QUOTE' ? `<p>Válido até: <strong>${expiryDate.toLocaleDateString()}</strong></p>` : ''}
                        <p>Status Atual: ${translateStatus(order.status)}</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Item / Descrição</th>
                            <th class="text-right">Qtd</th>
                            <th class="text-right">Preço Unit. (Tax Inc.)</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>
                                    <strong>${item.name}</strong><br/>
                                    <span style="font-size:11px; color:#888;">${item.category}</span>
                                    ${item.customizationValues ? `<br/><span style="font-size:10px; color:#38b6ff;">${Object.values(item.customizationValues).join(', ')}</span>` : ''}
                                </td>
                                <td class="text-right">${item.quantity}</td>
                                <td class="text-right">¥${item.price.toLocaleString()}</td>
                                <td class="text-right">¥${(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="totals">
                    <div class="totals-box">
                        <div class="total-row" style="color:#888;">
                            <span>${labels.base}:</span>
                            <span>¥${totalItemsNet.toLocaleString()}</span>
                        </div>
                        <div class="total-row" style="color:#888;">
                            <span>${labels.tax}:</span>
                            <span>¥${totalItemsTax.toLocaleString()}</span>
                        </div>
                        <div class="total-row">
                            <span>${labels.subtotal}:</span>
                            <span>¥${totalItemsGross.toLocaleString()}</span>
                        </div>
                        <div class="total-row">
                            <span>${labels.shipping}:</span>
                            <span>${shippingFee > 0 ? `¥${shippingFee.toLocaleString()}` : labels.free}</span>
                        </div>
                        <div class="total-row final-total">
                            <span>${labels.total}:</span>
                            <span>¥${order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                ${footerHtml}

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;
    };

    // --- HANDLERS ---
    const handleGenerateQuote = () => {
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        if (!printWindow) return;
        printWindow.document.write(generatePrintHtml('Orçamento', 'QUOTE'));
        printWindow.document.close();
    };

    const handleGenerateReceipt = () => {
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        if (!printWindow) return;
        printWindow.document.write(generatePrintHtml('Recibo', 'RECEIPT'));
        printWindow.document.close();
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <div>
                    <button onClick={() => navigate('/admin/dashboard/orders')} className="text-brand-gray hover:text-white flex items-center gap-2 text-sm font-bold uppercase mb-2 transition-colors">
                        <ChevronLeft size={16} /> Voltar para Pedidos
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black text-white font-mono">{order.id}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                            {order.status === OrderStatus.PAID && <CheckCircle size={14} />}
                            {order.status === OrderStatus.SHIPPED && <Truck size={14} />}
                            {translateStatus(order.status)}
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                        <Calendar size={14} /> {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>

                {/* Status Actions (Workflow Rápido) */}
                <div className="flex flex-wrap gap-3">
                    {/* BOTÃO GERAR ORÇAMENTO */}
                    <button
                        onClick={handleGenerateQuote}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all border border-slate-600"
                    >
                        <Printer size={18} /> Gerar Orçamento
                    </button>

                    {/* BOTÃO GERAR RECIBO */}
                    <button
                        onClick={handleGenerateReceipt}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all border border-slate-600"
                    >
                        <Receipt size={18} /> Gerar Recibo
                    </button>

                    {order.status === OrderStatus.PENDING_PAYMENT && (
                        <button onClick={() => handleWorkflowStatusChange(OrderStatus.PAID)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
                            <CheckCircle size={18} /> Confirmar Pagamento
                        </button>
                    )}

                    {order.status === OrderStatus.PAID && (
                        <button onClick={() => handleWorkflowStatusChange(OrderStatus.WAITING_FORM)} className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
                            <FileText size={18} /> Aguardar Formulário
                        </button>
                    )}

                    {order.status === OrderStatus.WAITING_FORM && (
                        <button onClick={() => handleWorkflowStatusChange(OrderStatus.CUSTOMIZATION_RECEIVED)} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
                            <ClipboardCheck size={18} /> Confirmar Recebimento
                        </button>
                    )}

                    {order.status === OrderStatus.CUSTOMIZATION_RECEIVED && (
                        <button onClick={() => handleWorkflowStatusChange(OrderStatus.PRODUCTION)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
                            <Hammer size={18} /> Iniciar Produção
                        </button>
                    )}

                    {order.status === OrderStatus.PRODUCTION && (
                        <button onClick={() => handleWorkflowStatusChange(OrderStatus.SHIPPED)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
                            <Truck size={18} /> Finalizar / Enviar
                        </button>
                    )}

                    {(order.status === OrderStatus.SHIPPED || order.status === OrderStatus.RECEIVED) && (
                        <button onClick={() => handleWorkflowStatusChange(OrderStatus.COMPLETED)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
                            <CheckCircle size={18} /> Concluir Pedido
                        </button>
                    )}

                    {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.SHIPPED && order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.RECEIVED && (
                        <button onClick={() => { if (window.confirm('Cancelar pedido?')) handleWorkflowStatusChange(OrderStatus.CANCELLED) }} className="bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-slate-700 hover:border-red-900/50 transition-all">
                            <Ban size={18} /> Cancelar
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Items & Financials */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Card */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingBag size={20} /> Itens do Pedido</h2>
                            <span className="text-sm text-slate-500 flex items-center gap-1">
                                <Info size={12} /> Preços com imposto incluso
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="bg-slate-950 text-slate-500 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Produto</th>
                                        <th className="px-6 py-4">Detalhes</th>
                                        <th className="px-6 py-4 text-center">Qtd</th>
                                        <th className="px-6 py-4 text-right">Valores</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {order.items.map((item, idx) => {
                                        // Item Breakdown Calculations
                                        const totalGross = item.price * item.quantity;
                                        const itemFinancials = calculateTaxReverse(totalGross);

                                        return (
                                            <tr key={idx} className="hover:bg-slate-800/30">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800" />
                                                        <div>
                                                            <div className="text-white font-bold">{item.name}</div>
                                                            <div className="text-xs text-brand-blue">{item.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.customizationValues && Object.keys(item.customizationValues).length > 0 ? (
                                                        <div className="space-y-1">
                                                            {Object.entries(item.customizationValues).map(([k, v]) => (
                                                                <div key={k} className="text-xs"><span className="text-slate-500">{k}:</span> <span className="text-white">{v}</span></div>
                                                            ))}
                                                        </div>
                                                    ) : <span className="text-slate-600 italic">-</span>}

                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-white font-bold">{item.quantity}</div>
                                                    <div className="text-[10px] text-slate-500">x ¥{item.price.toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        {/* Total Final Display */}
                                                        <div className="font-bold text-white text-base">
                                                            ¥{itemFinancials.gross.toLocaleString()}
                                                        </div>

                                                        {/* Tax Breakdown (Small) */}
                                                        <div className="flex flex-col text-[10px] text-slate-500 items-end border-t border-slate-700/50 pt-1 mt-1 w-full max-w-[140px]">
                                                            <div className="flex justify-between w-full">
                                                                <span>Sem Imposto:</span>
                                                                <span>¥{itemFinancials.net.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex justify-between w-full">
                                                                <span>Imp. (10%):</span>
                                                                <span>¥{itemFinancials.tax.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-slate-950/50 border-t border-slate-800">
                            <div className="flex flex-col items-end space-y-3">
                                <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 border bg-slate-900 px-3 py-1 rounded-full border-slate-700">
                                    <Info size={12} /> Resumo Financeiro
                                </div>
                                <div className="space-y-1 w-full max-w-sm">
                                    <div className="flex justify-between w-full text-sm text-slate-400">
                                        <span>Total Itens (Sem Imposto)</span>
                                        <span>¥{totalItemsNet.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between w-full text-sm text-slate-400">
                                        <span>Total Impostos (10% sobre Itens)</span>
                                        <span>¥{totalItemsTax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between w-full text-sm text-slate-400 border-b border-slate-700 pb-2 mb-2">
                                        <span className={isPickup ? "text-green-400 font-bold" : ""}>{isPickup ? "Retirada na Loja" : "Frete / Envio"}</span>
                                        <span className={isPickup ? "text-green-400 font-bold" : ""}>{shippingFee > 0 ? `¥${shippingFee.toLocaleString()}` : 'Grátis'}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between w-full max-w-sm items-center">
                                    <span className="text-sm text-brand-gray font-bold uppercase">Total Geral do Pedido</span>
                                    <div className="text-3xl font-black text-white">¥{order.totalAmount.toLocaleString()}</div>
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">
                                    * Soma de Itens + Frete
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Info Cards */}
                <div className="space-y-6">

                    {/* Digital Fulfillment / Bonuses */}
                    {order.status === OrderStatus.PAID && order.items.some(i => i.includesFreePage) && (
                        <div className="bg-slate-900 rounded-2xl border border-brand-yellow/30 shadow-xl overflow-hidden animate-pulse-slow">
                            <div className="p-4 border-b border-brand-yellow/20 bg-brand-yellow/5">
                                <h3 className="font-bold text-brand-yellow flex items-center gap-2"><Star size={18} /> Gestão Digital (Bônus)</h3>
                            </div>
                            <div className="p-5">
                                <p className="text-xs text-slate-400 mb-4">Este pedido contém itens com <strong>Página Free inclusa</strong> ou <strong>Plano Premium</strong>. Libere o acesso digital abaixo.</p>

                                {order.freePageCreated ? (
                                    <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg flex items-center gap-3">
                                        <CheckCircle className="text-green-400" size={20} />
                                        <div>
                                            <div className="text-xs font-bold text-white uppercase">Página Ativada</div>
                                            <div className="text-[10px] text-slate-400">URL: creativeflix.jp/ricardo-honda</div>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleProvisionPage}
                                        disabled={isSaving}
                                        className="w-full bg-brand-yellow hover:bg-yellow-400 text-slate-950 px-4 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                                    >
                                        <PenTool size={18} /> CRIAR PÁGINA CREATIVEFLIX
                                    </button>
                                )}

                                <p className="text-[9px] text-slate-500 mt-4 italic uppercase text-center tracking-widest">
                                    Após criar, grave a URL no item NFC e envie as credenciais.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Customer Info */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 bg-slate-950/30">
                            <h3 className="font-bold text-white flex items-center gap-2"><User size={18} className="text-brand-blue" /> Cliente</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Nome</label>
                                <div className="text-white font-medium">{order.customerName}</div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 uppercase font-bold flex items-center gap-1"><Mail size={12} /> Email</label>
                                    <div className="text-white text-sm break-all">{order.customerEmail}</div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold flex items-center gap-1"><Phone size={12} /> Telefone</label>
                                <div className="text-white text-sm">{order.customerPhone || '-'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info - DYNAMIC HEADER */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 bg-slate-950/30">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                {isPickup ? (
                                    <><Store size={18} className="text-green-400" /> Retirada na Loja</>
                                ) : (
                                    <><MapPin size={18} className="text-orange-400" /> Entrega</>
                                )}
                            </h3>
                        </div>
                        <div className="p-5">
                            {isPickup ? (
                                <div className="bg-green-900/20 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase px-2 py-1 rounded w-fit mb-3 flex items-center gap-1">
                                    <CheckCircle size={12} /> Cliente vai retirar
                                </div>
                            ) : (
                                <>
                                    <div className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-4">
                                        {order.shippingAddress}
                                    </div>

                                    {/* TRACKING CODE INPUT (EDITABLE) */}
                                    <div className="border-t border-slate-800 pt-4">
                                        <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Código de Rastreio</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-sm focus:border-brand-blue outline-none"
                                            value={tempTracking}
                                            onChange={(e) => setTempTracking(e.target.value)}
                                            placeholder="Cole o código aqui..."
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 bg-slate-950/30">
                            <h3 className="font-bold text-white flex items-center gap-2"><CreditCard size={18} className="text-green-400" /> Pagamento</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">Método</span>
                                <span className="text-white font-bold bg-slate-800 px-2 py-1 rounded text-xs">{order.paymentMethod}</span>
                            </div>

                            {order.paymentMethod === PaymentMethod.TRANSFER && (
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Comprovante</label>
                                    {order.paymentProofUrl ? (
                                        <a href={order.paymentProofUrl} target="_blank" rel="noreferrer" className="block relative group rounded-lg overflow-hidden border border-slate-700">
                                            <img src={order.paymentProofUrl} className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Comprovante" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Eye className="text-white" />
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="text-sm text-yellow-500 flex items-center gap-2 bg-yellow-900/10 p-2 rounded border border-yellow-900/30">
                                            <AlertCircle size={16} /> Aguardando envio
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Admin Actions (Manual Save) */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5">
                        <label className="text-xs text-slate-500 uppercase font-bold mb-2 block flex items-center gap-2">
                            <PenTool size={14} /> Controle Manual
                        </label>
                        <select
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-blue mb-3"
                            value={tempStatus}
                            onChange={(e) => setTempStatus(e.target.value as OrderStatus)}
                        >
                            {Object.values(OrderStatus).map(s => <option key={s} value={s}>{translateStatus(s)}</option>)}
                        </select>

                        <button
                            onClick={handleManualSave}
                            disabled={isSaving}
                            className={`w-full text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${saveSuccess
                                ? 'bg-green-600'
                                : 'bg-brand-blue hover:bg-brand-blue/90'
                                }`}
                        >
                            {isSaving ? (
                                <span className="animate-pulse">Salvando...</span>
                            ) : saveSuccess ? (
                                <><Check size={18} /> Salvo!</>
                            ) : (
                                <><Save size={18} /> Salvar Alterações</>
                            )}
                        </button>
                        <p className="text-[10px] text-slate-500 mt-2 text-center">Salva status e código de rastreio digitado.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};
