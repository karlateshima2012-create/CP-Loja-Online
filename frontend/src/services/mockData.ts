// --- MOCK DATA STORAGE (In-Memory with LocalStorage Persistence) ---

// Helper function to load from LocalStorage
const loadFromLS = (key: string, defaultValue: any) => {
    try {
        const saved = localStorage.getItem(`cp_store_${key}`);
        return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

// Helper function to save to LocalStorage
const saveToLS = (key: string, data: any) => {
    localStorage.setItem(`cp_store_${key}`, JSON.stringify(data));
};

// --- INITIAL DATA (Originals) ---
const INITIAL_FLIX_PROFILES: FlixProfile[] = [
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
    }
];

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'p3d-chaveiro-1',
        name: 'Chaveiro Personalizado 3D',
        description: 'Chaveiro impresso em 3D com seu nome, logo ou design exclusivo. Disponível em diversas cores de filamento.',
        price: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1576158113928-4c240eaaf360?w=500',
        category: 'Impressão 3D',
        subcategory: 'Chaveiros 3D',
        isFeatured: true,
        isCustomizable: true,
        isBestSeller: true,
    },
    {
        id: 'p3d-chaveiro-2',
        name: 'Chaveiro Inicial 3D',
        description: 'Chaveiro com a inicial do seu nome em relevo. Elegante e resistente.',
        price: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1621609764547-c2f8e9dce6c5?w=500',
        category: 'Impressão 3D',
        subcategory: 'Chaveiros 3D',
        isCustomizable: true,
        isBestSeller: true,
    },
    {
        id: 'p3d-display-pix',
        name: 'Display Pix / QR Code 3D',
        description: 'Display de balcão impresso em 3D com suporte para QR Code do Pix. Aceita personalização de cor e logo.',
        price: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1622675363311-ac6016d97a96?w=500',
        category: 'Impressão 3D',
        subcategory: 'Displays / Suportes',
        isFeatured: true,
        isRecommended: true,
        isCustomizable: true,
        isBestSeller: true,
    },
    {
        id: 'p3d-suporte-cel',
        name: 'Suporte de Celular 3D',
        description: 'Suporte para smartphone com design personalizável. Ideal para balcões de atendimento.',
        price: 2800,
        imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
        category: 'Impressão 3D',
        subcategory: 'Displays / Suportes',
        isCustomizable: true,
        isBestSeller: true,
    },
    {
        id: 'p3d-letreiro-mesa',
        name: 'Letreiro de Mesa 3D',
        description: 'Seu nome ou marca em relevo 3D para decorar mesa, bancada ou escritório. Produção sob demanda.',
        price: 6500,
        imageUrl: 'https://images.unsplash.com/photo-1611095773767-114b51a671f1?w=500',
        category: 'Impressão 3D',
        subcategory: 'Letreiros personalizados',
        isFeatured: true,
        isCustomizable: true,
    },
    {
        id: 'p3d-letreiro-parede',
        name: 'Letreiro de Parede 3D',
        description: 'Logo ou texto em 3D para fixação na parede. Perfeito para lojas, escritórios e estúdios.',
        price: 12000,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
        category: 'Impressão 3D',
        subcategory: 'Letreiros personalizados',
        isCustomizable: true,
    },
    {
        id: 'pnfc-chaveiro',
        name: 'Chaveiro Smart NFC',
        description: 'Chaveiro com chip NFC embutido. Um toque do celular abre seu WhatsApp, portfólio ou qualquer link. Inclui configuração.',
        price: 3500,
        imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500',
        category: 'Tecnologia NFC',
        subcategory: 'Chaveiros com NFC',
        isFeatured: true,
        isRecommended: true,
        includesFreePage: true,
        isCustomizable: true,
    },
    {
        id: 'pnfc-cartao-black',
        name: 'Cartão NFC Black Premium',
        description: 'Cartão de visita digital com chip NFC e acabamento fosco premium. Compartilhe contatos e portfólio com um toque.',
        price: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500',
        category: 'Tecnologia NFC',
        subcategory: 'Displays com NFC',
        isFeatured: true,
        includesFreePage: true,
        isCustomizable: true,
    },
    {
        id: 'pnfc-display-portfolio',
        name: 'Display NFC — Portfólio Interativo',
        description: 'Display de bancada com NFC que abre automaticamente seu portfólio digital. Impressione clientes na primeira reunião.',
        price: 6500,
        imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=500',
        category: 'Tecnologia NFC',
        subcategory: 'Displays com NFC',
        isRecommended: true,
        includesFreePage: true,
        isCustomizable: true,
    },
    {
        id: 'sys-landing-page',
        name: 'Landing Page Profissional',
        description: 'Página de alta conversão para o seu negócio ou serviço. Design responsivo, SEO otimizado e integração com WhatsApp. Entrega em até 7 dias.',
        price: 9800,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
        category: 'Soluções Digitais',
        isFeatured: true,
        isRecommended: true,
        isCustomizable: true,
    },
    {
        id: 'sys-crm-fidelidade',
        name: 'Sistema CRM & Fidelidade',
        description: 'Plataforma SaaS completa para gestão de clientes e programa de pontos. Fidelize seu público de forma automatizada. Assine e acesse hoje mesmo.',
        price: 15000,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        category: 'Soluções Digitais',
        isFeatured: true,
        isRecommended: true,
    },
];

