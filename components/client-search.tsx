'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { api, Contragent } from '@/lib/api';
import { User, Phone, Loader2, CheckCircle2 } from 'lucide-react';

interface ClientSearchProps {
  onClientSelect: (client: Contragent | null) => void;
}

export function ClientSearch({ onClientSelect }: ClientSearchProps) {
  const [phone, setPhone] = useState('');
  const [clients, setClients] = useState<Contragent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Contragent | null>(null);

  useEffect(() => {
    const searchClients = async () => {
      if (phone.length < 3) {
        setClients([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await api.getContragents(phone);
        setClients(results);
      } catch (err) {
        console.error('Error searching clients:', err);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchClients, 300);
    return () => clearTimeout(debounce);
  }, [phone]);

  const handleClientSelect = (client: Contragent) => {
    setSelectedClient(client);
    setPhone(client.phone || '');
    setClients([]);
    onClientSelect(client);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-slate-600" />
        <Label htmlFor="phone" className="text-sm font-medium">
          Телефон клиента
        </Label>
        {selectedClient && (
          <Badge variant="default" className="ml-auto bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Выбран
          </Badge>
        )}
      </div>
      <div className="relative">
        <Input
          id="phone"
          type="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (selectedClient) {
              setSelectedClient(null);
              onClientSelect(null);
            }
          }}
          className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-slate-400" />
        )}
      </div>

      {clients.length > 0 && (
        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-64 overflow-y-auto shadow-lg bg-white animate-in fade-in slide-in-from-top duration-200">
          {clients.map((client) => (
            <button
              key={client.id}
              type="button"
              className="w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-all duration-150 flex items-start gap-3"
              onClick={() => handleClientSelect(client)}
            >
              <div className="p-1.5 bg-slate-100 rounded">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate">{client.name}</div>
                {client.phone && (
                  <div className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                    <Phone className="h-3 w-3" />
                    {client.phone}
                  </div>
                )}
                {client.email && (
                  <div className="text-xs text-slate-500 mt-0.5">{client.email}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedClient && (
        <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <div className="flex-1">
            <div className="text-sm font-medium text-green-900">
              Выбран: {selectedClient.name}
            </div>
            {selectedClient.phone && (
              <div className="text-xs text-green-700">{selectedClient.phone}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
