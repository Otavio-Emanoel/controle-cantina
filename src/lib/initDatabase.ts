/**
 * Script de Inicialização do CondoCantina
 * 
 * Este script cria dados de exemplo para facilitar o teste do sistema.
 * Execute apenas UMA VEZ após configurar o Firebase.
 * 
 * Como usar:
 * 1. Configure o Firebase (.env.local)
 * 2. Acesse http://localhost:3000
 * 3. Abra o Console do navegador (F12)
 * 4. Cole este código e pressione Enter
 */

import { productService } from '@/services/productService';
import { customerService } from '@/services/customerService';

export async function initializeDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados...');

  try {
    // Criar Produtos de Exemplo
    console.log('📦 Criando produtos...');

    const products = [
      // Bebidas
      { name: 'Coca-Cola Lata', price: 5.0, category: 'Bebidas' as const },
      { name: 'Água Mineral', price: 2.5, category: 'Bebidas' as const },
      { name: 'Suco Natural', price: 6.0, category: 'Bebidas' as const },
      { name: 'Refrigerante 2L', price: 8.0, category: 'Bebidas' as const },
      { name: 'Café', price: 3.0, category: 'Bebidas' as const },

      // Salgados
      { name: 'Coxinha', price: 4.0, category: 'Salgados' as const },
      { name: 'Pastel', price: 5.0, category: 'Salgados' as const },
      { name: 'Pão de Queijo', price: 3.0, category: 'Salgados' as const },
      { name: 'Empada', price: 4.5, category: 'Salgados' as const },
      { name: 'Esfirra', price: 5.5, category: 'Salgados' as const },

      // Doces
      { name: 'Brigadeiro', price: 2.0, category: 'Doces' as const },
      { name: 'Beijinho', price: 2.0, category: 'Doces' as const },
      { name: 'Chocolate', price: 3.5, category: 'Doces' as const },
      { name: 'Brownie', price: 6.0, category: 'Doces' as const },
      { name: 'Bolo Caseiro', price: 4.0, category: 'Doces' as const },
    ];

    for (const product of products) {
      await productService.create(product);
      console.log(`✅ ${product.name} criado`);
    }

    // Criar Clientes de Exemplo
    console.log('\n👥 Criando clientes...');

    const customers = [
      {
        name: 'Maria Silva',
        phone: '(11) 98765-4321',
        address: 'Bloco A - Apto 101',
        debt: 0,
      },
      {
        name: 'João Santos',
        phone: '(11) 98765-4322',
        address: 'Bloco A - Apto 202',
        debt: 0,
      },
      {
        name: 'Ana Costa',
        phone: '(11) 98765-4323',
        address: 'Bloco B - Apto 303',
        debt: 0,
      },
      {
        name: 'Pedro Oliveira',
        phone: '(11) 98765-4324',
        address: 'Bloco B - Apto 404',
        debt: 0,
      },
      {
        name: 'Carla Mendes',
        phone: '(11) 98765-4325',
        address: 'Bloco C - Apto 505',
        debt: 0,
      },
    ];

    for (const customer of customers) {
      await customerService.create(customer);
      console.log(`✅ ${customer.name} criado`);
    }

    console.log('\n✨ Banco de dados inicializado com sucesso!');
    console.log('📋 Produtos criados: ' + products.length);
    console.log('👥 Clientes criados: ' + customers.length);
    console.log('\n🎉 Pronto para usar! Acesse as páginas:');
    console.log('   - /products (Gerenciar Produtos)');
    console.log('   - /customers (Gerenciar Clientes)');
    console.log('   - /sale (Fazer uma Venda)');

    return {
      success: true,
      productsCreated: products.length,
      customersCreated: customers.length,
    };
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

// Para uso no console do navegador
if (typeof window !== 'undefined') {
  (window as any).initializeDatabase = initializeDatabase;
}
