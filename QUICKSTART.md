# 🚀 Guia de Início Rápido - CondoCantina

## ⚡ Setup em 5 Minutos

### 1. Instalar Dependências (1 min)

```bash
cd frontend
npm install
```

### 2. Configurar Firebase (2 min)

1. Acesse https://console.firebase.google.com/
2. Crie um projeto novo
3. Ative o Firestore Database (modo teste)
4. Copie as credenciais

### 3. Configurar Variáveis (1 min)

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Firebase.

### 4. Iniciar o Sistema (1 min)

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🎯 Primeiro Uso

### Opção 1: Cadastrar Manualmente

1. Acesse `/products` e cadastre alguns produtos
2. Acesse `/customers` e cadastre alguns clientes
3. Faça uma venda em `/sale`

### Opção 2: Usar Dados de Exemplo

1. Abra o Console do navegador (F12)
2. Cole e execute:

```javascript
// Importar as funções necessárias
const initDb = async () => {
  const { productService } = await import('./services/productService');
  const { customerService } = await import('./services/customerService');
  
  // Produtos
  await productService.create({ name: 'Coca-Cola', price: 5.0, category: 'Bebidas' });
  await productService.create({ name: 'Coxinha', price: 4.0, category: 'Salgados' });
  await productService.create({ name: 'Brigadeiro', price: 2.0, category: 'Doces' });
  
  // Clientes
  await customerService.create({ 
    name: 'João Silva', 
    phone: '(11) 98765-4321', 
    address: 'Bloco A - Apto 101',
    debt: 0 
  });
  
  console.log('✅ Dados de exemplo criados!');
};

initDb();
```

## 📖 Fluxo de Trabalho Diário

### 1. Registrar uma Venda

1. Clique em **"+ Nova Venda"** no dashboard
2. Selecione o cliente
3. Adicione os produtos e quantidades
4. Confirme a venda
5. ✅ A dívida do cliente aumenta automaticamente

### 2. Receber um Pagamento

1. No dashboard, clique em **"Receber"** no card do cliente
2. Digite o valor recebido (ou clique em "Valor Total")
3. Confirme o pagamento
4. ✅ A dívida do cliente diminui automaticamente

### 3. Ver Histórico de um Cliente

1. No dashboard, clique em **"Extrato"** no card do cliente
2. Veja todas as compras e pagamentos
3. Envie o extrato para o cliente via WhatsApp

## 💡 Dicas

### Lançar Caderneta Antiga

1. Ao fazer uma venda, altere a **Data da Venda**
2. Você pode lançar vendas de dias/semanas anteriores
3. O histórico ficará com a data correta

### Pagamentos Parciais

1. Cliente pode pagar qualquer valor até o total da dívida
2. Sistema valida automaticamente
3. Histórico mostra todos os pagamentos parciais

### Buscar Clientes

- Use a barra de busca no dashboard
- Busque por nome ou endereço (ex: "Bloco A" ou "João")

## 🎨 Atalhos de Teclado (Futuro)

- `Ctrl + N` → Nova Venda
- `Ctrl + P` → Receber Pagamento
- `Ctrl + K` → Buscar Cliente

## 🆘 Problemas Comuns

### "Erro ao carregar dados"
- Verifique se o `.env.local` está configurado
- Confirme que o Firestore está ativo no Firebase Console
- Verifique as regras de segurança (devem permitir leitura/escrita)

### "Cliente não encontrado"
- Cadastre pelo menos 1 cliente antes de fazer vendas
- Acesse `/customers` para gerenciar clientes

### Página em branco
- Abra o Console do navegador (F12)
- Veja se há erros relacionados ao Firebase
- Verifique a conexão com a internet

## 📱 Uso no Celular

O sistema é responsivo e funciona em smartphones:

1. Acesse pelo navegador do celular
2. Adicione à tela inicial para uso rápido
3. Funciona offline (em breve)

## 🔐 Segurança

⚠️ **IMPORTANTE**: O modo de teste do Firebase expira em 30 dias!

Após 30 dias, atualize as regras em Firebase Console → Firestore → Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Para produção, implemente autenticação!

## 📊 Limites do Plano Gratuito

- 50.000 leituras/dia
- 20.000 escritas/dia
- 1 GB de armazenamento

**Suficiente para:**
- Centenas de vendas por dia
- Milhares de clientes
- Anos de histórico

## ✨ Próximos Passos

- [ ] Cadastre seus produtos reais
- [ ] Cadastre os moradores do condomínio
- [ ] Lance as vendas antigas (se houver)
- [ ] Comece a usar no dia a dia!

---

**Dúvidas?** Consulte o [README.md](README.md) ou [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
