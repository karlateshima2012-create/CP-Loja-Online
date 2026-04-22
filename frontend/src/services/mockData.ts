
import {
    Product, Order, OrderStatus, Customer,
    Testimonial, TestimonialSource, Coupon,
    RawMaterial, SystemSettings, SiteTexts,
    PaymentMethod, AbandonedCart, CartItem,
    FlixProfile
} from '../types';

// --- MOCK DATA STORAGE (In-Memory) ---

// --- CREATIVE FLIX DATA ---
let FLIX_PROFILES: FlixProfile[] = [
    {
        id: 'flix-cp-free',
        slug: 'cp-free',
        displayName: 'Karla Teshima',
        slogan: 'Creative Print CEO',
        template_key: 'links_clean',
        fullBio: 'Transformando ideias em realidade através da tecnologia NFC e Impressão 3D. Conecte-se comigo!',
        profileImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
        posterImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&q=80',
        style: {
            backgroundType: 'color',
            backgroundColor: '#ffffff',
            buttonStyle: 'soft-shadow',
            buttonShape: 'rounded',
            buttonColor: '#ffffff',
            buttonTextColor: '#000000',
            effectColor: '#000000',
            textColor: '#000000',
            fontFamily: 'sans',
            layoutMode: 'stack'
        },
        category: 'Tecnologia',
        tags: ['Free', 'NFC', 'Start'],
        active: true,
        views: 50,
        createdAt: '2023-11-01T10:00:00Z',
        isPremium: false,
        planType: 'FREE',
        pageType: 'LINKS',
        links: [
            { id: 'l1', type: 'link', label: 'Meu WhatsApp', subLabel: 'Fale comigo agora', url: 'https://wa.me/', icon: 'whatsapp', active: true, highlight: true, order: 1 },
            { id: 'l2', type: 'link', label: 'Instagram', url: '#', icon: 'instagram', active: true, order: 2 },
            { id: 'l3', type: 'link', label: 'Conheça a Loja', url: '#', icon: 'site', active: true, order: 3 },
            { id: 'l4', type: 'header', label: 'Localização', active: true, order: 4 },
            { id: 'l5', type: 'link', label: 'Como Chegar', url: '#', icon: 'maps', active: true, order: 5 }
        ]
    },
    {
        id: 'flix-cp-premium',
        slug: 'cp-premium',
        displayName: 'Creative Design Studio',
        template_key: 'business_card',
        profileImageUrl: 'https://images.unsplash.com/photo-1508921234172-b68ed335b3e6?w=400&q=80',
        style: {
            backgroundType: 'color', backgroundColor: '#f8fafc',
            buttonStyle: 'soft-shadow', buttonShape: 'rounded',
            buttonColor: '#ffffff', buttonTextColor: '#000000',
            effectColor: '#38b6ff', textColor: '#1e293b',
            fontFamily: 'sans', layoutMode: 'stack'
        },
        category: 'Design', city: 'Tóquio', prefecture: 'Tokyo',
        tags: ['Premium', 'Studio'], active: true, views: 120,
        createdAt: '2023-12-01T10:00:00Z', isPremium: true,
        planType: 'PREMIUM', pageType: 'SERVICES',
        links: [
            { id: 'p1', type: 'link', label: 'Behance Portfolio', url: '#', icon: 'globe', active: true, order: 1 },
            { id: 'p2', type: 'link', label: 'Agendar Reunião', url: '#', icon: 'calendar', active: true, order: 2 }
        ]
    },
    {
        id: 'flix-cp-store',
        slug: 'cp-store',
        displayName: 'Creative Print Official',
        template_key: 'storefront',
        profileImageUrl: 'https://images.unsplash.com/photo-1556761175-5973bc0f22b8?w=400&q=80',
        style: {
            backgroundType: 'color', backgroundColor: '#ffffff',
            buttonStyle: 'soft-shadow', buttonShape: 'rounded',
            buttonColor: '#ffffff', buttonTextColor: '#000000',
            effectColor: '#000000', textColor: '#000000',
            fontFamily: 'sans', layoutMode: 'stack'
        },
        category: 'E-commerce', city: 'Nagoya', prefecture: 'Aichi',
        tags: ['Store', 'Official'], active: true, views: 350,
        createdAt: '2024-01-01T10:00:00Z', isPremium: true,
        planType: 'PREMIUM', pageType: 'STORE',
        planStatus: 'active',
        planExpirationDate: '2025-01-01T10:00:00Z',
        links: []
    }
];

