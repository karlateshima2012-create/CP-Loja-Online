import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { Product, ProductAccordionItem } from '@/src/types';
import { 
    Plus, Search, Edit2, Trash2, X, Save, 
    Image as ImageIcon, Layout, Box, Cpu, 
    Monitor, PenTool, Gift, Layers, Calendar, 
    PlusCircle, MinusCircle, ChevronDown, ChevronUp,
    Info, HelpCircle
} from 'lucide-react';

export const ProductsManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        setProducts(mockService.getProducts());
    };

    const handleSave = () => {
        if (!editingProduct) return;
        mockService.saveProduct(editingProduct as Product);
        loadProducts();
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            mockService.deleteProduct(id);
            loadProducts();
        }
    };

    const openEdit = (product?: Product) => {
        setEditingProduct(product ? { ...product } : {
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
            category: 'Impressão 3D',
            isCustomizable: false,
            includesFreePage: false,
            accordion: []
        });
        setIsModalOpen(true);
    };

    // --- Accordion Logic for Admin ---
    const addAccordionItem = () => {
        const current = editingProduct?.accordion || [];
        setEditingProduct({
            ...editingProduct,
            accordion: [...current, { title: '', content: '' }]
        });
    };

    const removeAccordionItem = (index: number) => {
        const current = editingProduct?.accordion || [];
        setEditingProduct({
            ...editingProduct,
            accordion: current.filter((_, i) => i !== index)
        });
    };

    const updateAccordionItem = (index: number, field: keyof ProductAccordionItem, value: any) => {
        const current = [...(editingProduct?.accordion || [])];
        current[index] = { ...current[index], [field]: value };
        setEditingProduct({ ...editingProduct, accordion: current });
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Gestão de Produtos</h2>
                <button onClick={() => openEdit()} className="bg-brand-blue text-slate-950 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">
                    <Plus size={18} /> Novo Produto
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por nome ou categoria..."
                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-brand-blue/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden group">
                        <div className="h-48 overflow-hidden relative">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => openEdit(product)} className="bg-slate-800/80 backdrop-blur-md p-2 rounded-lg text-brand-blue hover:bg-brand-blue hover:text-slate-950 transition-all shadow-xl"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(product.id)} className="bg-slate-800/80 backdrop-blur-md p-2 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 size={16} /></button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-brand-blue/20 backdrop-blur-md text-brand-blue border border-brand-blue/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
                                <span className="text-xl font-black text-white">¥{product.price.toLocaleString()}</span>
                                <div className="flex gap-2">
                                    {product.isCustomizable && <PenTool size={14} className="text-brand-pink" title="Personalizável" />}
                                    {product.includesFreePage && <Gift size={14} className="text-brand-yellow" title="Bônus CP Flix" />}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE EDIÇÃO/CRIAÇÃO */}
            {isModalOpen && editingProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-zoom-in no-scrollbar">
                        <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{editingProduct.id ? 'Editar Produto' : 'Novo Produto'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Campos Básicos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nome do Produto</label>
                                    <input 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-brand-blue transition-all"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Categoria</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-brand-blue transition-all appearance-none"
                                        value={editingProduct.category}
                                        onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                                    >
                                        <option value="Impressão 3D">Impressão 3D</option>
                                        <option value="Tecnologia NFC">Tecnologia NFC</option>
                                        <option value="Soluções Digitais">Soluções Digitais</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Descrição Principal</label>
                                <textarea 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-brand-blue transition-all h-32"
                                    value={editingProduct.description}
                                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                />
                            </div>

                            {/* SEÇÃO ACCORDION (Sincronizada com o Card) */}
                            <div className="pt-6 border-t border-slate-800">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h4 className="text-brand-blue font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                            <HelpCircle size={18} /> Accordion "Como Funciona"
                                        </h4>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase">Estes campos aparecem como abas explicativas no card do produto na loja.</p>
                                    </div>
                                    <button 
                                        onClick={addAccordionItem}
                                        className="bg-brand-blue/10 text-brand-blue border border-brand-blue/30 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-slate-950 transition-all flex items-center gap-2"
                                    >
                                        <PlusCircle size={14} /> Adicionar Aba
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {(editingProduct.accordion || []).map((item, idx) => (
                                        <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 relative group/item">
                                            <button 
                                                onClick={() => removeAccordionItem(idx)}
                                                className="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"
                                            >
                                                <MinusCircle size={20} />
                                            </button>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-600 uppercase">Título da Aba (Ex: 👉 Como funciona)</label>
                                                    <input 
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-brand-blue transition-all"
                                                        value={item.title}
                                                        onChange={(e) => updateAccordionItem(idx, 'title', e.target.value)}
                                                        placeholder="Digite o título..."
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-600 uppercase">Conteúdo (Use quebras de linha para bullet points)</label>
                                                    <textarea 
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-brand-blue transition-all h-24"
                                                        value={item.content}
                                                        onChange={(e) => updateAccordionItem(idx, 'content', e.target.value)}
                                                        placeholder="Descreva o processo ou informações..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!editingProduct.accordion || editingProduct.accordion.length === 0) && (
                                        <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl">
                                            <Info className="mx-auto text-slate-700 mb-2" size={32} />
                                            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Nenhuma aba personalizada adicionada.</p>
                                            <p className="text-slate-700 text-[10px] uppercase mt-1">O produto exibirá o conteúdo padrão da Creative Print.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Opções de Bônus */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                                <button 
                                    onClick={() => setEditingProduct({...editingProduct, isCustomizable: !editingProduct.isCustomizable})}
                                    className={`p-6 rounded-2xl border transition-all flex items-center gap-4 ${editingProduct.isCustomizable ? 'bg-brand-pink/10 border-brand-pink text-brand-pink shadow-lg shadow-brand-pink/10' : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                                >
                                    <PenTool size={24} />
                                    <div className="text-left">
                                        <p className="font-black text-sm uppercase tracking-widest">Produto Personalizado</p>
                                        <p className="text-[10px] uppercase opacity-70">Ativa selo de personalização e formulário</p>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => setEditingProduct({...editingProduct, includesFreePage: !editingProduct.includesFreePage})}
                                    className={`p-6 rounded-2xl border transition-all flex items-center gap-4 ${editingProduct.includesFreePage ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow shadow-lg shadow-brand-yellow/10' : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                                >
                                    <Gift size={24} />
                                    <div className="text-left">
                                        <p className="font-black text-sm uppercase tracking-widest">Bônus CP Flix</p>
                                        <p className="text-[10px] uppercase opacity-70">Inclui página de links gratuita</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-8 flex justify-end gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest text-xs">Cancelar</button>
                            <button onClick={handleSave} className="bg-brand-blue text-slate-950 px-10 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-brand-blue/30 hover:scale-105 transition-all">
                                <Save size={18} /> Salvar Produto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};