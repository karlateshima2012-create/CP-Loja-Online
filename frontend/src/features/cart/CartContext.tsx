import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Coupon } from '@/src/types';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { mockService } from '@/src/services/mockData';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number, customization?: Record<string, string>) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    appliedCoupons: Coupon[];
    applyCoupon: (code: string, customerId?: string) => { success: boolean; message?: string };
    removeCoupon: (couponId: string) => void;
    clearCoupons: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize Cart from LocalStorage
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);
    const { user } = useAuth();

    // Persist to Local Storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Sync abandoned cart
    useEffect(() => {
        let identifier = user?.id;
        if (!identifier) {
            let guestId = localStorage.getItem('guestCartId');
            if (!guestId) {
                guestId = `guest-${Date.now()}`;
                localStorage.setItem('guestCartId', guestId);
            }
            identifier = guestId;
        }

        mockService.syncAbandonedCart(
            identifier,
            cart,
            user?.name || 'Visitante',
            user?.email
        );
    }, [cart, user]);

    const addToCart = (product: Product, quantity: number, customization?: Record<string, string>) => {
        const existingItemIndex = cart.findIndex(item =>
            item.id === product.id &&
            JSON.stringify(item.customizationValues) === JSON.stringify(customization)
        );

        if (existingItemIndex > -1) {
            setCart(prev => prev.map((item, index) =>
                index === existingItemIndex
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            const newItem: CartItem = {
                ...product,
                cartId: `${product.id}-${Date.now()}`,
                quantity,
                customizationValues: customization
            };
            setCart(prev => [...prev, newItem]);
        }
    };

    const removeFromCart = (cartId: string) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCart(prev => prev.map(item =>
            item.cartId === cartId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    const applyCoupon = (code: string, customerId?: string): { success: boolean; message?: string } => {
        if (appliedCoupons.some(c => c.code === code.toUpperCase())) {
            return { success: false, message: 'Este cupom já foi aplicado.' };
        }

        const coupon = mockService.validateCoupon(code.toUpperCase(), customerId);

        if (coupon) {
            setAppliedCoupons(prev => [...prev, coupon]);
            return { success: true };
        } else {
            return { success: false, message: 'Cupom inválido, expirado ou já utilizado.' };
        }
    };

    const removeCoupon = (couponId: string) => {
        setAppliedCoupons(prev => prev.filter(c => c.id !== couponId));
    };

    const clearCoupons = () => setAppliedCoupons([]);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            appliedCoupons, applyCoupon, removeCoupon, clearCoupons
        }}>
            {children}
        </CartContext.Provider>
    );
};
