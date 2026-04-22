import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { Product, Partner, PriceTier, PlanOption, RecipeItem, RawMaterial } from '@/src/types';
import { Package, Plus, Edit, Trash2, X, BadgeCheck, DollarSign, Star, Image as ImageIcon, Upload, Save, Layers, PenTool, Calendar, Trophy, Boxes, Link2, Truck, Megaphone, ThumbsUp, Gift } from 'lucide-react';

export const ProductsManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [search, setSearch] = useState('');
    
    // Form States
    const [editProduct, setEditProduct] = useState<Partial<Product>>({});
    const [productType, setProductType] = useState<'CP_STANDARD' | 'CP_AFFILIATE' | 'PARTNER_EXCLUSIVE'>('CP_STANDARD');
    const [imageUrls, setImageUrls] = useState<string[]>(['', '', '', '']);
    
    // Pricing Strategy State
    const [pricingStrategy, setPricingStrategy] = useState<'UNIT' | 'TIER' | 'PLAN'>('UNIT');

    // Tiers State (Quantity)
    const [tempTiers, setTempTiers] = useState<PriceTier[]>([]);
    const [newTierQty, setNewTierQty] = useState('');
    const [newTierPrice, setNewTierPrice] = useState('');

    // Plans State (Time)
    const [planPrices, setPlanPrices] = useState({
        p12: '',
        p24: '',
        p48: ''
    });

    // Customization State
    const [isCustomizable, setIsCustomizable] = useState(false);
    
    // Bonus State
    const [includesFreePage, setIncludesFreePage] = useState(false);

    // Marketing Flags
    const [isFeatured, setIsFeatured] = useState(false);
    const [isRecommended, setIsRecommended] = useState(false);
    const [isBestSeller, setIsBestSeller] = useState(false);

    // Recipe State
    const [recipe, setRecipe] = useState<RecipeItem[]>([]);
    const [newRecipeMatId, setNewRecipeMatId] = useState('');

    useEffect(() => {
        // Reverse array to show newest products first
        setProducts([...mockService.getProducts()].reverse());
        setPartners(mockService.getPartners());
        setMaterials(mockService.getMaterials());
    }, []);

    const handleNew = () => {
        setEditProduct({ price: 0 });
        setProductType('CP_STANDARD');
        setImageUrls(['', '', '', '']); // 4 empty slots
        setPricingStrategy('UNIT');
        setTempTiers([]);
        setRecipe([]);
        setPlanPrices({ p12: '', p24: '', p48: '' });
        setIsCustomizable(false);
        setIncludesFreePage(false);
        setIsFeatured(false);
        setIsRecommended(false);
        setIsBestSeller(false);
        setIsEditing(true);
    };

    const handleEdit = (product: Product) => {
        setEditProduct({ ...product });
        
        // Determine type based on props
        if (product.isExclusive) {
            setProductType('PARTNER_EXCLUSIVE');
        } else if (product.allowAffiliate) {
            setProductType('CP_AFFILIATE');
        } else {
            setProductType('CP_STANDARD');
        }

        // Setup Images: [Main, ...Additional, fill empty]
        const imgs = [product.imageUrl, ...(product.additionalImages || [])];
        while (imgs.length < 4) imgs.push('');
        setImageUrls(imgs.slice(0, 4));

        // Pricing Strategy Logic
        if (product.plans && product.plans.length > 0) {
            setPricingStrategy('PLAN');
            const p12 = product.plans.find(p => p.months === 12)?.totalPrice.toString() || '';
            const p24 = product.plans.find(p => p.months === 24)?.totalPrice.toString() || '';
            const p48 = product.plans.find(p => p.months === 48)?.totalPrice.toString() || '';
            setPlanPrices({ p12, p24, p48 });
            setTempTiers([]);
        } else if (product.priceTiers && product.priceTiers.length > 0) {
            setPricingStrategy('TIER');
            setTempTiers([...product.priceTiers]);
            setPlanPrices({ p12: '', p24: '', p48: '' });
        } else {
            setPricingStrategy('UNIT');
            setTempTiers([]);
            setPlanPrices({ p12: '', p24: '', p48: '' });
        }

        // Customization Logic
        setIsCustomizable(!!product.isCustomizable);
        
        // Bonus Logic
        setIncludesFreePage(!!product.includesFreePage);

        // Marketing Logic
        setIsFeatured(!!product.isFeatured);
        setIsRecommended(!!product.isRecommended);
        setIsBestSeller(!!product.isBestSeller);

        // Recipe Logic
        setRecipe(product.recipe || []);

        setIsEditing(true);
    };

    const addTier = () => {
        if (!newTierQty || !newTierPrice) return;
        const qty = parseInt(newTierQty);
        const price = parseInt(newTierPrice);
        if (qty > 0 && price >= 0) {
            // New tiers are not best seller by default
            setTempTiers([...tempTiers, { quantity: qty, totalPrice: price, isBestSeller: false }]);
            setNewTierQty('');
            setNewTierPrice('');
        }
    };

    const removeTier = (index: number) => {
        setTempTiers(tempTiers.filter((_, i) => i !== index));
    };

    const toggleBestSellerTier = (index: number) => {
        const updatedTiers = tempTiers.map((tier, i) => ({
            ...tier,
            isBestSeller: i === index // Only the clicked one becomes true, others false
        }));
        setTempTiers(updatedTiers);
    };

    // Recipe Management
    const addRecipeItem = () => {
        if (!newRecipeMatId) return;
        const qty = 1; // Default to 1 unit per item logic

        // Check if material already exists
        const existingIdx = recipe.findIndex(r => r.materialId === newRecipeMatId);
        if (existingIdx >= 0) {
            const updated = [...recipe];
            updated[existingIdx].quantity += qty;
            setRecipe(updated);
        } else {
            setRecipe([...recipe, { materialId: newRecipeMatId, quantity: qty }]);
        }
        setNewRecipeMatId('');
    };

    const removeRecipeItem = (index: number) => {
        setRecipe(recipe.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        // Validation
        if (!editProduct.name || !imageUrls[0]) {
            alert("Nome e Imagem Principal são obrigatórios.");
            return;
        }

        if (pricingStrategy === 'TIER') {
             if (tempTiers.length === 0) {
                 alert("Adicione pelo menos um pacote de preço (Tier).");
                 return;
             }
        } else if (pricingStrategy === 'PLAN') {
            if (!planPrices.p12 && !planPrices.p24 && !planPrices.p48) {
                alert("Defina o preço de pelo menos um plano (12, 24 ou 48 meses).");
                return;
            }
        } else {
            // UNIT
            if (editProduct.price === undefined || editProduct.price < 0) {
                 alert("Defina o preço unitário do produto.");
                 return;
            }
        }

        // Filter valid images
        const validImages = imageUrls.filter(url => url.trim() !== '');
        const mainImage = validImages[0];
        const additionalImages = validImages.slice(1);

        const newProduct = { ...editProduct } as Product;
        newProduct.imageUrl = mainImage;
        newProduct.additionalImages = additionalImages;
        
        // Apply Pricing Strategy
        if (pricingStrategy === 'TIER') {
            newProduct.priceTiers = tempTiers;
            newProduct.plans = undefined;
            newProduct.price = 0; // Base price 0 if tiered
        } else if (pricingStrategy === 'PLAN') {
            newProduct.priceTiers = undefined;
            const plans: PlanOption[] = [];
            if (planPrices.p12) plans.push({ months: 12, totalPrice: Number(planPrices.p12), description: 'Plano Anual' });
            if (planPrices.p24) plans.push({ months: 24, totalPrice: Number(planPrices.p24), description: 'Plano 2 Anos' });
            if (planPrices.p48) plans.push({ months: 48, totalPrice: Number(planPrices.p48), description: 'Plano 4 Anos' });
            newProduct.plans = plans;
            newProduct.price = 0;
        } else {
            // UNIT
            newProduct.priceTiers = undefined;
            newProduct.plans = undefined;
        }

        // Apply Recipe
        newProduct.recipe = recipe.length > 0 ? recipe : undefined;

        // Apply Customization Flag
        newProduct.isCustomizable = isCustomizable;
        
        // Apply Bonus Flag
        newProduct.includesFreePage = includesFreePage;
        
        // Apply Marketing Flags
        newProduct.isFeatured = isFeatured;
        newProduct.isRecommended = isRecommended;
        newProduct.isBestSeller = isBestSeller;
        
        // Clear old legacy fields to avoid confusion
        (newProduct as any).customizationFields = undefined;
        (newProduct as any).allowLogoUpload = undefined;
        (newProduct as any).allowObservations = undefined;

        // Apply Type Logic
        if (productType === 'CP_STANDARD') {
            newProduct.isExclusive = false;
            newProduct.allowAffiliate = false;
            newProduct.partnerId = undefined;
            newProduct.commissionRate = undefined;
        } else if (productType === 'CP_AFFILIATE') {
            newProduct.isExclusive = false;
            newProduct.allowAffiliate = true;
            newProduct.partnerId = undefined;
            newProduct.commissionRate = undefined;
        } else {
            // PARTNER_EXCLUSIVE
            newProduct.isExclusive = true;
            newProduct.allowAffiliate = false; 
            if (!newProduct.partnerId) {
                alert("Selecione um parceiro para o produto exclusivo.");
                return;
            }
        }

        mockService.saveProduct(newProduct);
        alert(editProduct.id ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");

        // Refresh list (Reversed)
        setProducts([...mockService.getProducts()].reverse());
        setIsEditing(false);
        setEditProduct({});
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Excluir produto?')) {
            mockService.deleteProduct(id);
            setProducts([...mockService.getProducts()].reverse());
        }
    }

    const updateImageUrl = (index: number, url: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = url;
        setImageUrls(newUrls);
    }

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Package size={20}/> Gerenciar Produtos</h2>
                <div className="flex gap-4">
                     <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
                     <button onClick={handleNew} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                        <Plus size={16}/> Novo Produto
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl mb-6">
                    <div className="flex justify-between items-start mb-6">
                         <h3 className="font-bold text-white text-lg">{editProduct.id ? 'Editar Produto' : 'Novo Produto'}</h3>
                         <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT COLUMN: BASIC INFO */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome do Produto</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" value={editProduct.name || ''} onChange={e => setEditProduct({...editProduct, name: e.target.value})} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição do Produto</label>
                                <textarea className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white h-32 resize-none" value={editProduct.description || ''} onChange={e => setEditProduct({...editProduct, description: e.target.value})} />
                            </div>
                            
                            {/* PRICING STRATEGY SECTION */}
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <DollarSign size={14}/> Estratégia de Preço
                                </label>
                                
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <button 
                                        onClick={() => setPricingStrategy('UNIT')}
                                        className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${pricingStrategy === 'UNIT' ? 'bg-brand-blue/20 border-brand-blue text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'}`}
                                    >
                                        Unitário
                                    </button>
                                    <button 
                                        onClick={() => setPricingStrategy('TIER')}
                                        className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${pricingStrategy === 'TIER' ? 'bg-brand-blue/20 border-brand-blue text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'}`}
                                    >
                                        Atacado (Pacotes)
                                    </button>
                                    <button 
                                        onClick={() => setPricingStrategy('PLAN')}
                                        className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${pricingStrategy === 'PLAN' ? 'bg-brand-blue/20 border-brand-blue text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'}`}
                                    >
                                        Venda por Plano
                                    </button>
                                </div>

                                {/* STRATEGY: UNIT */}
                                {pricingStrategy === 'UNIT' && (
                                    <div className="animate-fade-in space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Preço Unitário (¥)</label>
                                            <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" type="number" value={editProduct.price || ''} onChange={e => setEditProduct({...editProduct, price: Number(e.target.value)})} />
                                        </div>
                                    </div>
                                )}

                                {/* STRATEGY: TIER (PACKAGES) */}
                                {pricingStrategy === 'TIER' && (
                                    <div className="space-y-3 animate-fade-in">
                                        <div className="flex gap-2 items-end">
                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase text-slate-500 block mb-1">Qtd Itens</label>
                                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm" placeholder="Ex: 50" value={newTierQty} onChange={e => setNewTierQty(e.target.value)} />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase text-slate-500 block mb-1">Preço Total (¥)</label>
                                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm" placeholder="Ex: 8000" value={newTierPrice} onChange={e => setNewTierPrice(e.target.value)} />
                                            </div>
                                            <button onClick={addTier} className="bg-brand-blue text-white p-1.5 rounded hover:bg-brand-blue/90 h-8 w-8 flex items-center justify-center"><Plus size={16}/></button>
                                        </div>

                                        <div className="space-y-1">
                                            {tempTiers.map((tier, idx) => (
                                                <div key={idx} className={`flex justify-between items-center p-2 rounded text-sm border ${tier.isBestSeller ? 'bg-brand-blue/10 border-brand-blue' : 'bg-slate-900 border-slate-800'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => toggleBestSellerTier(idx)} 
                                                            className={`p-1 rounded hover:bg-slate-800 ${tier.isBestSeller ? 'text-brand-yellow' : 'text-slate-600'}`}
                                                            title="Marcar como Mais Vendido"
                                                        >
                                                            <Trophy size={14} fill={tier.isBestSeller ? "currentColor" : "none"}/>
                                                        </button>
                                                        <span className="text-white font-bold">{tier.quantity} unidades</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-green-400">¥{tier.totalPrice.toLocaleString()}</span>
                                                        <button onClick={() => removeTier(idx)} className="text-slate-600 hover:text-red-400"><X size={14}/></button>
                                                    </div>
                                                </div>
                                            ))}
                                            {tempTiers.length === 0 && <p className="text-xs text-slate-600 italic text-center py-2">Nenhum pacote adicionado.</p>}
                                        </div>
                                    </div>
                                )}

                                {/* STRATEGY: PLANS (TIME) */}
                                {pricingStrategy === 'PLAN' && (
                                    <div className="space-y-3 animate-fade-in">
                                        <div className="p-3 bg-brand-blue/5 border border-brand-blue/10 rounded-lg text-xs text-brand-blue mb-2">
                                            Defina o preço total para cada período. Deixe em branco se não quiser oferecer uma opção.
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block flex items-center gap-1"><Calendar size={10}/> Plano 12 Meses (1 Ano)</label>
                                            <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Preço Total (ex: 20000)" value={planPrices.p12} onChange={e => setPlanPrices({...planPrices, p12: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block flex items-center gap-1"><Calendar size={10}/> Plano 24 Meses (2 Anos)</label>
                                            <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Preço Total" value={planPrices.p24} onChange={e => setPlanPrices({...planPrices, p24: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block flex items-center gap-1"><Calendar size={10}/> Plano 48 Meses (4 Anos)</label>
                                            <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Preço Total" value={planPrices.p48} onChange={e => setPlanPrices({...planPrices, p48: e.target.value})} />
                                        </div>
                                    </div>
                                )}
                                
                                {/* --- FRETE FIXO ESPECÍFICO (NOVO) --- */}
                                <div className="border-t border-slate-800 pt-4 mt-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block flex items-center gap-1"><Truck size={12}/> Frete Fixo (Opcional)</label>
                                    <input 
                                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" 
                                        type="number" 
                                        placeholder="Padrão (600)"
                                        value={editProduct.fixedShippingFee !== undefined ? editProduct.fixedShippingFee : ''} 
                                        onChange={e => setEditProduct({...editProduct, fixedShippingFee: e.target.value ? Number(e.target.value) : undefined})} 
                                    />
                                    <p className="text-[9px] text-slate-500 mt-1">
                                        Use para itens pequenos (Ex: 400) ou Digitais (0). Se vazio, usa o padrão.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Categoria</label>
                                    <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" list="categories" value={editProduct.category || ''} onChange={e => setEditProduct({...editProduct, category: e.target.value})} />
                                    <datalist id="categories">
                                        <option value="Tecnologia NFC"/>
                                        <option value="Impressão 3D"/>
                                        <option value="Serviços Digitais"/>
                                    </datalist>
                                </div>
                            </div>

                            {/* MARKETING FLAGS SECTION */}
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <Megaphone size={14}/> Visibilidade & Marketing
                                </label>
                                
                                <div className="space-y-3">
                                    {/* Destaque CP */}
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-900 transition-colors">
                                        <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-brand-blue w-5 h-5" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                                        <div>
                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                <Star size={14} className="text-brand-blue"/> Destaques CP
                                            </div>
                                            <p className="text-[10px] text-slate-500">Exibe na galeria principal "Destaques CP" na Home.</p>
                                        </div>
                                    </label>

                                    {/* Recomendado */}
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-900 transition-colors">
                                        <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-brand-yellow w-5 h-5" checked={isRecommended} onChange={e => setIsRecommended(e.target.checked)} />
                                        <div>
                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                <ThumbsUp size={14} className="text-brand-yellow"/> Produto Recomendado
                                            </div>
                                            <p className="text-[10px] text-slate-500">Exibe na galeria "Produtos Recomendados" na Home.</p>
                                        </div>
                                    </label>

                                    {/* Mais Vendido */}
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-900 transition-colors">
                                        <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-brand-yellow w-5 h-5" checked={isBestSeller} onChange={e => setIsBestSeller(e.target.checked)} />
                                        <div>
                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                <Trophy size={14} className="text-brand-yellow"/> Mais Vendido (Selo)
                                            </div>
                                            <p className="text-[10px] text-slate-500">Adiciona o ícone de troféu no card do produto.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* CUSTOMIZATION SETTING */}
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <PenTool size={14}/> Detalhes do Produto
                                </label>
                                
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-900 transition-colors">
                                        <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-brand-blue w-5 h-5" checked={isCustomizable} onChange={e => setIsCustomizable(e.target.checked)} />
                                        <div>
                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                Produto Personalizado
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-1">
                                                Se marcado, exibe aviso que arte será coletada via WhatsApp.
                                            </p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-900 transition-colors">
                                        <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-brand-pink w-5 h-5" checked={includesFreePage} onChange={e => setIncludesFreePage(e.target.checked)} />
                                        <div>
                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                <Gift size={14} className="text-brand-pink"/> Inclui Bônus CreativeFlix
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-1">
                                                Dá direito a uma página gratuita na plataforma CreativeFlix.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: CONFIG & IMAGES */}
                        <div className="space-y-6">
                            {/* RECIPE / INGREDIENTS SECTION (NEW) */}
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <Boxes size={14}/> Ficha Técnica (Consumo p/ Unidade)
                                </label>

                                <div className="space-y-2 mb-3 bg-slate-900 rounded-lg p-2 border border-slate-800 max-h-40 overflow-y-auto">
                                    {recipe.length === 0 && <p className="text-center text-xs text-slate-500 py-2">Sem insumos vinculados.</p>}
                                    {recipe.map((item, idx) => {
                                        const mat = materials.find(m => m.id === item.materialId);
                                        return (
                                            <div key={idx} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{mat?.name || 'Item Removido'}</span>
                                                    <span className="text-[10px] text-slate-500">Gasta: {item.quantity} {mat?.unit} p/ unidade</span>
                                                </div>
                                                <button onClick={() => removeRecipeItem(idx)} className="text-slate-500 hover:text-red-400"><X size={14}/></button>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label className="text-[9px] uppercase text-slate-500 mb-1 block">Adicionar Insumo (1 un.)</label>
                                        <select 
                                            className="w-full bg-slate-900 border border-slate-700 rounded text-xs text-white px-2 py-2"
                                            value={newRecipeMatId}
                                            onChange={e => setNewRecipeMatId(e.target.value)}
                                        >
                                            <option value="">+ Selecionar</option>
                                            {materials.map(m => (
                                                <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={addRecipeItem} className="bg-brand-blue text-white p-2 rounded h-[34px] w-10 flex items-center justify-center"><Plus size={14}/></button>
                                </div>
                            </div>

                            {/* Product Type Selector */}
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Tipo de Produto</label>
                                <div className="space-y-2">
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${productType === 'CP_STANDARD' ? 'bg-brand-blue/10 border-brand-blue text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                        <input type="radio" name="ptype" className="hidden" checked={productType === 'CP_STANDARD'} onChange={() => setProductType('CP_STANDARD')} />
                                        <BadgeCheck size={18} className={productType === 'CP_STANDARD' ? 'text-brand-blue' : ''} />
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">Produto Próprio (CP)</div>
                                            <div className="text-[10px] opacity-70">Venda direta, sem comissão para parceiros.</div>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${productType === 'CP_AFFILIATE' ? 'bg-green-900/20 border-green-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                        <input type="radio" name="ptype" className="hidden" checked={productType === 'CP_AFFILIATE'} onChange={() => setProductType('CP_AFFILIATE')} />
                                        <DollarSign size={18} className={productType === 'CP_AFFILIATE' ? 'text-green-500' : ''} />
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">Produto com Comissão</div>
                                            <div className="text-[10px] opacity-70">Produto CP liberado para revenda de parceiros.</div>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${productType === 'PARTNER_EXCLUSIVE' ? 'bg-brand-yellow/10 border-brand-yellow text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                        <input type="radio" name="ptype" className="hidden" checked={productType === 'PARTNER_EXCLUSIVE'} onChange={() => setProductType('PARTNER_EXCLUSIVE')} />
                                        <Star size={18} className={productType === 'PARTNER_EXCLUSIVE' ? 'text-brand-yellow' : ''} />
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">Exclusivo de Parceiro</div>
                                            <div className="text-[10px] opacity-70">Produto com Comissão Especial.</div>
                                        </div>
                                    </label>
                                </div>

                                {/* Partner Selector (Conditional) */}
                                {productType === 'PARTNER_EXCLUSIVE' && (
                                    <div className="mt-4 animate-fade-in space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-brand-yellow uppercase mb-1 block">Selecione o Parceiro Dono</label>
                                            <select 
                                                className="w-full bg-slate-900 border border-brand-yellow/50 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-yellow"
                                                value={editProduct.partnerId || ''}
                                                onChange={e => setEditProduct({...editProduct, partnerId: e.target.value})}
                                            >
                                                <option value="">Selecione...</option>
                                                {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-brand-yellow uppercase mb-1 block">Comissão Especial (%)</label>
                                            <div className="relative">
                                                <input 
                                                    type="number" 
                                                    className="w-full bg-slate-900 border border-brand-yellow/50 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-yellow"
                                                    value={((editProduct.commissionRate || 0) * 100).toFixed(0)}
                                                    onChange={e => setEditProduct({...editProduct, commissionRate: Number(e.target.value) / 100})}
                                                    min="0" max="100"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-1">Defina a porcentagem que este parceiro recebe por venda deste produto. (Deixe 0 para usar padrão do parceiro)</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Images Grid */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                    <ImageIcon size={14}/> Galeria de Imagens (Máx 4)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {imageUrls.map((url, idx) => (
                                        <div key={idx} className="relative group">
                                            <div className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden bg-slate-950 ${idx === 0 ? 'border-brand-blue/50' : 'border-slate-800'}`}>
                                                {url ? (
                                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-slate-600 flex flex-col items-center">
                                                        <Upload size={20} className="mb-1"/>
                                                        <span className="text-[10px] uppercase font-bold">{idx === 0 ? 'Principal' : 'Extra'}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <input 
                                                type="text" 
                                                className="absolute bottom-0 left-0 w-full bg-slate-900/90 text-[10px] text-white p-1 border-t border-slate-700 outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                                                placeholder="Cole a URL da imagem..."
                                                value={url}
                                                onChange={e => updateImageUrl(idx, e.target.value)}
                                            />
                                            {idx === 0 && <span className="absolute top-2 left-2 bg-brand-blue text-white text-[9px] font-bold px-1.5 py-0.5 rounded">CAPA</span>}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2">* Cole a URL da imagem no campo que aparece ao passar o mouse sobre o quadrado.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                         <button onClick={() => setIsEditing(false)} className="bg-slate-700 text-white px-4 py-2 rounded font-bold">Cancelar</button>
                         <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                            <Save size={18}/> Salvar Produto
                         </button>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                 <table className="w-full text-sm text-left text-slate-400">
                    <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Produto</th>
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4">Estoque (Calc.)</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Preço</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filtered.map(p => {
                             const calculatedStock = mockService.getVirtualStock(p.id);
                             const stockColor = calculatedStock === 0 ? 'text-red-500' : calculatedStock < 10 ? 'text-orange-400' : 'text-green-400';
                             
                             return (
                             <tr key={p.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="relative">
                                        <img src={p.imageUrl} className="w-10 h-10 rounded bg-slate-950 object-cover" alt="" />
                                        {p.additionalImages && p.additionalImages.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-slate-700 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                                                +{p.additionalImages.length}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-white font-medium block">{p.name}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            {p.isBestSeller && (
                                                <span className="text-[9px] bg-brand-yellow/20 text-brand-yellow px-1.5 py-0.5 rounded flex items-center gap-1 border border-brand-yellow/30"><Trophy size={9}/> Mais Vendido</span>
                                            )}
                                            {p.isFeatured && (
                                                <span className="text-[9px] bg-brand-blue/20 text-brand-blue px-1.5 py-0.5 rounded flex items-center gap-1 border border-brand-blue/30"><Star size={9}/> Destaque</span>
                                            )}
                                            {p.recipe && p.recipe.length > 0 && (
                                                <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1" title="Possui Ficha Técnica"><Link2 size={9}/> BOM</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{p.category}</td>
                                <td className="px-6 py-4">
                                    <div className={`font-mono font-bold flex items-center gap-1 ${stockColor}`}>
                                        <Boxes size={14}/>
                                        {calculatedStock > 900 ? '∞' : calculatedStock}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {p.isExclusive ? (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-brand-yellow uppercase bg-brand-yellow/10 px-2 py-1 rounded border border-brand-yellow/20 w-fit">
                                            <Star size={10} /> Exclusivo
                                        </span>
                                    ) : p.allowAffiliate ? (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 uppercase bg-green-900/20 px-2 py-1 rounded border border-green-500/20 w-fit">
                                            <DollarSign size={10} /> Comissionado
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-brand-blue uppercase bg-brand-blue/10 px-2 py-1 rounded border border-brand-blue/20 w-fit">
                                            <BadgeCheck size={10} /> Próprio CP
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-white">
                                    {p.plans ? (
                                        <span className="text-brand-blue flex items-center gap-1"><Calendar size={14}/> Por Plano</span>
                                    ) : p.priceTiers ? (
                                        <span className="text-orange-400 flex items-center gap-1"><Layers size={14}/> Atacado</span>
                                    ) : (
                                        `¥${p.price.toLocaleString()}`
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => { handleEdit(p); }} className="p-2 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50"><Edit size={16}/></button>
                                    <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50"><Trash2 size={16}/></button>
                                </td>
                             </tr>
                        )})}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};