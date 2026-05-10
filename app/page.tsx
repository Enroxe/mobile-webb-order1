'use client';

import { useState } from 'react';
import { TokenForm } from '@/components/token-form';
import { OrderForm } from '@/components/order-form';
import { ShoppingCart } from 'lucide-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleTokenSubmit = (token: string) => {
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            TableCRM
          </h1>
          <p className="text-sm text-slate-600">Мобильная форма заказа</p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom duration-700">
          {!isAuthenticated ? (
            <TokenForm onTokenSubmit={handleTokenSubmit} />
          ) : (
            <OrderForm />
          )}
        </div>
      </div>
    </div>
  );
}
