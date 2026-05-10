'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { KeyRound, Loader2 } from 'lucide-react';

interface TokenFormProps {
  onTokenSubmit: (token: string) => void;
}

export function TokenForm({ onTokenSubmit }: TokenFormProps) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      api.setToken(token);
      await api.getWarehouses();
      onTokenSubmit(token);
    } catch (err) {
      setError('Неверный токен или ошибка подключения');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-slate-200 shadow-xl">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <KeyRound className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Авторизация</CardTitle>
          </div>
          <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 animate-in fade-in duration-300">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Касса отключена
          </Badge>
        </div>
        <CardDescription>
          Введите токен для доступа к кассе
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token" className="text-sm font-medium">
              Токен доступа
            </Label>
            <Input
              id="token"
              type="text"
              placeholder="Введите ваш токен"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top duration-300">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Проверка...
              </>
            ) : (
              'Войти'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
