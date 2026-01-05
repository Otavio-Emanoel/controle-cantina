'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { customerService } from '@/services/customerService';
import { transactionService } from '@/services/transactionService';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Customer, Transaction } from '@/types';

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      loadData();
    }
  }, [customerId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [customerData, transactionsData] = await Promise.all([
        customerService.getById(customerId),
        transactionService.getByCustomer(customerId),
      ]);

      if (customerData) {
        setCustomer(customerData);
        setTransactions(transactionsData);
      } else {
        alert('Cliente não encontrado');
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getTotalPurchases = () => {
    return transactions
      .filter((t) => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalPayments = () => {
    return transactions
      .filter((t) => t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
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
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => router.push('/')} className="text-gray-600 hover:text-gray-800">
              ← Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-800">📋 Extrato do Cliente</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Informações do Cliente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{customer.name}</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-semibold">Endereço:</span> {customer.address}
                </p>
                <p>
                  <span className="font-semibold">Telefone:</span> {customer.phone}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Dívida Atual</p>
              <p className="text-4xl font-bold text-red-600 mb-4">
                {formatCurrency(customer.debt)}
              </p>
              <button
                onClick={() => router.push(`/payment?customerId=${customer.id}`)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors"
              >
                💰 Receber Pagamento
              </button>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Total em Compras</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalPurchases())}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Total Pago</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(getTotalPayments())}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Transações</p>
            <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
          </div>
        </div>

        {/* Histórico de Transações */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h2 className="text-lg font-bold text-gray-800">Histórico de Transações</h2>
          </div>

          {transactions.length === 0 ? (
            <EmptyState message="Nenhuma transação encontrada" icon="📄" />
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'purchase'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {transaction.type === 'purchase' ? '🛒 Compra' : '💰 Pagamento'}
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
                      </div>
                      <p className="text-gray-700">{transaction.description}</p>
                      
                      {/* Itens da compra */}
                      {transaction.items && transaction.items.length > 0 && (
                        <div className="mt-2 pl-4 border-l-2 border-gray-200">
                          {transaction.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-600 flex justify-between">
                              <span>
                                {item.quantity}x {item.productName}
                              </span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p
                        className={`text-2xl font-bold ${
                          transaction.type === 'purchase' ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {transaction.type === 'purchase' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
