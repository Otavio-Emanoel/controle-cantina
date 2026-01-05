import { Timestamp } from 'firebase/firestore';

// Categorias de produtos
export type ProductCategory = 'Bebidas' | 'Salgados' | 'Doces';

// Tipos de transação
export type TransactionType = 'purchase' | 'payment';

// Interface para Produto
export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
}

// Interface para Cliente
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string; // Ex: Bloco B - Apto 402
  debt: number; // Valor atual da dívida
}

// Interface para Item de uma compra
export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Interface para Transação
export interface Transaction {
  id: string;
  type: TransactionType;
  customerId: string;
  customerName: string; // Desnormalizado para facilitar queries
  amount: number;
  date: Timestamp;
  items?: PurchaseItem[]; // Só preenche se for compra
  description: string;
}

// Interface para formulário de nova venda
export interface NewSaleForm {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  date: Date;
  description?: string;
}

// Interface para formulário de pagamento
export interface NewPaymentForm {
  customerId: string;
  amount: number;
  date: Date;
  description?: string;
}
