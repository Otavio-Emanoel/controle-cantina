'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { customerService } from '@/services/customerService';
import { transactionService } from '@/services/transactionService';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Customer } from '@/types';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
    } else {
      router.push('/');
    }
  }, [customerId]);

  const loadCustomer = async (id: string) => {
    try {
      setLoading(true);
      const customerData = await customerService.getById(id);
      if (customerData) {
        setCustomer(customerData);
      } else {
        alert('Cliente não encontrado');
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      alert('Erro ao carregar dados do cliente');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer) return;

    const amountValue = parseFloat(amount.replace(',', '.'));
    
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Digite um valor válido');
      return;
    }

    if (amountValue > customer.debt) {
      alert('Valor do pagamento não pode ser maior que a dívida');
      return;
    }

    try {
      setSubmitting(true);
      await transactionService.createPayment({
        customerId: customer.id,
        amount: amountValue,
        date: new Date(paymentDate),
        description: description || undefined,
      });
      alert('Pagamento registrado com sucesso!');
      router.push('/');
    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);
      alert(error.message || 'Erro ao registrar pagamento');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const setFullAmount = () => {
    if (customer) {
      setAmount(customer.debt.toFixed(2).replace('.', ','));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-800">💰 Receber Pagamento</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Informações do Cliente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Cliente</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Nome:</span> {customer.name}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Endereço:</span> {customer.address}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Telefone:</span> {customer.phone}
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">Dívida Atual</p>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(customer.debt)}</p>
            </div>
          </div>
        </div>

        {/* Formulário de Pagamento */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Dados do Pagamento</h2>

          {/* Valor */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Valor Recebido *</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-2.5 text-gray-600">R$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="button"
                onClick={setFullAmount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Valor Total
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Use vírgula para centavos (ex: 50,00)</p>
          </div>

          {/* Data */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Data do Pagamento *</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Descrição */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Observação (Opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Pagamento parcial"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {submitting ? 'Registrando...' : 'Confirmar Pagamento'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><LoadingSpinner /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
