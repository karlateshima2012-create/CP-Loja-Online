
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { mockService } from '@/src/services/mockData';
import { flixService } from '../../services/flix.service';
import { FlixProfile, Customer, FlixLink, FlixStyleConfig, FlixPageType, FlixPlanType, Order, UserRole, FlixFontSize, FlixButtonStyle, FlixButtonShape } from '@/src/types';
import {
    Plus, Edit, Trash2, X, Save, Search, ExternalLink, Link2,
    Image as ImageIcon, Palette, Layout, Smartphone, ChevronDown, ChevronUp, GripVertical, Check, RefreshCw, Upload, ZoomIn, Move, Copy, Eye, Clapperboard, Calendar, Crown, ShoppingBag, ShieldCheck, AlertCircle, Type, MousePointerClick, Target, Hash, Tag, Lock, Settings
} from 'lucide-react';
import {
    Instagram, MapPin, Globe as GlobeIcon, Menu, Phone, MessageCircle, Youtube, Share2,
    Mail, Facebook, DollarSign
} from 'lucide-react';

const DEFAULT_STYLE: FlixStyleConfig = {
    backgroundType: 'color',
    backgroundColor: '#ffffff',
    buttonStyle: 'soft-shadow',
    buttonShape: 'rounded',
    buttonColor: '#ffffff',
    buttonTextColor: '#000000',
    effectColor: '#000000',
    textColor: '#000000',
    fontFamily: 'sans',
    fontSize: 'md',
    textTransform: 'none',
    layoutMode: 'stack'
};

const COLOR_PRESETS = ['#ffffff', '#000000', '#f3f4f6', '#e5e7eb', '#38b6ff', '#e5157a', '#fff200', '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];

const PAGE_TYPES: { value: FlixPageType; label: string }[] = [
    { value: 'LINKS', label: 'Links (Padrão)' },
    { value: 'LANDING', label: 'Landing Page' },
    { value: 'STORE', label: 'Loja Online' },
    { value: 'MENU', label: 'Menu Interativo' },
    { value: 'CATALOG', label: 'Catálogo Digital' },
    { value: 'SERVICES', label: 'Página de Serviços' }
];

const SHAPE_LABELS: Record<FlixButtonShape, string> = {
    rounded: 'Arredondado',
    pill: 'Círculo',
    square: 'Quadrado',
    sharp: 'Reto'
};

const STYLE_LABELS: Record<FlixButtonStyle, string> = {
    solid: 'Sólido',
    outline: 'Borda',
    glass: 'Vidro',
    'hard-shadow': 'Sombra Dura',
    'soft-shadow': 'Sombra Suave'
};

const DEFAULT_CATEGORIES = ['Geral', 'Gastronomia', 'Automotivo', 'Saúde & Beleza', 'Tecnologia', 'Serviços', 'Educação', 'Imobiliária', 'Varejo / Loja', 'Influencer / Criador', 'Arte & Design', 'Entretenimento'];

// --- IMAGE CROPPER ---
interface ImageCropperProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (base64: string) => void;
    aspectRatio: number;
    title: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ isOpen, onClose, onSave, aspectRatio, title }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => { if (!isOpen) { setImageSrc(null); setZoom(1); setOffset({ x: 0, y: 0 }); } }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => setImageSrc(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!imageSrc || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const outputWidth = 800;
            const outputHeight = 800 / aspectRatio;
            canvas.width = outputWidth;
            canvas.height = outputHeight;
            if (ctx) {
                ctx.clearRect(0, 0, outputWidth, outputHeight);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, outputWidth, outputHeight);
                const scale = Math.max(outputWidth / img.width, outputHeight / img.height) * zoom;
                const x = (outputWidth - img.width * scale) / 2 + (offset.x * (outputWidth / 300));
                const y = (outputHeight - img.height * scale) / 2 + (offset.y * (outputWidth / 300));
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                onSave(canvas.toDataURL('image/jpeg', 0.9));
                onClose();
            }
        };
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 text-slate-800">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                </div>
                <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center">
                    {!imageSrc ? (
                        <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-brand-blue transition-colors group">
                            <div className="bg-brand-blue/10 p-4 rounded-full text-brand-blue mb-2 group-hover:scale-110 transition-transform"><Upload size={32} /></div>
                            <span className="text-sm font-bold text-slate-500">Clique para carregar imagem</span>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center">
                            <div className="relative overflow-hidden bg-slate-100 border border-slate-200 shadow-inner cursor-move mb-6" style={{ width: '300px', height: `${300 / aspectRatio}px` }} onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); }} onMouseMove={(e) => { if (isDragging) setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)} ref={containerRef}>
                                <img src={imageSrc} alt="Crop" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: 'center', maxWidth: 'none', maxHeight: 'none' }} draggable={false} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none" />
                            </div>
                            <div className="w-full px-8 space-y-4">
                                <div className="flex items-center gap-4"><ZoomIn size={16} className="text-slate-400" /><input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} className="w-full accent-brand-blue" /></div>
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400"><Move size={12} /> Arraste a imagem para ajustar</div>
                            </div>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                    {imageSrc ? (
                        <><button onClick={() => setImageSrc(null)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700">Trocar Foto</button><button onClick={handleSave} className="flex-1 bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20">Confirmar Recorte</button></>
                    ) : (<button onClick={onClose} className="w-full text-slate-500 font-bold text-sm">Cancelar</button>)}
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ icon: Icon, title, extra }: { icon: any, title: string, extra?: React.ReactNode }) => (
    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Icon size={16} className="text-slate-500" />
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">{title}</h4>
        </div>
        {extra}
    </div>
);

