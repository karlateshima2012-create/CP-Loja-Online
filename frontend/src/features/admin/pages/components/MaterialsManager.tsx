
import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { RawMaterial } from '@/src/types';
import { Boxes, Plus, Edit, Trash2, X, Save, AlertTriangle, Search } from 'lucide-react';

export const MaterialsManager: React.FC = () => {
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<RawMaterial>>({});
    const [search, setSearch] = useState('');

    useEffect(() => {
        setMaterials(mockService.getMaterials());
    }, []);

    const handleNew = () => {
        setEditForm({ unit: 'un', currentStock: 0, minStock: 10 });
        setIsEditing(true);
    };

    const handleEdit = (m: RawMaterial) => {
        setEditForm({ ...m });
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Excluir este insumo? Isso pode afetar receitas de produtos.')) {
            mockService.deleteMaterial(id);
            setMaterials([...mockService.getMaterials()]);
        }
    };

    const handleSave = () => {
        if (!editForm.name) {
            alert("Nome do insumo é obrigatório.");
            return;
        }
        
        mockService.saveMaterial(editForm as RawMaterial);
        setMaterials([...mockService.getMaterials()]);
        setIsEditing(false);
        setEditForm({});
    };

    const filtered = materials.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg gap-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Boxes size={20}/> Estoque de Insumos</h2>
                <div className="flex gap-4 w-full md:w-auto">
                     <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-white text-sm" placeholder="Buscar insumo..." value={search} onChange={e => setSearch(e.target.value)} />
                     </div>
                     <button onClick={handleNew} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue/90 transition-colors whitespace-nowrap">
                        <Plus size={16}/> Novo Insumo
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl mb-6">
                    <div className="flex justify-between items-start mb-6">
                         <h3 className="font-bold text-white text-lg">{editForm.id ? 'Editar Insumo' : 'Novo Insumo'}</h3>
                         <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Nome do Material</label>
                            <input className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Ex: Argola de Metal 20mm" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Unidade de Medida</label>
                            <select className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.unit || 'un'} onChange={e => setEditForm({...editForm, unit: e.target.value})}>
                                <option value="un">Unidade (un)</option>
                                <option value="g">Gramas (g)</option>
                                <option value="kg">Quilos (kg)</option>
                                <option value="ml">Mililitros (ml)</option>
                                <option value="l">Litros (l)</option>
                                <option value="m">Metros (m)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Estoque Mínimo (Alerta)</label>
                            <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.minStock || 0} onChange={e => setEditForm({...editForm, minStock: Number(e.target.value)})} />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Estoque Atual</label>
                            <div className="flex items-center gap-2">
                                <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono text-lg font-bold" value={editForm.currentStock || 0} onChange={e => setEditForm({...editForm, currentStock: Number(e.target.value)})} />
                                <span className="text-slate-400 font-bold">{editForm.unit}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                         <button onClick={() => setIsEditing(false)} className="bg-slate-700 text-white px-4 py-2 rounded font-bold">Cancelar</button>
                         <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                            <Save size={18}/> Salvar
                         </button>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                 <table className="w-full text-sm text-left text-slate-400">
                    <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Insumo</th>
                            <th className="px-6 py-4 text-center">Unidade</th>
                            <th className="px-6 py-4 text-right">Estoque Atual</th>
                            <th className="px-6 py-4 text-right">Mínimo</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filtered.map(m => {
                            const isLow = m.currentStock <= m.minStock;
                            return (
                                <tr key={m.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                                        {m.name}
                                        {isLow && <span className="text-xs bg-red-900/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded flex items-center gap-1"><AlertTriangle size={10}/> Baixo</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500 bg-slate-900/50">{m.unit}</td>
                                    <td className={`px-6 py-4 text-right font-mono font-bold text-lg ${isLow ? 'text-red-400' : 'text-green-400'}`}>
                                        {m.currentStock.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-500">{m.minStock.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEdit(m)} className="p-2 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-slate-500">Nenhum insumo encontrado.</td></tr>
                        )}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};
