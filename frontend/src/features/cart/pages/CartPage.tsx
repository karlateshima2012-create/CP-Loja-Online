
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../CartContext';
import { Order } from '@/src/types';
import { CartView } from './cart/CartView';
import { CheckoutView } from './cart/CheckoutView';
import { OrderSuccessView } from './cart/OrderSuccessView';

export const CartPage: React.FC = () => {
  const { cart } = useCart();
  const [searchParams] = useSearchParams();

  // Logic: Check if URL has ?step=checkout to auto-open checkout view
  // Useful when returning from Login/Register
  const initialStep = searchParams.get('step') === 'checkout' && cart.length > 0 ? 'checkout' : 'cart';

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>(initialStep);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');

  // Coupons are now handled via Context (useCart), removed local state 'appliedCoupons'

  // Garante que a página abra no topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update step if URL param changes (e.g. navigation within same component)
  useEffect(() => {
    if (searchParams.get('step') === 'checkout' && cart.length > 0) {
      setStep('checkout');
    }
  }, [searchParams, cart.length]);

  // Lógica de Frete Centralizada (Immediate Calculation)
  const shippingCost = useMemo(() => {
    // Regra 1: Calcular volume APENAS de itens físicos
    const physicalItems = cart.filter(item => item.category !== 'Serviços Digitais');
    const totalPhysicalQty = physicalItems.reduce((acc, item) => acc + item.quantity, 0);

    // Base: 0 se só tiver digitais (ou carrinho vazio). 400 para 1-2 itens físicos, 600 para 3+ itens físicos.
    let baseFee = 0;
    if (totalPhysicalQty > 0) {
      baseFee = totalPhysicalQty <= 2 ? 400 : 600;
    }

    // Regra 2: Verifica overrides específicos de QUALQUER produto
    let maxOverride = 0;
    cart.forEach(item => {
      if (item.fixedShippingFee !== undefined && item.fixedShippingFee > maxOverride) {
        maxOverride = item.fixedShippingFee;
      }
    });

    // Regra 3: Se houver um override maior que a base calculada, usa ele.
    return Math.max(baseFee, maxOverride);
  }, [cart]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-white mb-8 flex items-center gap-3">
        <span className="bg-gradient-to-br from-brand-blue to-brand-yellow w-3 h-10 rounded-full"></span>
        {step === 'cart' ? 'Carrinho de Compras' : step === 'checkout' ? 'Finalizar Pedido' : 'Pedido Concluído'}
      </h1>

      {step === 'cart' && (
        <CartView
          onProceed={() => setStep('checkout')}
          shippingCost={shippingCost}
        />
      )}

      {step === 'checkout' && (
        <CheckoutView
          onBack={() => setStep('cart')}
          onSuccess={(order) => { setLastOrder(order); setStep('success'); }}
          shippingCost={shippingCost}
          setDeliveryMethod={setDeliveryMethod}
          deliveryMethod={deliveryMethod}
        />
      )}

      {step === 'success' && lastOrder && (
        <OrderSuccessView order={lastOrder} />
      )}
    </div>
  );
};
