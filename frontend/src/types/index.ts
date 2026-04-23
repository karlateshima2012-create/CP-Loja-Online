
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export type Language = 'pt' | 'en' | 'jp';

export enum PaymentMethod {
  SQUARE = 'SQUARE',
  PAYPAY = 'PAYPAY',
  TRANSFER = 'TRANSFER'
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  BUDGET_SENT = 'BUDGET_SENT',
  PAID = 'PAID',
  WAITING_FORM = 'WAITING_FORM',
  CUSTOMIZATION_RECEIVED = 'CUSTOMIZATION_RECEIVED',
  PRODUCTION = 'PRODUCTION',
  SHIPPED = 'SHIPPED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ConnectPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum TestimonialSource {
  GOOGLE = 'GOOGLE',
  INSTAGRAM = 'INSTAGRAM',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  STORE = 'LOJA_VIRTUAL'
}

export type FlixButtonStyle = 'solid' | 'outline' | 'glass' | 'hard-shadow' | 'soft-shadow';
export type FlixButtonShape = 'rounded' | 'pill' | 'square' | 'sharp';
export type FlixFont = 'sans' | 'serif' | 'mono';
export type FlixFontSize = 'sm' | 'md' | 'lg' | 'xl';
export type FlixTextTransform = 'uppercase' | 'none';
export type FlixFontWeight = '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type FlixPageType = 'LINKS' | 'LANDING' | 'STORE' | 'MENU' | 'CATALOG' | 'SERVICES';
export type FlixPlanType = 'FREE' | 'PREMIUM';

export interface FlixStyleConfig {
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundColor: string;
  backgroundGradientEnd?: string;
  backgroundImageUrl?: string;
  fontFamily: FlixFont;
  fontSize?: FlixFontSize;
  fontWeight?: string; // Add font weight
  textTransform?: FlixTextTransform;
  textColor: string;
  secondaryTextColor?: string; // Add secondary text color
  buttonStyle: FlixButtonStyle;
  buttonShape: FlixButtonShape;
  buttonColor: string;
  buttonTextColor: string;
  borderColor?: string; // Add border color
  borderRadius?: number; // Add border radius
  effectColor: string;
  layoutMode: 'stack' | 'grid';
}

export interface FlixLink {
  id: string;
  type: 'link' | 'header' | 'social';
  label: string;
  subLabel?: string;
  url?: string;
  icon?: string;
  thumbnailUrl?: string;
  active: boolean;
  highlight?: boolean;
  order: number;
}

export interface FlixProfile {
  id: string;
  customerId?: string;
  slug: string;
  displayName: string;
  companyName?: string;
  phone?: string;
  city?: string;
  province?: string;
  prefecture?: string;
  type?: 'company' | 'professional';
  slogan?: string;
  fullBio?: string;
  profileImageUrl: string;
  coverImageUrl?: string;
  posterImageUrl?: string;
  template_key?: string;
  style: FlixStyleConfig;
  category: string;
  niche?: string;
  tags: string[];
  links: FlixLink[];
  views: number;
  active: boolean;
  createdAt: string;
  isPremium: boolean;
  planType: FlixPlanType;
  pageType: FlixPageType;
  planExpirationDate?: string;
  planStatus?: 'active' | 'expired' | 'suspended';
  linkedOrderId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  active: boolean;
  customerId?: string;
  used?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  birthday?: string;
  ordersCount: number;
  createdAt: string;
  source?: string;
  notes?: string;
  plan?: FlixPlanType;
  planStatus?: 'active' | 'expired' | 'suspended';
  planExpirationDate?: string;
}

export interface AbandonedCart {
  id: string;
  customerName?: string;
  customerEmail?: string;
  items: CartItem[];
  totalValue: number;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  source: TestimonialSource;
  avatarUrl?: string;
  date: string;
  reply?: string;
  orderId?: string;
  approved: boolean;
}

export interface ConnectPage {
  id: string;
  createdAt: string;
  customerName: string;
  plan: ConnectPlan;
  active: boolean;
}

export interface PriceTier {
  quantity: number;
  totalPrice: number;
  isBestSeller?: boolean;
}

export interface PlanOption {
  months: number;
  totalPrice: number;
  description?: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
}

export interface RecipeItem {
  materialId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceTiers?: PriceTier[];
  plans?: PlanOption[];
  recipe?: RecipeItem[];
  imageUrl: string;
  additionalImages?: string[];
  category: string;
  isExclusive: boolean;
  allowAffiliate: boolean;
  customizationFields?: string[];
  allowLogoUpload?: boolean;
  allowObservations?: boolean;
  isCustomizable?: boolean;
  includesFreePage?: boolean;
  fixedShippingFee?: number;
  isFeatured?: boolean;
  isRecommended?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  customizationValues?: Record<string, string>;
  selectedPlanMonths?: number;
}

export interface Order {
  id: string;
  customerId?: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount?: number;
  couponCodes?: string[];
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentProofUrl?: string;
  paymentLink?: string;
  freePageCreated?: boolean;
  trackingCode?: string;
  stockDeducted?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  lastAccess: string;
}

export interface SystemSettings {
  payment: {
    jpBankName: string;
    jpAccountNumber: string;
    jpHolderName: string;
    otherBankName: string;
    otherBankCode: string;
    otherBranchName: string;
    otherAccountNumber: string;
    otherAccountType: string;
    otherHolderName: string;
  };
  email: {
    senderName: string;
    senderEmail: string;
    smtpHost: string;
    smtpPort: string;
  };
  store: {
    storeName: string;
    description: string;
    supportPhone: string;
  };
  branding: {
    logoUrl: string;
    bannerUrl: string;
    primaryColor: string;
    secondaryColor: string;
  };
  telegram: {
    botToken: string;
    chatId: string;
    enabled: boolean;
  };
  admins: AdminUser[];
}

export interface SiteTexts {
  [key: string]: string;
}
