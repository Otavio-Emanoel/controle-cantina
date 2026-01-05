import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Transaction, NewSaleForm, NewPaymentForm, PurchaseItem } from '@/types';
import { customerService } from './customerService';
import { productService } from './productService';

const COLLECTION_NAME = 'transactions';

export const transactionService = {
  // Criar uma compra (aumenta a dívida do cliente)
  async createPurchase(saleData: NewSaleForm): Promise<string> {
    // Buscar dados do cliente e produtos
    const customer = await customerService.getById(saleData.customerId);
    if (!customer) throw new Error('Cliente não encontrado');

    // Calcular total e preparar items
    let total = 0;
    const items: PurchaseItem[] = [];

    for (const item of saleData.items) {
      const product = await productService.getById(item.productId);
      if (!product) throw new Error(`Produto ${item.productId} não encontrado`);

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      items.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Usar transação do Firestore para garantir consistência
    const transactionId = await runTransaction(db, async (transaction) => {
      const customerRef = doc(db, 'customers', saleData.customerId);
      const customerDoc = await transaction.get(customerRef);

      if (!customerDoc.exists()) {
        throw new Error('Cliente não existe');
      }

      const currentDebt = customerDoc.data().debt || 0;
      const newDebt = currentDebt + total;

      // Atualizar dívida do cliente
      transaction.update(customerRef, { debt: newDebt });

      // Criar transação
      const transactionRef = doc(collection(db, COLLECTION_NAME));
      transaction.set(transactionRef, {
        type: 'purchase',
        customerId: saleData.customerId,
        customerName: customer.name,
        amount: total,
        date: Timestamp.fromDate(saleData.date),
        items,
        description: saleData.description || `Compra de ${items.length} item(ns)`,
      });

      return transactionRef.id;
    });

    return transactionId;
  },

  // Criar um pagamento (diminui a dívida do cliente)
  async createPayment(paymentData: NewPaymentForm): Promise<string> {
    const customer = await customerService.getById(paymentData.customerId);
    if (!customer) throw new Error('Cliente não encontrado');

    if (paymentData.amount <= 0) {
      throw new Error('Valor do pagamento deve ser maior que zero');
    }

    if (paymentData.amount > customer.debt) {
      throw new Error('Valor do pagamento não pode ser maior que a dívida');
    }

    // Usar transação do Firestore
    const transactionId = await runTransaction(db, async (transaction) => {
      const customerRef = doc(db, 'customers', paymentData.customerId);
      const customerDoc = await transaction.get(customerRef);

      if (!customerDoc.exists()) {
        throw new Error('Cliente não existe');
      }

      const currentDebt = customerDoc.data().debt || 0;
      const newDebt = Math.max(0, currentDebt - paymentData.amount);

      // Atualizar dívida do cliente
      transaction.update(customerRef, { debt: newDebt });

      // Criar transação
      const transactionRef = doc(collection(db, COLLECTION_NAME));
      transaction.set(transactionRef, {
        type: 'payment',
        customerId: paymentData.customerId,
        customerName: customer.name,
        amount: paymentData.amount,
        date: Timestamp.fromDate(paymentData.date),
        description: paymentData.description || 'Pagamento recebido',
      });

      return transactionRef.id;
    });

    return transactionId;
  },

  // Buscar transações de um cliente
  async getByCustomer(customerId: string): Promise<Transaction[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('customerId', '==', customerId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  },

  // Buscar todas as transações (para relatórios)
  async getAll(): Promise<Transaction[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  },

  // Buscar transações por período
  async getByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  },

  // Calcular total a receber (soma de todas as dívidas)
  async getTotalDebt(): Promise<number> {
    const customers = await customerService.getAll();
    return customers.reduce((total, customer) => total + customer.debt, 0);
  },
};
