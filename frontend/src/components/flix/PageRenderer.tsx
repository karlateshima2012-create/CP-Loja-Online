
import React from 'react';
import { LinksCleanTemplate } from '@/src/templates/LinksCleanTemplate';
import { BusinessCardTemplate } from '@/src/templates/BusinessCardTemplate';
import { StorefrontTemplate } from '@/src/templates/StorefrontTemplate';
import { LandingPageTemplate } from '@/src/templates/LandingPageTemplate';
import { MiniStoreTemplate } from '@/src/templates/MiniStoreTemplate';
import { ServicesTemplate } from '@/src/templates/ServicesTemplate';
import { JobsBoardTemplate } from '@/src/templates/JobsBoardTemplate';
import { PortfolioTemplate } from '@/src/templates/PortfolioTemplate';
import { InteractiveMenuTemplate } from '@/src/templates/InteractiveMenuTemplate';

interface PageRendererProps {
    data: {
        profile: any;
        template_key: string;
        base_content: any;
        modules: any;
    };
}

export const PageRenderer: React.FC<PageRendererProps> = ({ data }) => {
    const { profile, template_key, base_content, modules } = data;

    switch (template_key) {
        case 'landing_page':
            return <LandingPageTemplate profile={profile} baseContent={base_content} modules={modules} />;
        case 'mini_store':
            return <MiniStoreTemplate profile={profile} baseContent={base_content} modules={modules} />;
        case 'services':
            return <ServicesTemplate profile={profile} baseContent={base_content} modules={modules} />;
        case 'jobs_board':
            return <JobsBoardTemplate profile={profile} baseContent={base_content} modules={modules} />;
        case 'portfolio':
            return <PortfolioTemplate profile={profile} baseContent={base_content} modules={modules} />;
        case 'interactive_menu':
            return <InteractiveMenuTemplate profile={profile} baseContent={base_content} modules={modules} />;
        case 'business_card':
            return <BusinessCardTemplate profile={profile} baseContent={base_content} modules={modules} />;
        case 'storefront':
            return <StorefrontTemplate profile={profile} baseContent={base_content} modules={modules} />;
        case 'links_clean':
        default:
            return <LinksCleanTemplate profile={profile} baseContent={base_content} modules={modules} />;
    }
};
