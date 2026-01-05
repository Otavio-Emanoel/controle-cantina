import type { Customer } from '@/types';

interface CustomerCardProps {
  customer: Customer;
  onPayment: (customer: Customer) => void;
  onViewHistory: (customer: Customer) => void;
}

export default function CustomerCard({ customer, onPayment, onViewHistory }: CustomerCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
          <p className="text-sm text-gray-600">{customer.address}</p>
          <p className="text-sm text-gray-500">{customer.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Deve</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(customer.debt)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPayment(customer)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Receber
        </button>
        <button
          onClick={() => onViewHistory(customer)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Extrato
        </button>
      </div>
    </div>
  );
}
