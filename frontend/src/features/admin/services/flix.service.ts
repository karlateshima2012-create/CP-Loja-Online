import apiClient from '../../../services/apiClient';
import { FlixProfile } from '../../../types';

export const flixService = {
    /**
     * Get the current tenant's page and map it to FlixProfile.
     */
    getMyPage: async (): Promise<FlixProfile | null> => {
        const response = await apiClient.get('/tenant/pages');
        const pages = response.data;
        if (!pages || pages.length === 0) return null;

        const page = pages[0]; // Take the first one

        // Map Backend TenantPage to Frontend FlixProfile
        return {
            id: page.id,
            slug: '', // Will be injected by the app or handled by tenant context
            displayName: page.title || '',
            profileImageUrl: page.content_json?.profile_image_url || '',
            coverImageUrl: page.content_json?.cover_image_url || '',
            posterImageUrl: page.content_json?.poster_image_url || '',
            template_key: page.content_json?.template_key || 'links_clean',
            style: page.style_json || {},
            category: page.content_json?.category || 'Geral',
            tags: page.content_json?.tags || [],
            links: page.links_json || [],
            views: page.content_json?.views || 0,
            active: page.is_published,
            createdAt: page.created_at,
            planType: 'FREE', // Logic handled by tenant plan
            pageType: page.type,
            isPremium: false,
            ...page.content_json // Include other extra fields stored in content_json
        };
    },

    /**
     * Save changes to the tenant page.
     */
    savePage: async (id: string, profile: Partial<FlixProfile>) => {
        // Map Frontend FlixProfile back to Backend structure
        const payload = {
            title: profile.displayName,
            type: profile.pageType,
            is_published: profile.active,
            style_json: profile.style,
            links_json: profile.links,
            content_json: {
                profile_image_url: profile.profileImageUrl,
                cover_image_url: profile.coverImageUrl,
                poster_image_url: profile.posterImageUrl,
                category: profile.category,
                tags: profile.tags,
                views: profile.views,
                city: profile.city,
                province: profile.province,
                slogan: profile.slogan,
                fullBio: profile.fullBio,
                companyName: profile.companyName,
                phone: profile.phone,
                template_key: profile.template_key
            }
        };

        const response = await apiClient.put(`/tenant/pages/${id}`, payload);
        return response.data;
    }
};
