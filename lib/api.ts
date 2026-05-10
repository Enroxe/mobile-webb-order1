import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://app.tablecrm.com/api/v1';

export interface Contragent {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  inn?: string;
  kpp?: string;
}

export interface Warehouse {
  id: number;
  name: string;
  type?: string;
  description?: string;
  address?: string;
  phone?: string;
  parent?: number | null;
  is_public?: boolean;
  status?: boolean;
  longitude?: number | null;
  latitude?: number | null;
  qr_hash?: string | null;
  qr_url?: string | null;
  updated_at?: number;
  created_at?: number;
}

export interface Paybox {
  id: number;
  name: string;
  balance?: number;
}

export interface Organization {
  id: number;
  type?: string;
  short_name: string;
  full_name?: string | null;
  work_name?: string | null;
  prefix?: string | null;
  inn?: number | null;
  kpp?: number | null;
  okved?: number | null;
  okved2?: number | null;
  okpo?: number | null;
  ogrn?: number | null;
  org_type?: string | null;
  tax_type?: string | null;
  tax_percent?: number | null;
  registration_date?: number;
  updated_at?: number;
  created_at?: number;
}

export interface PriceType {
  id: number;
  name: string;
}

export interface Nomenclature {
  id: number;
  name: string;
  price: number;
  article?: string;
  barcode?: string;
  unit?: string;
  category_id?: number;
}

export interface Category {
  id: number;
  name: string;
  parent_id?: number;
}

export interface SaleItem {
  nomenclature_id: number;
  quantity: number;
  price: number;
  discount?: number;
}

export interface SalePayload {
  contragent_id?: number;
  warehouse_id: number;
  paybox_id: number;
  organization_id: number;
  price_type_id: number;
  items: SaleItem[];
  is_conducted?: boolean;
  comment?: string;
  date?: string;
}

