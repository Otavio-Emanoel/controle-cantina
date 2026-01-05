import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer } from '@/types';

const COLLECTION_NAME = 'customers';

export const customerService = {
  // Criar novo cliente
  async create(customer: Omit<Customer, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...customer,
      debt: customer.debt || 0,
    });
    return docRef.id;
  },

  // Buscar todos os clientes
  async getAll(): Promise<Customer[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Customer[];
  },

  // Buscar clientes com dívida (ordenados por maior dívida)
  async getWithDebt(): Promise<Customer[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('debt', '>', 0),
      orderBy('debt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Customer[];
  },

  // Buscar cliente por ID
  async getById(id: string): Promise<Customer | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Customer;
    }
    return null;
  },

  // Atualizar cliente
  async update(id: string, data: Partial<Customer>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  // Deletar cliente
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Atualizar dívida do cliente
  async updateDebt(id: string, newDebt: number): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { debt: newDebt });
  },

  // Buscar por filtro (nome ou endereço)
  async search(searchTerm: string): Promise<Customer[]> {
    const allCustomers = await this.getAll();
    const term = searchTerm.toLowerCase();
    return allCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.address.toLowerCase().includes(term)
    );
  },
};
