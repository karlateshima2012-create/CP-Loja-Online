import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { Product, PriceTier, PlanOption, RecipeItem, RawMaterial } from '@/src/types';
import { Package, Plus, Edit, Trash2, X, BadgeCheck, DollarSign, Image as ImageIcon, Upload, Save, Layers, PenTool, Calendar, Trophy, Boxes, Link2, Truck, Megaphone, ThumbsUp, Gift } from 'lucide-react';

export const ProductsManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [search, setSearch] = useState('');

    // Form States
    const [editProduct, setEditProduct] = useState<Partial<Product>>({});
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
        setProducts([...mockService.getProducts()].reverse());
        setMaterials(mockService.getMaterials());
    }, []);

    const handleNew = () => {
        setEditProduct({ price: 0 });
        setImageUrls(['', '', '', '']);
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

        const imgs = [product.imageUrl, ...(product.additionalImages || [])];
        while (imgs.length < 4) imgs.push('');
        setImageUrls(imgs.slice(0, 4));

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

        setIsCustomizable(!!product.isCustomizable);
        setIncludesFreePage(!!product.includesFreePage);
        setIsFeatured(!!product.isFeatured);
        setIsRecommended(!!product.isRecommended);
        setIsBestSeller(!!product.isBestSeller);
        setRecipe(product.recipe || []);

        setIsEditing(true);
    };

    const addTier = () => {
        if (!newTierQty || !newTierPrice) return;
        const qty = parseInt(newTierQty);
        const price = parseInt(newTierPrice);
        if (qty > 0 && price >= 0) {
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
            isBestSeller: i === index
        }));
        setTempTiers(updatedTiers);
    };

    const addRecipeItem = () => {
        if (!newRecipeMatId) return;
        const qty = 1;
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
        if (!editProduct.name || !imageUrls[0]) {
            alert("Nome e Imagem Principal são obrigatórios.");
            return;
        }

        const validImages = imageUrls.filter(url => url.trim() !== '');
        const mainImage = validImages[0];
        const additionalImages = validImages.slice(1);

        const newProduct = { ...editProduct } as Product;
        newProduct.imageUrl = mainImage;
        newProduct.additionalImages = additionalImages;

        if (pricingStrategy === 'TIER') {
            newProduct.priceTiers = tempTiers;
            newProduct.plans = undefined;
            newProduct.price = 0;
        } else if (pricingStrategy === 'PLAN') {
            newProduct.priceTiers = undefined;
            const plans: PlanOption[] = [];
            if (planPrices.p12) plans.push({ months: 12, totalPrice: Number(planPrices.p12), description: 'Plano Anual' });
            if (planPrices.p24) plans.push({ months: 24, totalPrice: Number(planPrices.p24), description: 'Plano 2 Anos' });
            if (planPrices.p48) plans.push({ months: 48, totalPrice: Number(planPrices.p48), description: 'Plano 4 Anos' });
            newProduct.plans = plans;
            newProduct.price = 0;
        } else {
            newProduct.priceTiers = undefined;
            newProduct.plans = undefined;
        }

        newProduct.recipe = recipe.length > 0 ? recipe : undefined;
        newProduct.isCustomizable = isCustomizable;
        newProduct.includesFreePage = includesFreePage;
        newProduct.isFeatured = isFeatured;
        newProduct.isRecommended = isRecommended;
        newProduct.isBestSeller = isBestSeller;

        newProduct.isExclusive = false;
        newProduct.allowAffiliate = false;

        mockService.saveProduct(newProduct);
        setProducts([...mockService.getProducts()].reverse());
        setIsEditing(false);
        setEditProduct({});
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Excluir produto?')) {
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
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Package size={20} /> Gerenciar Produtos</h2>
                <div className="flex gap-4">
                    <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
                    <button onClick={handleNew} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                        <Plus size={16} /> Novo Produto
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-white text-lg">{editProduct.id ? 'Editar Produto' : 'Novo Produto'}</h3>
                        <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome do Produto</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" value={editProduct.name || ''} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição do Produto</label>
                                <textarea className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white h-32 resize-none" value={editProduct.description || ''} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} />
                            </div>

                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <DollarSign size={14} /> Estratégia de Preço
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
                                        Atacado
                                    </button>
                                    <button
                                        onClick={() => setPricingStrategy('PLAN')}
                                        className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${pricingStrategy === 'PLAN' ? 'bg-brand-blue/20 border-brand-blue text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'}`}
                                    >
                                        Planos
                                    </button>
                                </div>

                                {pricingStrategy === 'UNIT' && (
                                    <div className="animate-fade-in space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Preço Unitário (¥)</label>
                                            <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" type="number" value={editProduct.price || ''} onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                )}

                                {pricingStrategy === 'TIER' && (
                                    <div className="space-y-3 animate-fade-in">
                                        <div className="flex gap-2 items-end">
                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase text-slate-500 block mb-1">Qtd</label>
                                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm" value={newTierQty} onChange={e => setNewTierQty(e.target.value)} />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase text-slate-500 block mb-1">Total (¥)</label>
                                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm" value={newTierPrice} onChange={e => setNewTierPrice(e.target.value)} />
                                            </div>
                                            <button onClick={addTier} className="bg-brand-blue text-white p-1.5 rounded hover:bg-brand-blue/90 h-8 w-8 flex items-center justify-center"><Plus size={16} /></button>
                                        </div>
                                        <div className="space-y-1">
                                            {tempTiers.map((tier, idx) => (
                                                <div key={idx} className={`flex justify-between items-center p-2 rounded text-sm border ${tier.isBestSeller ? 'bg-brand-blue/10 border-brand-blue' : 'bg-slate-900 border-slate-800'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => toggleBestSellerTier(idx)} className={`p-1 rounded hover:bg-slate-800 ${tier.isBestSeller ? 'text-brand-yellow' : 'text-slate-600'}`}>
                                                            <Trophy size={14} fill={tier.isBestSeller ? "currentColor" : "none"} />
                                                        </button>
                                                        <span className="text-white font-bold">{tier.quantity} un.</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-green-400">¥{tier.totalPrice.toLocaleString()}</span>
                                                        <button onClick={() => removeTier(idx)} className="text-slate-600 hover:text-red-400"><X size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {pricingStrategy === 'PLAN' && (
                                    <div className="space-y-3 animate-fade-in">
                                        <div>
                                            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">12 Meses</label>
                                            <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" value={planPrices.p12} onChange={e => setPlanPrices({ ...planPrices, p12: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">24 Meses</label>
                                            <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" value={planPrices.p24} onChange={e => setPlanPrices({ ...planPrices, p24: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">48 Meses</label>
                                            <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" value={planPrices.p48} onChange={e => setPlanPrices({ ...planPrices, p48: e.target.value })} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Categoria</label>
                                <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" list="categories" value={editProduct.category || ''} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} />
                                <datalist id="categories">
                                    <option value="Tecnologia NFC" /><option value="Impressão 3D" /><option value="Serviços Digitais" />
                                </datalist>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block text-primary">Configurações Especiais</label>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer hover:border-brand-blue transition-all group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-brand-blue focus:ring-brand-blue"
                                            checked={isCustomizable}
                                            onChange={e => setIsCustomizable(e.target.checked)}
                                        />
                                        <div>
                                            <div className="font-bold text-white text-sm group-hover:text-brand-blue transition-colors">Produto Personalizado</div>
                                            <div className="text-[10px] text-slate-500">Exige envio de logo ou informações no checkout</div>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer hover:border-brand-pink transition-all group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-brand-pink focus:ring-brand-pink"
                                            checked={includesFreePage}
                                            onChange={e => setIncludesFreePage(e.target.checked)}
                                        />
                                        <div>
                                            <div className="font-bold text-white text-sm group-hover:text-brand-pink transition-colors">Bônus Página Free (Connect)</div>
                                            <div className="text-[10px] text-slate-500">Ativa a criação da página pública para este produto</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <Megaphone size={14} /> Marketing
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                                        <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} /> Destaque
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                                        <input type="checkbox" checked={isRecommended} onChange={e => setIsRecommended(e.target.checked)} /> Recomendado
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                                        <input type="checkbox" checked={isBestSeller} onChange={e => setIsBestSeller(e.target.checked)} /> Mais Vendido
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2">Imagens (Máx 4)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {imageUrls.map((url, idx) => (
                                        <div key={idx} className="relative group aspect-square rounded-lg border-2 border-dashed border-slate-800 flex flex-col items-center justify-center overflow-hidden bg-slate-950">
                                            {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : <Upload size={20} className="text-slate-700" />}
                                            <input type="text" className="absolute bottom-0 left-0 w-full bg-slate-900/90 text-[8px] text-white p-1 outline-none opacity-0 group-hover:opacity-100 transition-opacity" placeholder="URL da imagem" value={url} onChange={e => updateImageUrl(idx, e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button onClick={() => setIsEditing(false)} className="bg-slate-700 text-white px-4 py-2 rounded font-bold">Cancelar</button>
                        <button onClick={handleSave} className="bg-brand-blue text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                            <Save size={18} /> Salvar Produto
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
                            <th className="px-6 py-4">Estoque</th>
                            <th className="px-6 py-4">Preço</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filtered.map(p => (
                            <tr key={p.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={p.imageUrl} className="w-10 h-10 rounded bg-slate-950 object-cover" alt="" />
                                    <span className="text-white font-medium">{p.name}</span>
                                </td>
                                <td className="px-6 py-4 text-xs">{p.category}</td>
                                <td className="px-6 py-4 font-mono text-xs">{mockService.getVirtualStock(p.id)}</td>
                                <td className="px-6 py-4 text-white text-xs">
                                    {p.plans ? 'Plano' : p.priceTiers ? 'Atacado' : `¥${p.price.toLocaleString()}`}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEdit(p)} className="p-2 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};