export interface DocSale {
  id: number;
  number: string;
  date: string;
  contragent_id?: number;
  warehouse_id: number;
  paybox_id: number;
  organization_id: number;
  price_type_id: number;
  total: number;
  is_conducted: boolean;
  items: SaleItem[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface CDEKCity {
  code: number;
  city: string;
  region?: string;
}

export interface CDEKTariff {
  tariff_code: number;
  tariff_name: string;
  delivery_sum: number;
  period_min: number;
  period_max: number;
}

export interface CDEKOrder {
  uuid: string;
  cdek_number?: string;
  tariff_code: number;
  recipient_name: string;
  recipient_phone: string;
  city_code: number;
  address: string;
  packages: Array<{
    weight: number;
    length: number;
    width: number;
    height: number;
  }>;
}

export interface Payment {
  id: number;
  date: string;
  sum: number;
  paybox_id: number;
  contragent_id?: number;
  comment?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  deadline?: string;
  assigned_to?: number;
  created_at: string;
}

class TableCRMAPI {
  private client: AxiosInstance;
  private token: string = '';

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
    });
  }

  setToken(token: string) {
    this.token = token;
  }

  private getConfig() {
    return {
      params: { token: this.token },
    };
  }

  // Contragents (Клиенты)
  async getContragents(phone?: string, search?: string): Promise<Contragent[]> {
    const params: any = { ...this.getConfig().params };
    if (phone) params.phone = phone;
    if (search) params.search = search;
    const response = await this.client.get('/contragents/', { params });
    const data = response.data?.result || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getContragent(id: number): Promise<Contragent> {
    const response = await this.client.get(`/contragents/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createContragent(data: Partial<Contragent>): Promise<Contragent> {
    const response = await this.client.post('/contragents/', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async updateContragent(id: number, data: Partial<Contragent>): Promise<Contragent> {
    const response = await this.client.put(`/contragents/${id}`, data, this.getConfig());
    return response.data?.result || response.data;
  }

  async deleteContragent(id: number): Promise<void> {
    await this.client.delete(`/contragents/${id}`, this.getConfig());
  }

  // Warehouses (Склады)
  async getWarehouses(): Promise<Warehouse[]> {
    const response = await this.client.get('/warehouses/', this.getConfig());
    console.log('Raw warehouses response:', response);
    const data = response.data?.result || response.data;
    console.log('Processed warehouses:', data);
    return Array.isArray(data) ? data : [];
  }

  async getWarehouse(id: number): Promise<Warehouse> {
    const response = await this.client.get(`/warehouses/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createWarehouse(data: Partial<Warehouse>): Promise<Warehouse> {
    const response = await this.client.post('/warehouses/', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async updateWarehouse(id: number, data: Partial<Warehouse>): Promise<Warehouse> {
    const response = await this.client.put(`/warehouses/${id}`, data, this.getConfig());
    return response.data?.result || response.data;
  }

  async deleteWarehouse(id: number): Promise<void> {
    await this.client.delete(`/warehouses/${id}`, this.getConfig());
  }

  // Payboxes (Счета)
  async getPayboxes(): Promise<Paybox[]> {
    const response = await this.client.get('/payboxes/', this.getConfig());
    console.log('Raw payboxes response:', response);
    const data = response.data?.result || response.data;
    console.log('Processed payboxes:', data);
    return Array.isArray(data) ? data : [];
  }

  async getPaybox(id: number): Promise<Paybox> {
    const response = await this.client.get(`/payboxes/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createPaybox(data: Partial<Paybox>): Promise<Paybox> {
    const response = await this.client.post('/payboxes/', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async updatePaybox(id: number, data: Partial<Paybox>): Promise<Paybox> {
    const response = await this.client.put(`/payboxes/${id}`, data, this.getConfig());
    return response.data?.result || response.data;
  }

  async deletePaybox(id: number): Promise<void> {
    await this.client.delete(`/payboxes/${id}`, this.getConfig());
  }

  // Organizations (Организации)
  async getOrganizations(): Promise<Organization[]> {
    const response = await this.client.get('/organizations/', this.getConfig());
    console.log('Raw organizations response:', response);
    const data = response.data?.result || response.data;
    console.log('Processed organizations:', data);
    return Array.isArray(data) ? data : [];
  }

  async getOrganization(id: number): Promise<Organization> {
    const response = await this.client.get(`/organizations/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    const response = await this.client.post('/organizations/', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async updateOrganization(id: number, data: Partial<Organization>): Promise<Organization> {
    const response = await this.client.put(`/organizations/${id}`, data, this.getConfig());
    return response.data?.result || response.data;
  }

  async deleteOrganization(id: number): Promise<void> {
    await this.client.delete(`/organizations/${id}`, this.getConfig());
  }

  // Price Types (Типы цен)
  async getPriceTypes(): Promise<PriceType[]> {
    const response = await this.client.get('/price_types/', this.getConfig());
    console.log('Raw price types response:', response);
    const data = response.data?.result || response.data;
    console.log('Processed price types:', data);
    return Array.isArray(data) ? data : [];
  }

  async getPriceType(id: number): Promise<PriceType> {
    const response = await this.client.get(`/price_types/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createPriceType(data: Partial<PriceType>): Promise<PriceType> {
    const response = await this.client.post('/price_types/', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async updatePriceType(id: number, data: Partial<PriceType>): Promise<PriceType> {
    const response = await this.client.put(`/price_types/${id}`, data, this.getConfig());
    return response.data?.result || response.data;
  }

  async deletePriceType(id: number): Promise<void> {
    await this.client.delete(`/price_types/${id}`, this.getConfig());
  }

  // Nomenclature (Товары)
  async getNomenclature(search?: string, category_id?: number): Promise<Nomenclature[]> {
    const params: any = { ...this.getConfig().params };
    if (search) params.search = search;
    if (category_id) params.category_id = category_id;
    const response = await this.client.get('/nomenclature/', { params });
    const data = response.data?.result || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getNomenclatureItem(id: number): Promise<Nomenclature> {
    const response = await this.client.get(`/nomenclature/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createNomenclature(data: Partial<Nomenclature>): Promise<Nomenclature> {
    const response = await this.client.post('/nomenclature/', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async updateNomenclature(id: number, data: Partial<Nomenclature>): Promise<Nomenclature> {
    const response = await this.client.put(`/nomenclature/${id}`, data, this.getConfig());
    return response.data?.result || response.data;
  }

  async deleteNomenclature(id: number): Promise<void> {
    await this.client.delete(`/nomenclature/${id}`, this.getConfig());
  }

  // Categories (Категории)
  async getCategories(): Promise<Category[]> {
    const response = await this.client.get('/categories/', this.getConfig());
    const data = response.data?.result || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.client.get(`/categories/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await this.client.post('/categories/', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const response = await this.client.put(`/categories/${id}`, data, this.getConfig());
    return response.data?.result || response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.client.delete(`/categories/${id}`, this.getConfig());
  }

  // Sales Documents (Документы продаж)
  async getSales(date_from?: string, date_to?: string): Promise<DocSale[]> {
    const params: any = { ...this.getConfig().params };
    if (date_from) params.date_from = date_from;
    if (date_to) params.date_to = date_to;
    const response = await this.client.get('/docs_sales/', { params });
    const data = response.data?.result || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getSale(id: number): Promise<DocSale> {
    const response = await this.client.get(`/docs_sales/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createSale(payload: SalePayload): Promise<DocSale> {
    const response = await this.client.post('/docs_sales/', payload, this.getConfig());
    return response.data?.result || response.data;
  }

  async updateSale(id: number, payload: Partial<SalePayload>): Promise<DocSale> {
    const response = await this.client.put(`/docs_sales/${id}`, payload, this.getConfig());
    return response.data?.result || response.data;
  }

  async deleteSale(id: number): Promise<void> {
    await this.client.delete(`/docs_sales/${id}`, this.getConfig());
  }

  async conductSale(id: number): Promise<DocSale> {
    const response = await this.client.post(`/docs_sales/${id}/conduct`, {}, this.getConfig());
    return response.data?.result || response.data;
  }

  async unconductSale(id: number): Promise<DocSale> {
    const response = await this.client.post(`/docs_sales/${id}/unconduct`, {}, this.getConfig());
    return response.data?.result || response.data;
  }

  // Payments (Платежи)
  async getPayments(date_from?: string, date_to?: string): Promise<Payment[]> {
    const params: any = { ...this.getConfig().params };
    if (date_from) params.date_from = date_from;
    if (date_to) params.date_to = date_to;
    const response = await this.client.get('/payments/', { params });
    const data = response.data?.result || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getPayment(id: number): Promise<Payment> {
    const response = await this.client.get(`/payments/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    const response = await this.client.post('/payments/', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async updatePayment(id: number, data: Partial<Payment>): Promise<Payment> {
    const response = await this.client.put(`/payments/${id}`, data, this.getConfig());
    return response.data?.result || response.data;
  }

  async deletePayment(id: number): Promise<void> {
    await this.client.delete(`/payments/${id}`, this.getConfig());
  }

  // Users (Пользователи)
  async getUsers(): Promise<User[]> {
    const response = await this.client.get('/users/', this.getConfig());
    const data = response.data?.result || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getUser(id: number): Promise<User> {
    const response = await this.client.get(`/users/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/users/me', this.getConfig());
    return response.data?.result || response.data;
  }

  // Tasks (Задачи)
  async getTasks(status?: string): Promise<Task[]> {
    const params: any = { ...this.getConfig().params };
    if (status) params.status = status;
    const response = await this.client.get('/tasks/', { params });
    const data = response.data?.result || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getTask(id: number): Promise<Task> {
    const response = await this.client.get(`/tasks/${id}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    const response = await this.client.post('/tasks/', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    const response = await this.client.put(`/tasks/${id}`, data, this.getConfig());
    return response.data?.result || response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await this.client.delete(`/tasks/${id}`, this.getConfig());
  }

  // CDEK Integration
  async getCDEKCities(search: string): Promise<CDEKCity[]> {
    const params: any = { ...this.getConfig().params, search };
    const response = await this.client.get('/cdek/cities', { params });
    const data = response.data?.result || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getCDEKTariffs(data: {
    from_location: number;
    to_location: number;
    packages: Array<{ weight: number; length: number; width: number; height: number }>;
  }): Promise<CDEKTariff[]> {
    const response = await this.client.post('/cdek/calculate', data, this.getConfig());
    const result = response.data?.result || response.data;
    return Array.isArray(result) ? result : [];
  }

  async createCDEKOrder(data: Partial<CDEKOrder>): Promise<CDEKOrder> {
    const response = await this.client.post('/cdek/orders', data, this.getConfig());
    return response.data?.result || response.data;
  }

  async getCDEKOrders(): Promise<CDEKOrder[]> {
    const response = await this.client.get('/cdek/orders', this.getConfig());
    const data = response.data?.result || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getCDEKOrder(uuid: string): Promise<CDEKOrder> {
    const response = await this.client.get(`/cdek/orders/${uuid}`, this.getConfig());
    return response.data?.result || response.data;
  }

  async deleteCDEKOrder(uuid: string): Promise<void> {
    await this.client.delete(`/cdek/orders/${uuid}`, this.getConfig());
  }

  async getCDEKTemplate(): Promise<Blob> {
    const response = await this.client.get('/cdek/template', {
      ...this.getConfig(),
      responseType: 'blob',
    });
    return response.data;
  }

  // Reports (Отчеты)
  async getSalesReport(date_from: string, date_to: string): Promise<any> {
    const params: any = { ...this.getConfig().params, date_from, date_to };
    const response = await this.client.get('/reports/sales', { params });
    return response.data?.result || response.data;
  }

  async getStockReport(warehouse_id?: number): Promise<any> {
    const params: any = { ...this.getConfig().params };
    if (warehouse_id) params.warehouse_id = warehouse_id;
    const response = await this.client.get('/reports/stock', { params });
    return response.data?.result || response.data;
  }

  async getFinanceReport(date_from: string, date_to: string): Promise<any> {
    const params: any = { ...this.getConfig().params, date_from, date_to };
    const response = await this.client.get('/reports/finance', { params });
    return response.data?.result || response.data;
  }
}

export const api = new TableCRMAPI();
