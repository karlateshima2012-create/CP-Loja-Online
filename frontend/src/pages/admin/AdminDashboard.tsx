
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminOverview } from './components/AdminOverview';
import { OrdersManager } from './components/OrdersManager';
import { OrderDetail } from './components/OrderDetail';
import { ProductsManager } from './components/ProductsManager';
import { PartnersManager } from './components/PartnersManager';
import { PayoutsManager } from './components/PayoutsManager';
import { SettingsManager } from './components/SettingsManager';
import { TestimonialsManager } from './components/TestimonialsManager';
import { CouponsManager } from './components/CouponsManager'; 
import { MaterialsManager } from './components/MaterialsManager';
import { ContentManager } from './components/ContentManager';
import { CustomersManager } from './components/CustomersManager';
import { FlixManager } from './components/FlixManager'; // New import

export const AdminDashboard: React.FC = () => {
  return (
    <div className="pb-10">
        <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/orders" element={<OrdersManager />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/customers" element={<CustomersManager />} />
            <Route path="/flix" element={<FlixManager />} />
            <Route path="/products" element={<ProductsManager />} />
            <Route path="/materials" element={<MaterialsManager />} />
            <Route path="/partners" element={<PartnersManager />} />
            <Route path="/payouts" element={<PayoutsManager />} />
            <Route path="/testimonials" element={<TestimonialsManager />} />
            <Route path="/coupons" element={<CouponsManager />} />
            <Route path="/settings" element={<SettingsManager />} />
            <Route path="/content" element={<ContentManager />} />
        </Routes>
    </div>
  );
};
