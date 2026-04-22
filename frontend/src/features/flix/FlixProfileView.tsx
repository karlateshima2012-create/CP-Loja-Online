
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageRenderer } from '@/src/components/flix/PageRenderer';
import { mockService } from '@/src/services/mockData';

export const FlixProfileView: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // In production: const response = await apiClient.get(`/public/page/${slug}`);
                // Mocking the new contract here
                const profile = mockService.getFlixProfileBySlug(slug || '');

                if (profile) {
                    setPageData({
                        profile: {
                            display_name: profile.displayName,
                            slug: profile.slug,
                            category: profile.category,
                            niche: profile.niche || 'Nicho Exemplo',
                            type: profile.type || 'company',
                            city: profile.city || 'Tóquio',
                            prefecture: profile.prefecture || 'Tokyo',
                            poster_url: profile.profileImageUrl,
                        },
                        template_key: profile.template_key || 'links_clean',
                        base_content: {
                            title: profile.displayName,
                            bio: profile.fullBio || profile.slogan,
                            links: profile.links || []
                        },
                        modules: {
                            // Example modules based on mock data
                            catalog: true,
                            photo_portfolio: profile.category === 'Fotografia',
                            jobs_board: profile.category === 'Recrutamento'
                        }
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar página pública:", err);
            }
            setLoading(false);
        };

        fetchData();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Carregando Experiência...</span>
        </div>
    );

    if (!pageData) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 font-bold gap-4">
            <h1 className="text-6xl font-black opacity-20 tracking-tighter">404</h1>
            <p className="uppercase tracking-widest text-sm">Página não encontrada</p>
            <a href="/#/flix" className="mt-4 text-primary font-bold hover:underline">Volar para o Hub</a>
        </div>
    );

    return <PageRenderer data={pageData} />;
};
