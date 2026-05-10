'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function TestAPIPage() {
  const [token, setToken] = useState('af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (name: string, fn: () => Promise<any>) => {
    api.setToken(token);
    setLoading(true);
    try {
      const data = await fn();
      setResults({ name, success: true, data, count: Array.isArray(data) ? data.length : 'N/A' });
      console.log(`${name} result:`, data);
    } catch (error: any) {
      setResults({ name, success: false, error: error.message, response: error.response?.data });
      console.error(`${name} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Token</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="token">API Token</Label>
            <Input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your API token"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button onClick={() => testEndpoint('Warehouses', () => api.getWarehouses())} disabled={loading}>
          Test Warehouses
        </Button>
        <Button onClick={() => testEndpoint('Payboxes', () => api.getPayboxes())} disabled={loading}>
          Test Payboxes
        </Button>
        <Button onClick={() => testEndpoint('Organizations', () => api.getOrganizations())} disabled={loading}>
          Test Organizations
        </Button>
        <Button onClick={() => testEndpoint('Price Types', () => api.getPriceTypes())} disabled={loading}>
          Test Price Types
        </Button>
        <Button onClick={() => testEndpoint('Nomenclature', () => api.getNomenclature())} disabled={loading}>
          Test Nomenclature
        </Button>
        <Button onClick={() => testEndpoint('Contragents', () => api.getContragents())} disabled={loading}>
          Test Contragents
        </Button>
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>
              {results.name} - {results.success ? `✅ Success (${results.count} items)` : '❌ Error'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-4 rounded overflow-auto max-h-96 text-xs">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
