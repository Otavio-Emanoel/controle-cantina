# CondoCantina 🏪

Sistema de gestão de cantina residencial com controle de contas (fiado), histórico de consumo e abatimento de dívidas.

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Firebase Firestore** - Banco de dados em tempo real
- **Tailwind CSS** - Estilização
- **date-fns** - Manipulação de datas

## 📋 Funcionalidades

### MVP Implementado

✅ **Painel de Devedores**
- Lista de clientes ordenados por maior dívida
- Busca por nome ou endereço (Bloco/Apto)
- Total a receber consolidado

✅ **Venda Rápida**
- Seleção de cliente e produtos
- Campo de data persistente (para lançar caderneta antiga)
- Cálculo automático do total
- Atualização automática da dívida do cliente

✅ **Receber Pagamento**
- Registro de pagamentos parciais ou totais
- Abatimento automático da dívida
- Campo de data para registro retroativo

✅ **Gestão de Clientes**
- Cadastro completo (Nome, Telefone, Endereço)
- Edição e exclusão
- Visualização da dívida atual

✅ **Gestão de Produtos**
- Cadastro por categoria (Bebidas, Salgados, Doces)
- Organização automática por categoria
- Edição de preços

✅ **Extrato do Cliente**
- Histórico completo de compras e pagamentos
- Detalhamento de itens comprados
- Resumo financeiro (Total comprado, Total pago, Dívida)

## 🔧 Configuração

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

### 2. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative o Firestore Database (modo de teste)
4. Copie as credenciais do projeto

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 4. Executar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📊 Estrutura do Banco de Dados

### Collections

#### `customers`
```typescript
{
  name: string;        // Nome do cliente
  phone: string;       // Telefone (WhatsApp)
  address: string;     // Ex: "Bloco B - Apto 402"
  debt: number;        // Dívida atual
}
```

#### `products`
```typescript
{
  name: string;        // Nome do produto
  price: number;       // Preço unitário
  category: string;    // "Bebidas" | "Salgados" | "Doces"
}
```

#### `transactions`
```typescript
{
  type: string;           // "purchase" | "payment"
  customerId: string;     // ID do cliente
  customerName: string;   // Nome (desnormalizado)
  amount: number;         // Valor da transação
  date: Timestamp;        // Data da transação
  items?: Array<{         // Apenas para compras
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  description: string;    // Descrição da transação
}
```

## 🎯 Regras de Negócio

1. **Compra**: Cliente pega produtos → Dívida aumenta
2. **Pagamento**: Cliente paga → Dívida diminui
3. **Histórico**: Todas as transações ficam salvas permanentemente
4. **Validação**: Pagamento não pode ser maior que a dívida

## 🖥️ Otimizações para PC Fraco

- ✅ Sem animações pesadas
- ✅ Carregamento paginado implementado via Firebase queries
- ✅ Componentes leves e eficientes
- ✅ Mínimo de JavaScript no cliente

## 📱 Páginas do Sistema

- `/` - Dashboard (Painel de Devedores)
- `/sale` - Nova Venda
- `/payment` - Receber Pagamento
- `/customers` - Gestão de Clientes
- `/products` - Gestão de Produtos
- `/customer/[id]` - Extrato do Cliente

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Conecte seu repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no painel da Vercel
4. Deploy automático! ✨

## 📝 Próximas Melhorias (Futuras)

- [ ] Exportar extrato em PDF
- [ ] Notificações via WhatsApp para cobrança
- [ ] Relatórios mensais
- [ ] Gráficos de vendas
- [ ] Controle de estoque
- [ ] Sistema de autenticação

## 📄 Licença

Projeto pessoal para uso em condomínio residencial.

---

Desenvolvido com ❤️ para facilitar a gestão da cantina do condomínio