const INITIAL_STORE_BANNER: StoreBanner = {
    imageUrl: 'https://midias.creativeprintjp.com/wp-content/uploads/2026/04/Preto-Azul-e-Branco-Moderno-Mes-dos-Pais-Banner.png',
    tagline: 'Campanha Oficial',
    title: 'Mês dos Pais',
    subtitle: 'Creative Print',
    description: 'Presentes exclusivos com tecnologia NFC e Impressão 3D de alta precisão.',
    active: true
};

// --- RUN-TIME DATA (Loaded from LS or INITIAL) ---
let FLIX_PROFILES: FlixProfile[] = loadFromLS('flix', INITIAL_FLIX_PROFILES);
let PRODUCTS: Product[] = loadFromLS('products', INITIAL_PRODUCTS);
let ORDERS: Order[] = loadFromLS('orders', []);
let CUSTOMERS: Customer[] = loadFromLS('customers', []);
let MATERIALS: RawMaterial[] = loadFromLS('materials', []);
let STORE_BANNER: StoreBanner = loadFromLS('banner', INITIAL_STORE_BANNER);
let SETTINGS: SystemSettings = loadFromLS('settings', {
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
});

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
        saveToLS('products', PRODUCTS);
    },
    deleteProduct: (id: string) => {
        PRODUCTS = PRODUCTS.filter(p => p.id !== id);
        saveToLS('products', PRODUCTS);
    },
    getVirtualStock: (id: string) => 999,

    // ORDERS
    getOrders: () => ORDERS,
    getOrderById: (id: string) => ORDERS.find(o => o.id === id),
    getCustomerOrders: (customerId: string) => ORDERS.filter(o => o.customerId === customerId),
    createOrder: (order: Order) => {
        ORDERS.push(order);
        saveToLS('orders', ORDERS);
        if (order.customerId) {
            const cust = CUSTOMERS.find(c => c.id === order.customerId);
            if (cust) {
                cust.ordersCount++;
                saveToLS('customers', CUSTOMERS);
            }
        }
    },
    updateOrderDetails: (id: string, updates: Partial<Order>) => {
        const order = ORDERS.find(o => o.id === id);
        if (order) {
            Object.assign(order, updates);
            saveToLS('orders', ORDERS);
        }
    },
    updateOrderStatus: (id: string, status: OrderStatus) => {
        const order = ORDERS.find(o => o.id === id);
        if (order) {
            order.status = status;
            saveToLS('orders', ORDERS);
        }
    },

    // CUSTOMERS
    getCustomers: () => CUSTOMERS,
    getCustomerById: (id: string) => CUSTOMERS.find(c => c.id === id),
    registerCustomer: (data: any) => {
        const newC = { ...data, id: `c-${Date.now()}`, createdAt: new Date().toISOString() };
        CUSTOMERS.push(newC);
        saveToLS('customers', CUSTOMERS);
        return newC;
    },
    loginCustomer: (email: string, pass: string) => CUSTOMERS.find(c => c.email === email && c.password === pass),
    updateCustomer: (id: string, data: Partial<Customer>) => {
        const c = CUSTOMERS.find(x => x.id === id);
        if (c) {
            Object.assign(c, data);
            saveToLS('customers', CUSTOMERS);
        }
    },

    // TESTIMONIALS
    getTestimonials: () => [],
    saveTestimonial: (t: Testimonial) => {},
    deleteTestimonial: (id: string) => {},

    // MATERIALS
    getMaterials: () => MATERIALS,
    saveMaterial: (m: RawMaterial) => {
        if (m.id) { const idx = MATERIALS.findIndex(x => x.id === m.id); if (idx !== -1) MATERIALS[idx] = m; }
        else { m.id = `mat-${Date.now()}`; MATERIALS.push(m); }
        saveToLS('materials', MATERIALS);
    },
    deleteMaterial: (id: string) => { 
        MATERIALS = MATERIALS.filter(m => m.id !== id); 
        saveToLS('materials', MATERIALS);
    },

    // SETTINGS & TEXTS
    getSettings: () => SETTINGS,
    updateSettings: (s: SystemSettings) => { 
        SETTINGS = s; 
        saveToLS('settings', SETTINGS);
    },
    getSiteTexts: async () => ({}),
    updateSiteTexts: (t: SiteTexts) => {},

    // DASHBOARD STATS
    getDashboardStats: () => ({
        totalRevenue: 1250000,
        totalOrders: 45,
        pendingOrders: 12,
        customerGrowth: 15,
        activeCustomers: CUSTOMERS.length
    }),
    
    // FLIX
    getFlixProfiles: () => FLIX_PROFILES,
    getFlixProfileBySlug: (slug: string) => FLIX_PROFILES.find(p => p.slug === slug),
    saveFlixProfile: (p: FlixProfile) => {
        if (p.id) { const idx = FLIX_PROFILES.findIndex(x => x.id === p.id); if (idx !== -1) FLIX_PROFILES[idx] = p; }
        else { p.id = `flix-${Date.now()}`; FLIX_PROFILES.push(p); }
        saveToLS('flix', FLIX_PROFILES);
    },
    deleteFlixProfile: (id: string) => { 
        FLIX_PROFILES = FLIX_PROFILES.filter(p => p.id !== id); 
        saveToLS('flix', FLIX_PROFILES);
    },

    // BANNER
    getStoreBanner: () => STORE_BANNER,
    updateStoreBanner: (banner: StoreBanner) => { 
        STORE_BANNER = banner; 
        saveToLS('banner', STORE_BANNER);
    },

    // UTILS
    testTelegramNotification: async () => true,
    getCoupons: () => [],
    getAbandonedCarts: () => [],
};