const TemplateButton = ({ id, label, desc, active, onClick }: { id: string, label: string, desc: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        type="button"
        className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 w-full ${active ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-100 hover:border-slate-200'}`}
    >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-brand-blue' : 'border-slate-300'}`}>
            {active && <div className="w-2.5 h-2.5 bg-brand-blue rounded-full"></div>}
        </div>
        <div className="min-w-0 flex-1">
            <div className={`font-bold text-[11px] uppercase tracking-wider truncate ${active ? 'text-brand-blue' : 'text-slate-800'}`}>{label}</div>
            <div className="text-[9px] text-slate-500 leading-tight mt-0.5 line-clamp-2">{desc}</div>
        </div>
    </button>
);

export const FlixManager: React.FC = () => {
    const { role } = useAuth();
    const [profiles, setProfiles] = useState<FlixProfile[]>([]);
    const [viewMode, setViewMode] = useState<'LIST' | 'BUILDER'>('LIST');
    const [editForm, setEditForm] = useState<Partial<FlixProfile>>({});
    const [tagsInput, setTagsInput] = useState('');
    const [activeTab, setActiveTab] = useState<'SETTINGS' | 'CONTENT' | 'DESIGN' | 'ADMIN'>('SETTINGS');
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [cropperOpen, setCropperOpen] = useState(false);
    const [cropperType, setCropperType] = useState<'PROFILE' | 'COVER' | 'POSTER'>('PROFILE');
    const [checkOrderId, setCheckOrderId] = useState('');
    const [orderStatusMsg, setOrderStatusMsg] = useState<{ status: 'success' | 'error' | 'neutral', msg: string } | null>(null);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const profile = await flixService.getMyPage();
                if (profile) {
                    setProfiles([profile]);
                } else if (role === UserRole.ADMIN) {
                    // Admins see all for now via mock or we should add an admin list endpoint
                    setProfiles(mockService.getFlixProfiles());
                }
            } catch (err) {
                console.error("Error fetching flix page", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [viewMode, role]);

    const handleNew = () => {
        setEditForm({ active: true, planType: 'FREE', pageType: 'LINKS', links: [], style: { ...DEFAULT_STYLE }, tags: [], category: 'Geral', views: 0 });
        setTagsInput('');
        setViewMode('BUILDER');
        setActiveTab('SETTINGS');
    };

    const handleEdit = (p: FlixProfile) => {
        setEditForm({ ...p });
        setTagsInput(p.tags ? p.tags.join(', ') : '');
        setIsCustomCategory(p.category && !DEFAULT_CATEGORIES.includes(p.category));
        setCheckOrderId(p.linkedOrderId || '');
        setViewMode('BUILDER');
        setActiveTab('SETTINGS');
    };

    const handleSave = async () => {
        if (!editForm.displayName) { alert("Nome é obrigatório."); return; }

        setIsLoading(true);
        try {
            await flixService.savePage(editForm.id!, editForm);
            alert("Página salva com sucesso!");

            // Refresh local list
            const profile = await flixService.getMyPage();
            if (profile) setProfiles([profile]);

            setViewMode('LIST');
        } catch (err) {
            console.error("Error saving page", err);
            alert("Erro ao salvar página.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStyleUpdate = (updates: Partial<FlixStyleConfig>) => {
        setEditForm(prev => ({ ...prev, style: { ...DEFAULT_STYLE, ...(prev.style || {}), ...updates } }));
    };

    const handleAddLink = () => {
        const newLink: FlixLink = { id: `lnk-${Date.now()}`, type: 'link', label: 'Novo Link', url: 'https://', active: true, order: (editForm.links?.length || 0) + 1 };
        setEditForm(prev => ({ ...prev, links: [...(prev.links || []), newLink] }));
    };

    const handleAddHeader = () => {
        const newHeader: FlixLink = { id: `hdr-${Date.now()}`, type: 'header', label: 'Nova Seção', active: true, order: (editForm.links?.length || 0) + 1 };
        setEditForm(prev => ({ ...prev, links: [...(prev.links || []), newHeader] }));
    };

    const handleUpdateLink = (id: string, updates: Partial<FlixLink>) => {
        setEditForm(prev => ({ ...prev, links: prev.links?.map(l => l.id === id ? { ...l, ...updates } : l) }));
    };

    const handleDeleteLink = (id: string) => {
        setEditForm(prev => ({ ...prev, links: prev.links?.filter(l => l.id !== id) }));
    };

    const moveLink = (index: number, direction: 'up' | 'down') => {
        setEditForm(prev => {
            if (!prev.links) return prev;
            const links = [...prev.links];
            if (direction === 'up' && index > 0) [links[index], links[index - 1]] = [links[index - 1], links[index]];
            else if (direction === 'down' && index < links.length - 1) [links[index], links[index + 1]] = [links[index + 1], links[index]];
            links.forEach((l, i) => l.order = i);
            return { ...prev, links };
        });
    };

    if (viewMode === 'LIST') {
        const filtered = profiles.filter(p => p.displayName.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()));
        return (
            <div className="space-y-6 animate-fade-in text-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Clapperboard size={20} className="text-brand-pink" /> Portal Admin - CreativeFlix</h2>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-white text-sm outline-none" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                        <button onClick={handleNew} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue/90 whitespace-nowrap"><Plus size={16} /> Nova Página</button>
                    </div>
                </div>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr><th className="px-6 py-4">Poster</th><th className="px-6 py-4">Página</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Ações</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4"><div className="w-10 h-14 bg-slate-800 rounded border border-slate-700 overflow-hidden">{p.posterImageUrl && <img src={p.posterImageUrl} className="w-full h-full object-cover" />}</div></td>
                                    <td className="px-6 py-4"><div className="font-bold text-white">{p.displayName}</div><div className="text-xs">/{p.slug}</div></td>
                                    <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.planType === 'PREMIUM' ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-800 text-slate-500'}`}>{p.planType}</span></td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => handleEdit(p)} className="p-2 bg-blue-900/30 text-blue-400 rounded"><Edit size={16} /></button><button onClick={() => { if (window.confirm('Excluir?')) mockService.deleteFlixProfile(p.id); setProfiles([...mockService.getFlixProfiles()]); }} className="p-2 bg-red-900/30 text-red-400 rounded"><Trash2 size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-50 z-[50] flex flex-col text-slate-800">
            <ImageCropper isOpen={cropperOpen} onClose={() => setCropperOpen(false)} onSave={(b64) => setEditForm(prev => ({ ...prev, [cropperType === 'PROFILE' ? 'profileImageUrl' : cropperType === 'COVER' ? 'coverImageUrl' : 'posterImageUrl']: b64 }))} aspectRatio={cropperType === 'PROFILE' ? 1 : cropperType === 'COVER' ? 1.3 : 0.66} title="Recortar Imagem" />

            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => setViewMode('LIST')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600"><X size={20} /></button>
                    <span className="font-bold text-slate-800 whitespace-nowrap">Editor de Página</span>
                    <div className="flex items-center gap-2 ml-4">
                        <button onClick={handleSave} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20 text-xs"><Save size={14} /> Salvar Alterações</button>
                        <a href={`#/page/${editForm.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-xs border border-slate-200"><ExternalLink size={14} /> Ver Online</a>
                    </div>
                    <span className="text-sm text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded truncate ml-4 border border-slate-100">/{editForm.slug || 'nova-pagina'}</span>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-full md:w-[450px] bg-white border-r border-slate-200 flex flex-col shadow-xl z-10">
                    <div className="flex gap-2 p-2 bg-slate-100 border-b border-slate-200">
                        {['SETTINGS', 'CONTENT', 'DESIGN', 'ADMIN'].map((tab) => (
                            role === UserRole.ADMIN || tab !== 'ADMIN' ? (
                                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-all ${activeTab === tab ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                                    {tab === 'SETTINGS' && <><Layout size={18} /> Perfil</>}
                                    {tab === 'CONTENT' && <><Link2 size={18} /> Links</>}
                                    {tab === 'DESIGN' && <><Palette size={18} /> Visual</>}
                                    {tab === 'ADMIN' && <><ShieldCheck size={18} /> Admin</>}
                                </button>
                            ) : null
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                        {activeTab === 'SETTINGS' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <SectionHeader icon={Type} title="Informações Básicas" />
                                    <div className="p-4 space-y-4">
                                        <div><label className="text-xs font-bold text-slate-700 mb-1 block">Nome do Perfil</label><input className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 shadow-sm outline-none" value={editForm.displayName || ''} onChange={e => setEditForm(prev => ({ ...prev, displayName: e.target.value }))} /></div>
                                        <div><label className="text-xs font-bold text-slate-700 mb-1 block">Nome da Empresa</label><input className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 shadow-sm outline-none" value={editForm.companyName || ''} onChange={e => setEditForm(prev => ({ ...prev, companyName: e.target.value }))} /></div>
                                        <div><label className="text-xs font-bold text-slate-700 mb-1 block">WhatsApp / Telefone</label><input className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 shadow-sm outline-none" value={editForm.phone || ''} onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))} /></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-xs font-bold text-slate-700 mb-1 block">Cidade</label><input className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 shadow-sm outline-none" value={editForm.city || ''} onChange={e => setEditForm(prev => ({ ...prev, city: e.target.value }))} /></div>
                                            <div><label className="text-xs font-bold text-slate-700 mb-1 block">Província</label><input className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 shadow-sm outline-none" value={editForm.province || ''} onChange={e => setEditForm(prev => ({ ...prev, province: e.target.value }))} /></div>
                                        </div>
                                        <div><label className="text-xs font-bold text-slate-700 mb-1 block">Slogan</label><input className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 shadow-sm outline-none" value={editForm.slogan || ''} onChange={e => setEditForm(prev => ({ ...prev, slogan: e.target.value }))} /></div>
                                        <div><label className="text-xs font-bold text-slate-700 mb-1 block">Bio Completa</label><textarea className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 shadow-sm outline-none h-24" value={editForm.fullBio || ''} onChange={e => setEditForm(prev => ({ ...prev, fullBio: e.target.value }))} /></div>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <SectionHeader icon={ImageIcon} title="Identidade Visual" />
                                    <div className="p-4 space-y-4">
                                        <button onClick={() => { setCropperType('COVER'); setCropperOpen(true); }} className="w-full h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden relative group">
                                            {editForm.coverImageUrl ? <img src={editForm.coverImageUrl} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center"><ImageIcon size={24} /><span>Banner de Capa</span></div>}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold">Trocar Banner</div>
                                        </button>
                                        <button onClick={() => { setCropperType('PROFILE'); setCropperOpen(true); }} className="w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden mx-auto relative group">
                                            {editForm.profileImageUrl ? <img src={editForm.profileImageUrl} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center"><ImageIcon size={20} /><span>Foto</span></div>}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold">Trocar Foto</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'CONTENT' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <SectionHeader icon={Link2} title="Gerenciar Conteúdo" />
                                    <div className="p-4 space-y-3">
                                        <button onClick={handleAddLink} className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={18} /> Novo Link</button>
                                        <button onClick={handleAddHeader} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={18} /> Nova Seção</button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {editForm.links?.sort((a, b) => a.order - b.order).map((link, idx) => (
                                        <div key={link.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group">
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => moveLink(idx, 'up')} className="text-slate-400 hover:text-brand-blue"><ChevronUp size={16} /></button>
                                                <button onClick={() => moveLink(idx, 'down')} className="text-slate-400 hover:text-brand-blue"><ChevronDown size={16} /></button>
                                            </div>
                                            <div className="pl-6 pr-8">
                                                <input className="w-full font-bold mb-2 outline-none border-b border-transparent focus:border-slate-200" value={link.label} onChange={e => handleUpdateLink(link.id, { label: e.target.value })} placeholder="Título" />
                                                {link.type === 'link' && <input className="w-full text-xs text-slate-500 outline-none" value={link.url} onChange={e => handleUpdateLink(link.id, { url: e.target.value })} placeholder="URL (https://...)" />}
                                            </div>
                                            <button onClick={() => handleDeleteLink(link.id)} className="absolute right-4 top-4 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'DESIGN' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <SectionHeader icon={Palette} title="Brand Kit e Cores" />
                                    <div className="p-4 space-y-6">
                                        <div className="flex gap-4">
                                            <button onClick={() => handleStyleUpdate({ backgroundColor: '#ffffff', buttonColor: '#38b6ff', effectColor: '#38b6ff', buttonTextColor: '#ffffff' })} className="w-10 h-10 rounded-full bg-brand-blue border-2 border-white shadow-md hover:scale-110" title="Azul CP"></button>
                                            <button onClick={() => handleStyleUpdate({ backgroundColor: '#ffffff', buttonColor: '#E5157A', effectColor: '#E5157A', buttonTextColor: '#ffffff' })} className="w-10 h-10 rounded-full bg-brand-pink border-2 border-white shadow-md hover:scale-110" title="Rosa CP"></button>
                                            <button onClick={() => handleStyleUpdate({ backgroundColor: '#ffffff', buttonColor: '#FFF200', effectColor: '#FFF200', buttonTextColor: '#000000' })} className="w-10 h-10 rounded-full bg-brand-yellow border-2 border-white shadow-md hover:scale-110" title="Amarelo CP"></button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fundo</label><input type="color" value={editForm.style?.backgroundColor} onChange={e => handleStyleUpdate({ backgroundColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" /></div>
                                            <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Botão</label><input type="color" value={editForm.style?.buttonColor} onChange={e => handleStyleUpdate({ buttonColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" /></div>
                                            <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Efeito</label><input type="color" value={editForm.style?.effectColor} onChange={e => handleStyleUpdate({ effectColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <SectionHeader icon={MousePointerClick} title="Formatos e Estilos" />
                                    <div className="p-4 space-y-6">
                                        <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Formato</label><div className="grid grid-cols-2 gap-2">{Object.entries(SHAPE_LABELS).map(([key, label]) => <button key={key} onClick={() => handleStyleUpdate({ buttonShape: key as any })} className={`py-2 rounded-lg border text-xs font-bold ${editForm.style?.buttonShape === key ? 'bg-slate-800 text-white' : 'bg-slate-50'}`}>{label}</button>)}</div></div>
                                        <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Efeito Visual</label><div className="grid grid-cols-2 gap-2">{Object.entries(STYLE_LABELS).map(([key, label]) => <button key={key} onClick={() => handleStyleUpdate({ buttonStyle: key as any })} className={`py-2 rounded-lg border text-xs font-bold ${editForm.style?.buttonStyle === key ? 'bg-slate-800 text-white' : 'bg-slate-50'}`}>{label}</button>)}</div></div>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <SectionHeader icon={Type} title="Tipografia" />
                                    <div className="p-4 space-y-6">
                                        <div className="grid grid-cols-3 gap-2">{['sans', 'serif', 'mono'].map(f => <button key={f} onClick={() => handleStyleUpdate({ fontFamily: f as any })} className={`py-2 rounded-lg border text-xs font-bold uppercase ${editForm.style?.fontFamily === f ? 'bg-slate-800 text-white' : 'bg-slate-50'}`}>{f}</button>)}</div>
                                        <div className="grid grid-cols-3 gap-2">{['sm', 'md', 'lg'].map(sz => <button key={sz} onClick={() => handleStyleUpdate({ fontSize: sz as any })} className={`py-2 rounded-lg border text-xs font-bold uppercase ${editForm.style?.fontSize === sz ? 'bg-slate-800 text-white' : 'bg-slate-50'}`}>{sz === 'sm' ? 'Pequeno' : sz === 'md' ? 'Médio' : 'Grande'}</button>)}</div>
                                        <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all"><input type="checkbox" className="w-5 h-5 rounded text-brand-blue" checked={editForm.style?.textTransform === 'uppercase'} onChange={e => handleStyleUpdate({ textTransform: e.target.checked ? 'uppercase' : 'none' })} /><span className="text-xs font-bold uppercase text-slate-700">Caixa Alta (MAIÚSCULAS)</span></label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ADMIN' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3"><ShieldCheck className="text-red-500 shrink-0" size={24} /><div><h4 className="text-sm font-black text-red-600 uppercase">Acesso Restrito ao Admin</h4><p className="text-xs text-red-500">Configurações de SEO e Faturamento.</p></div></div>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <SectionHeader icon={Clapperboard} title="Poster CreativeFlix" />
                                    <div className="p-4 flex flex-col items-center gap-4">
                                        <button onClick={() => { setCropperType('POSTER'); setCropperOpen(true); }} className="w-40 h-60 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden relative group">{editForm.posterImageUrl ? <img src={editForm.posterImageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={32} />}<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold">Editar Poster</div></button>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <SectionHeader icon={Layout} title="Template de Layout Profissional" />
                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* LINHAS DE TEMPLATES */}
                                            <TemplateButton 
                                                id="links_clean" 
                                                label="Links Clean" 
                                                desc="Layout mobile-first padrão para links e redes sociais." 
                                                color="bg-brand-blue" 
                                                active={editForm.template_key === 'links_clean' || !editForm.template_key} 
                                                onClick={() => setEditForm(prev => ({ ...prev, template_key: 'links_clean' }))} 
                                            />
                                            <TemplateButton 
                                                id="landing_page" 
                                                label="Landing Page" 
                                                desc="Páginas de marketing premium para alta conversão." 
                                                color="bg-brand-blue" 
                                                active={editForm.template_key === 'landing_page'} 
                                                onClick={() => setEditForm(prev => ({ ...prev, template_key: 'landing_page' }))} 
                                            />
                                            <TemplateButton 
                                                id="portfolio" 
                                                label="Portfólio" 
                                                desc="Focado em exposição visual para artistas e fotógrafos." 
                                                color="bg-purple-500" 
                                                active={editForm.template_key === 'portfolio'} 
                                                onClick={() => setEditForm(prev => ({ ...prev, template_key: 'portfolio' }))} 
                                            />
                                            <TemplateButton 
                                                id="interactive_menu" 
                                                label="Cardápio Digital" 
                                                desc="Menu interativo ideal para gastronomia e eventos." 
                                                color="bg-red-500" 
                                                active={editForm.template_key === 'interactive_menu'} 
                                                onClick={() => setEditForm(prev => ({ ...prev, template_key: 'interactive_menu' }))} 
                                            />
                                            <TemplateButton 
                                                id="business_card" 
                                                label="Business Card" 
                                                desc="Cartão de visitas digital minimalista e profissional." 
                                                color="bg-slate-700" 
                                                active={editForm.template_key === 'business_card'} 
                                                onClick={() => setEditForm(prev => ({ ...prev, template_key: 'business_card' }))} 
                                            />
                                            <TemplateButton 
                                                id="storefront" 
                                                label="Storefront" 
                                                desc="Vitrine completa de produtos com catálogo ativo." 
                                                color="bg-brand-pink" 
                                                active={editForm.template_key === 'storefront'} 
                                                onClick={() => setEditForm(prev => ({ ...prev, template_key: 'storefront' }))} 
                                            />
                                            <TemplateButton 
                                                id="mini_store" 
                                                label="Mini Loja" 
                                                desc="Ideal para vendas rápidas via WhatsApp." 
                                                color="bg-green-500" 
                                                active={editForm.template_key === 'mini_store'} 
                                                onClick={() => setEditForm(prev => ({ ...prev, template_key: 'mini_store' }))} 
                                            />
                                            <TemplateButton 
                                                id="services" 
                                                label="Página de Serviços" 
                                                desc="Listagem profissional para consultores e empresas." 
                                                color="bg-blue-600" 
                                                active={editForm.template_key === 'services'} 
                                                onClick={() => setEditForm(prev => ({ ...prev, template_key: 'services' }))} 
                                            />
                                            <TemplateButton 
                                                id="jobs_board" 
                                                label="Mural de Vagas" 
                                                desc="Portal especializado para agências de recrutamento." 
                                                color="bg-slate-900" 
                                                active={editForm.template_key === 'jobs_board'} 
                                                onClick={() => setEditForm(prev => ({ ...prev, template_key: 'jobs_board' }))} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <SectionHeader icon={Target} title="Classificação e SEO" />
                                    <div className="p-4 space-y-4">
                                        <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Categoria Principal</label><select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm" value={editForm.category} onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}>{DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                        <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tags (Vírgula)</label><input className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm" value={tagsInput} onChange={e => { setTagsInput(e.target.value); setEditForm(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })); }} /></div>
                                        <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Slug (URL)</label><input className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-sm font-mono text-slate-400 cursor-not-allowed" value={editForm.slug || ''} readOnly disabled /></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 pointer-events-none"></div>
                    <div className="relative w-[340px] h-[680px] bg-white rounded-[40px] shadow-2xl border-[8px] border-slate-800 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-6 bg-black z-30 flex justify-between px-6 items-center"><span className="text-[10px] text-white font-bold">12:30</span><div className="flex gap-1"><div className="w-3 h-3 bg-white rounded-full opacity-20"></div></div></div>
                        <PreviewFrame profile={editForm as FlixProfile} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const PreviewFrame: React.FC<{ profile: FlixProfile }> = ({ profile }) => {
    const style = profile.style || DEFAULT_STYLE;
    const template = profile.template_key || 'links_clean';

    if (template === 'landing_page') {
        return (
            <div className="w-full h-full bg-white overflow-y-auto no-scrollbar font-sans text-slate-900">
                <div className="p-4 flex justify-between items-center border-b border-slate-50">
                    <div className="font-black text-[10px]">{profile.displayName}</div>
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-[8px] font-bold">CONTATO</div>
                </div>
                <div className="p-6 text-center">
                    <div className="w-16 h-1 bg-slate-100 mx-auto mb-4 rounded-full"></div>
                    <h1 className="text-xl font-black mb-3 leading-tight">{profile.displayName}</h1>
                    <p className="text-[10px] text-slate-400 font-medium mb-6">{profile.slogan}</p>
                    <div className="w-full aspect-[4/5] bg-slate-100 rounded-3xl mb-6 relative overflow-hidden shadow-inner">
                        {profile.posterImageUrl && <img src={profile.posterImageUrl} className="w-full h-full object-cover" />}
                    </div>
                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black shadow-lg">QUERO MEU PROJETO</button>
                    <div className="mt-12 space-y-4">
                        <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100"></div>
                        <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (template === 'mini_store') {
        return (
            <div className="w-full h-full bg-slate-50 overflow-y-auto no-scrollbar font-sans text-slate-900">
                <div className="p-6 bg-white flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg mb-4">
                        {profile.profileImageUrl && <img src={profile.profileImageUrl} className="w-full h-full object-cover" />}
                    </div>
                    <div className="text-center">
                        <h2 className="font-black text-sm text-slate-900">{profile.displayName}</h2>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Shopping Online</p>
                    </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
                            <div className="aspect-square bg-slate-50 rounded-xl mb-2"></div>
                            <div className="h-2 w-3/4 bg-slate-100 rounded mb-1"></div>
                            <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (template === 'services') {
        return (
            <div className="w-full h-full bg-white overflow-y-auto no-scrollbar font-sans text-slate-900">
                <div className="p-8 flex flex-col items-center border-b border-slate-50">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl mb-6">
                        {profile.profileImageUrl && <img src={profile.profileImageUrl} className="w-full h-full object-cover" />}
                    </div>
                    <h2 className="font-black text-lg text-slate-900">{profile.displayName}</h2>
                    <p className="text-[10px] text-brand-blue font-bold uppercase tracking-widest mt-2">{profile.category}</p>
                </div>
                <div className="p-6 space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nossos Serviços</h3>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl"></div>
                                <div className="h-2 w-20 bg-slate-100 rounded"></div>
                            </div>
                            <div className="h-2 w-10 bg-slate-50 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (template === 'jobs_board') {
        return (
            <div className="w-full h-full bg-[#f4f7f6] overflow-y-auto no-scrollbar font-sans text-slate-900">
                <div className="bg-slate-900 p-8 text-center text-white">
                    <h2 className="text-xl font-black mb-2">{profile.displayName}</h2>
                    <div className="text-[8px] font-bold text-brand-blue uppercase tracking-widest">Portal de Vagas</div>
                </div>
                <div className="p-4 -mt-4 space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <div className="flex justify-between mb-2">
                                <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                                <div className="h-3 w-1/4 bg-brand-blue/10 rounded"></div>
                            </div>
                            <div className="h-2 w-1/4 bg-slate-50 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (template === 'portfolio') {
        return (
            <div className="w-full h-full bg-white overflow-y-auto no-scrollbar font-sans text-slate-900">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-4 border-2 border-slate-100">
                        {profile.profileImageUrl && <img src={profile.profileImageUrl} className="w-full h-full object-cover" />}
                    </div>
                    <div className="font-black text-sm uppercase tracking-tighter">{profile.displayName}</div>
                </div>
                <div className="px-2 grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-[4/5] bg-slate-100 rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (template === 'interactive_menu') {
        return (
            <div className="w-full h-full bg-white overflow-y-auto no-scrollbar font-sans text-slate-900">
                <div className="h-32 bg-slate-800 relative">
                    {profile.coverImageUrl && <img src={profile.coverImageUrl} className="w-full h-full object-cover opacity-60" />}
                </div>
                <div className="px-6 -mt-10 flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-3xl bg-white p-1 shadow-xl">
                        {profile.profileImageUrl && <img src={profile.profileImageUrl} className="w-full h-full object-cover rounded-2xl" />}
                    </div>
                    <h2 className="font-black text-md mt-4">{profile.displayName}</h2>
                    <div className="text-[8px] text-green-500 font-bold uppercase mt-1">Aberto Agora</div>
                </div>
                <div className="px-4 space-y-4 pb-20">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4 p-3 bg-white border border-slate-50 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-slate-100 rounded-xl"></div>
                            <div className="flex-1 py-1 flex flex-col justify-between">
                                <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
                                <div className="flex justify-between items-center">
                                    <div className="h-3 w-1/4 bg-slate-200 rounded"></div>
                                    <div className="w-6 h-6 bg-red-500 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-4 left-4 right-4 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest shadow-lg">PEDIR AGORA</div>
            </div>
        );
    }

    if (template === 'business_card') {
        return (
            <div className="w-full h-full bg-[#f8fafc] overflow-y-auto no-scrollbar font-sans text-slate-800">
                <div className="w-full h-40 bg-slate-800 relative shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-50"></div>
                </div>
                <div className="px-6 -mt-12 relative z-10 pb-12">
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg mb-4 border-2 border-white">
                            {profile.profileImageUrl && <img src={profile.profileImageUrl} className="w-full h-full object-cover" />}
                        </div>
                        <h2 className="text-xl font-black text-slate-900 leading-tight">{profile.displayName || 'Seu Nome/Marca'}</h2>
                        <p className="text-brand-blue text-[10px] font-bold uppercase tracking-widest mt-1 mb-3">{profile.category || 'Categoria'}</p>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{profile.fullBio || profile.slogan}</p>
                        <div className="flex gap-2 mt-4 w-full">
                            <button className="flex-1 bg-brand-blue text-white py-2 rounded-xl text-[10px] font-bold">CONTATO</button>
                            <button className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl text-[10px] font-bold">MENSAGEM</button>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Links Rápidos</h4>
                        {profile.links?.sort((a, b) => a.order - b.order).filter(l => l.type === 'link').slice(0, 3).map(l => (
                            <div key={l.id} className="w-full bg-white p-4 rounded-2xl text-center font-bold text-slate-700 text-xs border border-slate-100 shadow-sm">{l.label}</div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (template === 'storefront') {
        return (
            <div className="w-full h-full bg-slate-50 overflow-y-auto no-scrollbar font-sans text-slate-900">
                <div className="p-6 bg-white border-b border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <Menu size={20} className="text-slate-400" />
                        <ShoppingBag size={20} className="text-slate-800" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                            {profile.profileImageUrl && <img src={profile.profileImageUrl} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <h2 className="font-black text-lg text-slate-900">{profile.displayName || 'Loja Virtual'}</h2>
                            <p className="text-xs text-slate-500">{profile.category || 'Catálogo Premium'}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white mb-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase text-brand-yellow tracking-[0.2em] block mb-2">Destaque</span>
                            <h3 className="text-xl font-black mb-1">Novidades da Semana</h3>
                            <button className="text-[10px] font-bold bg-white text-slate-900 px-4 py-2 rounded-full mt-4">VER CATÁLOGO</button>
                        </div>
                        <div className="absolute right-[-20px] top-4 w-40 h-40 bg-brand-blue/20 blur-3xl rounded-full"></div>
                    </div>

                    <h4 className="font-black text-xs uppercase tracking-wider mb-4">Catálogo Digital</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <div className="aspect-square bg-slate-50 rounded-xl mb-3"></div>
                            <div className="h-3 w-3/4 bg-slate-100 rounded mb-2"></div>
                            <div className="h-3 w-1/4 bg-slate-100 rounded"></div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <div className="aspect-square bg-slate-50 rounded-xl mb-3"></div>
                            <div className="h-3 w-3/4 bg-slate-100 rounded mb-2"></div>
                            <div className="h-3 w-1/4 bg-slate-100 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default: LINKS_CLEAN
    const effectColor = style.effectColor || '#000000';
    const fontConfig: Record<string, { name: string, bio: string, btn: string, header: string }> = {
        sm: { name: 'text-base', bio: 'text-[10px]', btn: 'text-xs', header: 'text-[10px]' },
        md: { name: 'text-lg', bio: 'text-xs', btn: 'text-sm', header: 'text-xs' },
        lg: { name: 'text-xl', bio: 'text-sm', btn: 'text-base', header: 'text-sm' }
    };
    const currentFont = fontConfig[style.fontSize || 'md'];
    const transform = style.textTransform === 'uppercase' ? 'uppercase' : 'none';
    const fontClass = style.fontFamily === 'serif' ? 'font-serif' : style.fontFamily === 'mono' ? 'font-mono' : 'font-sans';
    const shapeClass = style.buttonShape === 'pill' ? 'rounded-full' : style.buttonShape === 'square' ? 'rounded-none' : style.buttonShape === 'sharp' ? 'rounded-md' : 'rounded-xl';

    const getBtnStyle = (): React.CSSProperties => {
        const base: React.CSSProperties = { color: style.buttonTextColor, textTransform: transform as any };
        switch (style.buttonStyle) {
            case 'outline': return { ...base, backgroundColor: style.buttonColor, border: `1px solid ${effectColor}` };
            case 'glass': return { ...base, backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)' };
            case 'hard-shadow': return { ...base, backgroundColor: style.buttonColor, border: `2px solid ${effectColor}`, boxShadow: `4px 4px 0px ${effectColor}` };
            case 'soft-shadow': return { ...base, backgroundColor: style.buttonColor, boxShadow: `0 10px 15px -3px ${effectColor}44` };
            default: return { ...base, backgroundColor: style.buttonColor };
        }
    };

    return (
        <div className={`w-full h-full overflow-y-auto no-scrollbar ${fontClass}`} style={{ backgroundColor: style.backgroundColor, color: style.textColor }}>
            <div className="w-full h-48 bg-slate-200 relative overflow-hidden">{profile.coverImageUrl && <img src={profile.coverImageUrl} className="w-full h-full object-cover" />}</div>
            <div className="px-4 pb-12 flex flex-col items-center -mt-16">
                <div className="relative mb-4 w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">{profile.profileImageUrl && <img src={profile.profileImageUrl} className="w-full h-full object-cover" />}</div>
                <h1 className={`${currentFont.name} font-bold mb-1`} style={{ textTransform: transform as any }}>{profile.displayName || 'Nome do Perfil'}</h1>
                <p className={`${currentFont.bio} opacity-70 text-center px-4 mb-6`} style={{ textTransform: transform as any }}>{profile.slogan}</p>
                <div className="w-full space-y-3">
                    {profile.links?.sort((a, b) => a.order - b.order).map(l => (
                        l.type === 'header'
                            ? <h3 key={l.id} className={`${currentFont.header} font-bold uppercase tracking-widest text-center mt-6 mb-2 opacity-50`} style={{ textTransform: transform as any }}>{l.label}</h3>
                            : <div key={l.id} className={`${shapeClass} w-full py-3 px-4 text-center font-bold flex items-center justify-center`} style={getBtnStyle()}>{l.label}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};
