'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientSearch } from '@/components/client-search';
import { ProductSelector } from '@/components/product-selector';
import { FancySelect } from '@/components/fancy-select';
import { api, Contragent, Warehouse, Paybox, Organization, PriceType, SaleItem, SalePayload } from '@/lib/api';
import { Building2, Warehouse as WarehouseIcon, CreditCard, Tag, ShoppingBag, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function OrderForm() {
  const [client, setClient] = useState<Contragent | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [payboxes, setPayboxes] = useState<Paybox[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);

  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [selectedPaybox, setSelectedPaybox] = useState<number | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<number | null>(null);
  const [selectedPriceType, setSelectedPriceType] = useState<number | null>(null);
  const [items, setItems] = useState<SaleItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [warehousesData, payboxesData, organizationsData, priceTypesData] = await Promise.all([
        api.getWarehouses(),
        api.getPayboxes(),
        api.getOrganizations(),
        api.getPriceTypes(),
      ]);

      setWarehouses(warehousesData);
      setPayboxes(payboxesData);
      setOrganizations(organizationsData);
      setPriceTypes(priceTypesData);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error('Error loading data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (isConducted: boolean) => {
    setError('');
    setSuccess('');

    if (!selectedWarehouse || !selectedPaybox || !selectedOrganization || !selectedPriceType) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (items.length === 0) {
      setError('Добавьте хотя бы один товар');
      return;
    }

    setIsLoading(true);

    try {
      const payload: SalePayload = {
        contragent_id: client?.id,
        warehouse_id: selectedWarehouse,
        paybox_id: selectedPaybox,
        organization_id: selectedOrganization,
        price_type_id: selectedPriceType,
        items: items,
        is_conducted: isConducted,
      };

      await api.createSale(payload);
      setSuccess(isConducted ? 'Продажа создана и проведена' : 'Продажа создана');

      setClient(null);
      setItems([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка создания продажи');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const price = item.price != null && !isNaN(item.price) ? item.price : 0;
      const quantity = item.quantity != null && !isNaN(item.quantity) ? item.quantity : 0;
      const discount = item.discount != null && !isNaN(item.discount) ? item.discount : 0;
      return sum + price * quantity * (1 - discount / 100);
    }, 0).toFixed(2);
  };

  const payboxOptions = payboxes.map((p) => ({
    id: p.id,
    label: p.name,
  }));

  const organizationOptions = organizations.map((o) => ({
    id: o.id,
    label: o.short_name || o.full_name || o.work_name || 'Без названия',
    sublabel: o.org_type || undefined,
  }));

  const warehouseOptions = warehouses.map((w) => ({
    id: w.id,
    label: w.name,
    sublabel: w.address || w.type || undefined,
  }));

  const priceTypeOptions = priceTypes.map((pt) => ({
    id: pt.id,
    label: pt.name,
  }));

  return (
    <Card className="w-full max-w-3xl mx-auto border-slate-200 shadow-xl">
      <CardHeader className="border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Оформление заказа</CardTitle>
          </div>
          <Badge variant="default" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 animate-in fade-in duration-300">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Касса подключена
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {isLoadingData ? (
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <div className="animate-in fade-in slide-in-from-top duration-300">
              <ClientSearch onClientSelect={setClient} />
            </div>

            <Separator className="bg-slate-100" />

            <div className="grid gap-6 animate-in fade-in slide-in-from-top duration-500">
              <FancySelect
                value={selectedPaybox}
                onValueChange={setSelectedPaybox}
                options={payboxOptions}
                placeholder="Выберите счет"
                label="Счет"
                icon={<CreditCard className="h-4 w-4 text-slate-600" />}
                emptyMessage="Нет доступных счетов"
              />

              <FancySelect
                value={selectedOrganization}
                onValueChange={setSelectedOrganization}
                options={organizationOptions}
                placeholder="Выберите организацию"
                label="Организация"
                icon={<Building2 className="h-4 w-4 text-slate-600" />}
                emptyMessage="Нет доступных организаций"
              />

              <FancySelect
                value={selectedWarehouse}
                onValueChange={setSelectedWarehouse}
                options={warehouseOptions}
                placeholder="Выберите склад"
                label="Склад"
                icon={<WarehouseIcon className="h-4 w-4 text-slate-600" />}
                emptyMessage="Нет доступных складов"
              />

              <FancySelect
                value={selectedPriceType}
                onValueChange={setSelectedPriceType}
                options={priceTypeOptions}
                placeholder="Выберите тип цены"
                label="Тип цены"
                icon={<Tag className="h-4 w-4 text-slate-600" />}
                emptyMessage="Нет доступных типов цен"
              />
            </div>

            <Separator className="bg-slate-100" />

            <div className="animate-in fade-in slide-in-from-bottom duration-500">
              <ProductSelector priceTypeId={selectedPriceType} onItemsChange={setItems} />
            </div>

            {items.length > 0 && (
              <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-700">Итого:</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {calculateTotal()} ₽
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top duration-300">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top duration-300">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200"
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Создать продажу
              </Button>
              <Button
                type="button"
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Создать и провести
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
