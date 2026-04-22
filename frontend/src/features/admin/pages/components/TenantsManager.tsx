import React, { useState, useEffect } from 'react';
import { adminService, TenantListItem } from '../../services/admin.service';
import { Globe, Shield, Activity, Calendar } from 'lucide-react';

export const TenantsManager: React.FC = () => {
    const [tenants, setTenants] = useState<TenantListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        const fetchTenants = async () => {
            setLoading(true);
            try {
                const response = await adminService.getTenants(page);
                setTenants(response.data);
                setLastPage(response.last_page);
            } catch (err) {
                console.error('Error fetching tenants', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTenants();
    }, [page]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <Globe className="text-brand-blue" /> Clientes Multi-Tenant
                </h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Empresa (Tenant)</th>
                                <th className="px-6 py-4">Slug / Domínio</th>
                                <th className="px-6 py-4 text-center">Plano</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Criado em</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center">Carregando tenants...</td></tr>
                            ) : tenants.length > 0 ? (
                                tenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-blue font-bold group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                                    {tenant.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{tenant.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{tenant.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-brand-blue font-medium">/{tenant.slug}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-white border border-slate-700">
                                                {tenant.plan?.name || 'Sem Plano'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tenant.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' : 'bg-red-900/30 text-red-100 border border-red-500/20'
                                                }`}>
                                                {tenant.status === 'active' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-500 font-medium">
                                            {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Nenhum tenant encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {lastPage > 1 && (
                    <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-center gap-2">
                        {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${page === p ? 'bg-brand-blue text-white' : 'bg-slate-900 text-slate-500 hover:text-white'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
