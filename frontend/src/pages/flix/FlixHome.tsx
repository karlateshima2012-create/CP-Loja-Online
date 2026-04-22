
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { FlixProfile } from '@/src/types';
import { Search, Clapperboard, Star, Play, ChevronRight, Info } from 'lucide-react';
import { Logo } from '../../components/Logo';

export const FlixHome: React.FC = () => {
    const [profiles, setProfiles] = useState<FlixProfile[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [featuredProfile, setFeaturedProfile] = useState<FlixProfile | null>(null);

    useEffect(() => {
        const allProfiles = mockService.getFlixProfiles().filter(p => p.active);
        setProfiles(allProfiles);
        
        // Pick a random premium profile to feature
        const premiums = allProfiles.filter(p => p.isPremium);
        if (premiums.length > 0) {
            setFeaturedProfile(premiums[Math.floor(Math.random() * premiums.length)]);
        } else if (allProfiles.length > 0) {
            setFeaturedProfile(allProfiles[0]);
        }
    }, []);

    // Dynamically get unique categories from profiles, sort alphabetically
    const categories = (Array.from(new Set(profiles.map(p => p.category))) as string[])
        .filter(c => c && c.trim() !== '') // Remove empty categories
        .sort((a, b) => a.localeCompare(b));

    const filteredProfiles = searchTerm 
        ? profiles.filter(p => p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
        : profiles;

    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans overflow-x-hidden selection:bg-brand-pink/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent px-4 md:px-12 py-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-8">
                    <Link to="/flix" className="flex items-center gap-2">
                        <Clapperboard className="text-brand-pink" size={28} />
                        <span className="font-black text-xl tracking-tight hidden sm:block">CreativeFlix</span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
                        <a href="#" className="hover:text-white transition-colors">Início</a>
                        {/* Show first 3 categories in nav for quick access if available */}
                        {categories.slice(0, 3).map(cat => (
                            <a key={`nav-${cat}`} href={`#cat-${cat}`} className="hover:text-white transition-colors">{cat}</a>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Search className={`absolute left-0 top-1/2 -translate-y-1/2 text-white transition-all duration-300 ${searchTerm ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`} size={20}/>
                        <input 
                            className={`bg-black/50 border border-white/30 rounded-sm py-1 px-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-white transition-all duration-300 ${searchTerm ? 'w-64 pl-2' : 'w-0 pl-8 group-hover:w-64 group-hover:pl-2'}`}
                            placeholder="Títulos, gente e gêneros"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link to="/" className="text-xs font-bold text-slate-400 hover:text-white border border-white/30 px-3 py-1 rounded hover:border-white transition-colors">
                        Voltar à Loja
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            {featuredProfile && !searchTerm && (
                <div className="relative h-[80vh] w-full">
                    <div className="absolute inset-0">
                        <img src={featuredProfile.coverImageUrl} className="w-full h-full object-cover" alt="Hero Cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
                    </div>
                    
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 max-w-xl z-10 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-brand-pink font-bold uppercase tracking-widest text-xs flex items-center gap-1">
                                <Clapperboard size={12}/> Destaque da Comunidade
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] drop-shadow-lg">
                            {featuredProfile.displayName}
                        </h1>
                        <p className="text-lg md:text-xl text-white font-medium drop-shadow-md">
                            {featuredProfile.slogan}
                        </p>
                        <p className="text-slate-300 text-sm md:text-base line-clamp-3 max-w-lg leading-relaxed drop-shadow-md">
                            {featuredProfile.fullBio || 'Conheça os melhores serviços e produtos da nossa comunidade.'}
                        </p>
                        
                        <div className="flex gap-4 pt-4">
                            <Link 
                                to={`/page/${featuredProfile.slug}`}
                                className="bg-white text-black px-8 py-3 rounded hover:bg-slate-200 font-bold flex items-center gap-2 transition-colors"
                            >
                                <Play size={24} fill="black" /> Visitar Página
                            </Link>
                            <button className="bg-gray-500/70 text-white px-6 py-3 rounded hover:bg-gray-500/50 font-bold flex items-center gap-2 backdrop-blur-sm transition-colors">
                                <Info size={24} /> Mais Informações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Rows */}
            <div className={`px-4 md:px-12 pb-20 ${!searchTerm && featuredProfile ? '-mt-24 relative z-20' : 'pt-24'}`}>
                
                {searchTerm ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredProfiles.map(p => (
                            <ProfilePoster key={p.id} profile={p} />
                        ))}
                        {filteredProfiles.length === 0 && (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                <p>Nenhum resultado encontrado para "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                ) : (
                    categories.map(cat => {
                        const catProfiles = profiles.filter(p => p.category === cat);
                        if (catProfiles.length === 0) return null;

                        return (
                            <div key={cat} id={`cat-${cat}`} className="mb-12 group/row">
                                <h3 className="text-xl font-bold text-slate-200 mb-4 px-1 group-hover/row:text-white transition-colors flex items-center gap-2">
                                    {cat} <ChevronRight size={16} className="opacity-0 group-hover/row:opacity-100 transition-opacity text-brand-pink -ml-2 group-hover/row:ml-0" />
                                </h3>
                                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x">
                                    {catProfiles.map(p => (
                                        <div key={p.id} className="min-w-[160px] md:min-w-[240px] snap-start">
                                            <ProfilePoster profile={p} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// Sub-component for Poster
const ProfilePoster: React.FC<{ profile: FlixProfile }> = ({ profile }) => {
    // Prefer Poster Image, fallback to Cover Image
    const displayImage = profile.posterImageUrl || profile.coverImageUrl;

    return (
        <Link to={`/page/${profile.slug}`} className="block relative group aspect-[2/3] rounded-md overflow-hidden transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-xl hover:shadow-brand-pink/20 bg-slate-800">
            {displayImage ? (
                <img src={displayImage} className="w-full h-full object-cover" alt={profile.displayName} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <Clapperboard size={32} className="text-slate-600 mb-2"/>
                    <span className="text-xs font-bold text-slate-500">{profile.displayName}</span>
                </div>
            )}
            
            {/* Hover Overlay Info */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-bold text-white text-sm mb-1">{profile.displayName}</h4>
                    <p className="text-[10px] text-green-400 font-bold mb-2">98% Relevante</p>
                    <div className="flex gap-2 text-[10px] text-slate-300 flex-wrap">
                        {profile.tags.slice(0, 3).map(t => (
                            <span key={t} className="border border-slate-600 px-1 rounded">{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};