let PRODUCTS: Product[] = [
    {
        id: 'prod-1',
        name: 'Cartão NFC Black Premium',
        description: 'Cartão de visita digital com acabamento fosco e chip NFC de alta sensibilidade.',
        price: 3500,
        imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500',
        category: 'Tecnologia NFC',
        isExclusive: false,
        allowAffiliate: true,
        isCustomizable: true,
        includesFreePage: true,
        isFeatured: true
    },
    {
        id: 'prod-2',
        name: 'Display Pix / QR Code 3D',
        description: 'Display de balcão impresso em 3D com suas cores e logo em relevo.',
        price: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1622675363311-ac6016d97a96?w=500',
        category: 'Impressão 3D',
        isExclusive: false,
        allowAffiliate: true,
        isCustomizable: true,
        isRecommended: true
    },
    {
        id: 'prod-digital-lp',
        name: 'Landing Page Profissional',
        description: 'Upgrade sua página CreativeFlix para uma Landing Page de alta conversão. Ideal para venda de serviços.',
        price: 9800,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
        category: 'Serviços Digitais',
        isExclusive: false,
        allowAffiliate: true,
        isCustomizable: true,
        isFeatured: true
    },
    {
        id: 'prod-digital-crm',
        name: 'Sistema CRM & Fidelidade',
        description: 'Gestão completa de clientes e programa de pontos. Fidelize seu público de forma automatizada.',
        price: 15000,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        category: 'Serviços Digitais',
        isExclusive: false,
        allowAffiliate: true,
        isCustomizable: true,
        isFeatured: true,
        isRecommended: true
    },
    {
        id: 'prod-nfc-keychain',
        name: 'Chaveiro Smart NFC',
        description: 'Leve seus contatos no bolso. Compacto, resistente e ultra moderno.',
        price: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500',
        category: 'Tecnologia NFC',
        isExclusive: false,
        allowAffiliate: true,
        isFeatured: true
    },
    {
        id: 'prod-3d-logo',
        name: 'Logo 3D de Bancada',
        description: 'Sua marca em relevo para decorar seu escritório ou balcão.',
        price: 5500,
        imageUrl: 'https://images.unsplash.com/photo-1611095773767-114b51a671f1?w=500',
        category: 'Impressão 3D',
        isExclusive: false,
        allowAffiliate: true,
        isRecommended: true
    }
];

let ORDERS: Order[] = [
    {
        id: 'ORD-1001',
        createdAt: new Date().toISOString(),
        customerId: 'c1',
        customerName: 'Maria Silva',
        customerEmail: 'maria@email.com',
        customerPhone: '090-1111-2222',
        shippingAddress: 'Tokyo-to, Minato-ku, 1-1-1',
        items: [
            { ...PRODUCTS[0], cartId: 'c1', quantity: 1 }
        ],
        totalAmount: 3500,
        paymentMethod: PaymentMethod.SQUARE,
        status: OrderStatus.PAID,
        trackingCode: '1234-5678-9012'
    },
    {
        id: 'ORD-2024-NFC',
        createdAt: new Date().toISOString(),
        customerId: 'c2',
        customerName: 'Ricardo Honda',
        customerEmail: 'ricardo@email.com',
        customerPhone: '080-9999-8888',
        shippingAddress: 'Aichi-ken, Nagoya-shi',
        items: [
            { ...PRODUCTS[0], cartId: 'c2', quantity: 1, name: 'Chaveiro NFC Personalizado (Bônus Página)' }
        ],
        totalAmount: 4500,
        paymentMethod: PaymentMethod.TRANSFER,
        status: OrderStatus.PAID,
        freePageCreated: false
    }
];

