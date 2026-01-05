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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, ProductCategory } from '@/types';

const COLLECTION_NAME = 'products';

export const productService = {
  // Criar novo produto
  async create(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), product);
    return docRef.id;
  },

  // Buscar todos os produtos
  async getAll(): Promise<Product[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  },

  // Buscar produtos por categoria
  async getByCategory(category: ProductCategory): Promise<Product[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  },

  // Buscar produto por ID
  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  },

  // Atualizar produto
  async update(id: string, data: Partial<Product>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  // Deletar produto
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
