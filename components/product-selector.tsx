'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api, Nomenclature, SaleItem } from '@/lib/api';
import { Trash2, Plus, Search, Package, Loader2, ShoppingCart } from 'lucide-react';

interface ProductSelectorProps {
  priceTypeId: number | null;
  onItemsChange: (items: SaleItem[]) => void;
}

export function ProductSelector({ priceTypeId, onItemsChange }: ProductSelectorProps) {
  const [products, setProducts] = useState<Nomenclature[]>([]);
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (search?: string) => {
    setIsLoading(true);
    try {
      const data = await api.getNomenclature(search);
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm) {
        loadProducts(searchTerm);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const addItem = (product: Nomenclature) => {
    const newItem: SaleItem = {
      nomenclature_id: product.id,
      quantity: 1,
      price: product.price != null && !isNaN(product.price) ? product.price : 0,
      discount: 0,
    };
    const updatedItems = [...selectedItems, newItem];
    setSelectedItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const updateItem = (index: number, field: keyof SaleItem, value: number) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setSelectedItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const getProductName = (id: number) => {
    return products.find((p) => p.id === id)?.name || 'Товар';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-600" />
          <Label className="text-sm font-medium">Поиск товара</Label>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Введите название товара"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-slate-400" />
          )}
        </div>
      </div>

      {products.length > 0 && (
        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-64 overflow-y-auto bg-white shadow-lg animate-in fade-in slide-in-from-top duration-200">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 transition-all duration-150"
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="p-1.5 bg-slate-100 rounded">
                  <Package className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate text-sm">{product.name}</div>
                  <div className="text-sm text-slate-600 mt-0.5 flex items-center gap-2">
                    {product.article && (
                      <Badge variant="outline" className="text-xs">
                        {product.article}
                      </Badge>
                    )}
                    <span className="font-semibold">
                      {product.price != null && !isNaN(product.price) ? `${product.price} ₽` : 'Цена не указана'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                className="ml-3 bg-blue-600 hover:bg-blue-700 text-white h-8 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => addItem(product)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {selectedItems.length > 0 && (
        <>
          <Separator className="bg-slate-100" />
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-slate-600" />
              <Label className="text-sm font-medium">Выбранные товары</Label>
              <Badge variant="secondary" className="ml-auto">
                {selectedItems.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {selectedItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-3 space-y-3 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 text-sm">{getProductName(item.nomenclature_id)}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-slate-500 hover:bg-red-50 hover:text-red-600 h-8 transition-all duration-150"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-slate-600">Количество</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, 'quantity', parseFloat(e.target.value))
                        }
                        className="h-9 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600">Цена</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(index, 'price', parseFloat(e.target.value))
                        }
                        className="h-9 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600">Скидка %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount || 0}
                        onChange={(e) =>
                          updateItem(index, 'discount', parseFloat(e.target.value))
                        }
                        className="h-9 mt-1"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Итого:</span>
                      <span className="text-base font-semibold text-slate-900">
                        {(() => {
                          const price = item.price != null && !isNaN(item.price) ? item.price : 0;
                          const quantity = item.quantity != null && !isNaN(item.quantity) ? item.quantity : 0;
                          const discount = item.discount != null && !isNaN(item.discount) ? item.discount : 0;
                          const total = price * quantity * (1 - discount / 100);
                          return `${total.toFixed(2)} ₽`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