let CUSTOMERS: Customer[] = [
    {
        id: 'c1',
        name: 'Maria Silva',
        email: 'maria@email.com',
        ordersCount: 1,
        createdAt: '2023-01-15',
        phone: '090-1111-2222',
        address: 'Tokyo-to, Minato-ku, 1-1-1',
        plan: 'FREE',
        planStatus: 'active'
    },
    {
        id: 'c2',
        name: 'Ricardo Honda',
        email: 'ricardo@email.com',
        ordersCount: 1,
        createdAt: '2024-01-20',
        phone: '080-9999-8888',
        address: 'Aichi-ken, Nagoya-shi',
        plan: 'PREMIUM',
        planStatus: 'active',
        planExpirationDate: '2025-01-20T00:00:00Z'
    }
];

let MATERIALS: RawMaterial[] = [
    { id: 'm1', name: 'Filamento PLA Preto', unit: 'kg', currentStock: 2, minStock: 1 },
    { id: 'm2', name: 'Chip NFC NTAG215', unit: 'un', currentStock: 50, minStock: 20 }
];

let SETTINGS: SystemSettings = {
    payment: {
        jpBankName: 'Japan Post Bank',
        jpAccountNumber: '12345678',
        jpHolderName: 'CREATIVE PRINT',
        otherBankName: 'Mizuho',
        otherBankCode: '0001',
        otherBranchName: 'Shiga',
        otherAccountNumber: '9876543',
        otherAccountType: 'Futsu',
        otherHolderName: 'CREATIVE PRINT KK'
    },
    email: { senderName: 'Creative Print', senderEmail: 'no-reply@cp.jp', smtpHost: '', smtpPort: '' },
    store: { storeName: 'Creative Print', description: '', supportPhone: '090-1188-6491' },
    branding: { logoUrl: '', bannerUrl: '', primaryColor: '#38b6ff', secondaryColor: '#e5157a' },
    telegram: { botToken: '', chatId: '', enabled: false },
    admins: []
};

let SITE_TEXTS: SiteTexts = {};
let TESTIMONIALS: Testimonial[] = [
    {
        id: 't1', name: 'João Santos', role: 'Empreendedor', content: 'Excelente qualidade, meus clientes adoraram os brindes!', rating: 5, source: TestimonialSource.GOOGLE, date: '2023-10-10', approved: true
    }
];
let COUPONS: Coupon[] = [];
let ABANDONED_CARTS: AbandonedCart[] = [];

// --- SERVICE IMPLEMENTATION ---

