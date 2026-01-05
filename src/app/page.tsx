'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { customerService } from '@/services/customerService';
import { transactionService } from '@/services/transactionService';
import CustomerCard from '@/components/CustomerCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import type { Customer } from '@/types';

export default function Home() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalDebt, setTotalDebt] = useState(0);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term) ||
          customer.address.toLowerCase().includes(term)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const debtors = await customerService.getWithDebt();
      setCustomers(debtors);
      setFilteredCustomers(debtors);
      
      const total = await transactionService.getTotalDebt();
      setTotalDebt(total);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert('Erro ao carregar dados. Verifique a configuração do Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (customer: Customer) => {
    router.push(`/payment?customerId=${customer.id}`);
  };

  const handleViewHistory = (customer: Customer) => {
    router.push(`/customer/${customer.id}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">🏪 CondoCantina</h1>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total a Receber</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDebt)}</p>
            </div>
          </div>

          {/* Menu de Navegação */}
          <nav className="flex gap-2 flex-wrap">
            <button
              onClick={() => router.push('/sale')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              + Nova Venda
            </button>
            <button
              onClick={() => router.push('/customers')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              👥 Clientes
            </button>
            <button
              onClick={() => router.push('/products')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              📦 Produtos
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Barra de Busca */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nome ou endereço (Bloco/Apto)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lista de Devedores */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📋 Painel de Devedores
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : filteredCustomers.length === 0 ? (
            <EmptyState
              message={
                searchTerm
                  ? 'Nenhum cliente encontrado com esse filtro'
                  : 'Nenhum cliente com dívidas pendentes! 🎉'
              }
              icon={searchTerm ? '🔍' : '✅'}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onPayment={handlePayment}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