export const mockService = {
    // PRODUCTS
    getProducts: () => PRODUCTS,
    getProduct: (id: string) => PRODUCTS.find(p => p.id === id),
    saveProduct: (product: Product) => {
        if (product.id) {
            const idx = PRODUCTS.findIndex(p => p.id === product.id);
            if (idx !== -1) PRODUCTS[idx] = product;
        } else {
            product.id = `prod-${Date.now()}`;
            PRODUCTS.push(product);
        }
    },
    deleteProduct: (id: string) => {
        PRODUCTS = PRODUCTS.filter(p => p.id !== id);
    },
    getVirtualStock: (id: string) => 999,

    // ORDERS
    getOrders: () => ORDERS,
    getOrderById: (id: string) => ORDERS.find(o => o.id === id),
    getCustomerOrders: (customerId: string) => ORDERS.filter(o => o.customerId === customerId),
    createOrder: (order: Order) => {
        ORDERS.push(order);
        if (order.customerId) {
            const cust = CUSTOMERS.find(c => c.id === order.customerId);
            if (cust) cust.ordersCount++;
        }
    },
    updateOrderDetails: (id: string, updates: Partial<Order>) => {
        const order = ORDERS.find(o => o.id === id);
        if (order) Object.assign(order, updates);
    },
    updateOrderStatus: (id: string, status: OrderStatus) => {
        const order = ORDERS.find(o => o.id === id);
        if (order) order.status = status;
    },

    // CUSTOMERS
    getCustomers: () => CUSTOMERS,
    getCustomerById: (id: string) => CUSTOMERS.find(c => c.id === id),
    registerCustomer: (data: any) => {
        const newC = { ...data, id: `c-${Date.now()}`, createdAt: new Date().toISOString() };
        CUSTOMERS.push(newC);
        return newC;
    },
    loginCustomer: (email: string, pass: string) => CUSTOMERS.find(c => c.email === email && c.password === pass),
    updateCustomer: (id: string, data: Partial<Customer>) => {
        const c = CUSTOMERS.find(x => x.id === id);
        if (c) Object.assign(c, data);
    },

    // CARTS
    getAbandonedCarts: () => ABANDONED_CARTS,
    syncAbandonedCart: (id: string, items: CartItem[], name?: string, email?: string) => {
        const existing = ABANDONED_CARTS.find(c => c.id === id);
        if (items.length === 0) {
            if (existing) ABANDONED_CARTS = ABANDONED_CARTS.filter(c => c.id !== id);
        } else {
            const total = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
            if (existing) {
                existing.items = items; existing.totalValue = total; existing.updatedAt = new Date().toISOString();
            } else {
                ABANDONED_CARTS.push({ id, items, totalValue: total, updatedAt: new Date().toISOString(), customerName: name, customerEmail: email });
            }
        }
    },

    // TESTIMONIALS
    getTestimonials: () => TESTIMONIALS,
    saveTestimonial: (t: Testimonial) => {
        const idx = TESTIMONIALS.findIndex(x => x.id === t.id);
        if (idx !== -1) TESTIMONIALS[idx] = t; else TESTIMONIALS.push(t);
    },
    deleteTestimonial: (id: string) => {
        TESTIMONIALS = TESTIMONIALS.filter(t => t.id !== id);
    },

    // COUPONS
    getCoupons: () => COUPONS,
    getCouponsForCustomer: (cid: string) => COUPONS.filter(c => (!c.customerId || c.customerId === cid) && c.active && !c.used),
    validateCoupon: (code: string, cid?: string) => {
        return COUPONS.find(c => c.code === code && c.active && !c.used && (!c.customerId || c.customerId === cid));
    },
    saveCoupon: (c: Coupon) => {
        if (c.id) { const idx = COUPONS.findIndex(x => x.id === c.id); if (idx !== -1) COUPONS[idx] = c; }
        else { c.id = `cpn-${Date.now()}`; COUPONS.push(c); }
    },
    deleteCoupon: (id: string) => { COUPONS = COUPONS.filter(c => c.id !== id); },

    // MATERIALS
    getMaterials: () => MATERIALS,
    saveMaterial: (m: RawMaterial) => {
        if (m.id) { const idx = MATERIALS.findIndex(x => x.id === m.id); if (idx !== -1) MATERIALS[idx] = m; }
        else { m.id = `mat-${Date.now()}`; MATERIALS.push(m); }
    },
    deleteMaterial: (id: string) => { MATERIALS = MATERIALS.filter(m => m.id !== id); },

    // SETTINGS & TEXTS
    getSettings: () => SETTINGS,
    updateSettings: (s: SystemSettings) => { SETTINGS = s; },
    getSiteTexts: async () => SITE_TEXTS,
    updateSiteTexts: (t: SiteTexts) => { SITE_TEXTS = t; },

    // DASHBOARD STATS
    getDashboardStats: () => ({
        totalRevenue: 1250000,
        totalOrders: 45,
        pendingOrders: 12,
        customerGrowth: 15,
        activeCustomers: CUSTOMERS.length
    }),
    getDigitalProductStats: () => ({ flix: { totalVisits: 15400 } }),

    getPartnerRanking: () => [], // Empty ranking for safety
    getPartnerById: (id: string) => undefined,
    getPartners: () => [],
    getCommissionsByOrderId: (id: string) => [],

    // FLIX
    getFlixProfiles: () => FLIX_PROFILES,
    getFlixProfileBySlug: (slug: string) => FLIX_PROFILES.find(p => p.slug === slug),
    saveFlixProfile: (p: FlixProfile) => {
        if (p.id) { const idx = FLIX_PROFILES.findIndex(x => x.id === p.id); if (idx !== -1) FLIX_PROFILES[idx] = p; }
        else { p.id = `flix-${Date.now()}`; FLIX_PROFILES.push(p); }
    },
    deleteFlixProfile: (id: string) => { FLIX_PROFILES = FLIX_PROFILES.filter(p => p.id !== id); },

    // UTILS
    testTelegramNotification: async () => true
};
