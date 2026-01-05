# 🛠️ Comandos Úteis - CondoCantina

## 📦 Instalação e Setup

```bash
# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.local.example .env.local
# Depois edite .env.local com suas credenciais do Firebase
```

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar aplicação
# http://localhost:3000
```

## 🏗️ Build e Produção

```bash
# Criar build de produção
npm run build

# Testar build localmente
npm run start

# Verificar erros de lint
npm run lint
```

## 🔥 Firebase

```bash
# Instalar Firebase CLI (se necessário)
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar Firebase (já configurado)
firebase init

# Deploy de regras do Firestore
firebase deploy --only firestore:rules

# Fazer backup do Firestore
firebase firestore:export gs://seu-bucket/backups/$(date +%Y%m%d)
```

## 🧹 Limpeza

```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules
rm -rf node_modules
npm install

# Limpar tudo e reinstalar
rm -rf .next node_modules
npm install
```

## 📊 Análise de Bundle

```bash
# Analisar tamanho do bundle
npm run build
# Veja o relatório em .next/analyze/

# Instalar analisador (opcional)
npm install -D @next/bundle-analyzer
```

## 🧪 Debug

```bash
# Verificar erros TypeScript
npx tsc --noEmit

# Ver logs do Firebase
# Abra o console do navegador (F12) → Console

# Modo debug do Next.js
NODE_OPTIONS='--inspect' npm run dev
```

## 📱 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### Comandos Git

```bash
# Inicializar repositório
git init
git add .
git commit -m "Initial commit - CondoCantina MVP"

# Conectar ao GitHub
git remote add origin https://github.com/seu-usuario/condocantina.git
git push -u origin main
```

## 🔧 Manutenção

```bash
# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated

# Atualizar Next.js
npm install next@latest react@latest react-dom@latest

# Atualizar Firebase
npm install firebase@latest
```

## 📦 Dados de Teste

### Criar Cliente de Teste (Console do Navegador)

```javascript
// Abra F12 → Console e cole:
const createTestCustomer = async () => {
  const { customerService } = await import('/src/services/customerService.ts');
  await customerService.create({
    name: 'Cliente Teste',
    phone: '(11) 99999-9999',
    address: 'Bloco Z - Apto 999',
    debt: 0
  });
  console.log('✅ Cliente criado!');
};
createTestCustomer();
```

### Criar Produto de Teste

```javascript
const createTestProduct = async () => {
  const { productService } = await import('/src/services/productService.ts');
  await productService.create({
    name: 'Produto Teste',
    price: 10.00,
    category: 'Bebidas'
  });
  console.log('✅ Produto criado!');
};
createTestProduct();
```

## 🐛 Solução de Problemas

### Erro: "Module not found"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Firebase not initialized"
```bash
# Verificar .env.local
cat .env.local
# Reiniciar servidor
npm run dev
```

### Erro de Build
```bash
# Limpar cache
rm -rf .next
npm run build
```

### Porta 3000 ocupada
```bash
# Usar outra porta
PORT=3001 npm run dev

# Ou matar processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

## 📊 Queries Úteis no Firestore (Console)

```javascript
// Buscar todos os clientes com dívida
db.collection('customers')
  .where('debt', '>', 0)
  .orderBy('debt', 'desc')
  .get()

// Buscar transações de um cliente
db.collection('transactions')
  .where('customerId', '==', 'ID_DO_CLIENTE')
  .orderBy('date', 'desc')
  .get()

// Calcular total a receber
db.collection('customers').get().then(snapshot => {
  let total = 0;
  snapshot.docs.forEach(doc => total += doc.data().debt);
  console.log('Total a receber: R$', total.toFixed(2));
});
```

## 🔐 Regras de Segurança do Firestore

### Desenvolvimento (30 dias)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 2, 4);
    }
  }
}
```

### Produção (sem autenticação)
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

## 📈 Monitoramento

```bash
# Ver logs do Vercel
vercel logs

# Ver métricas do Firebase
# Acesse: https://console.firebase.google.com/
# → Firestore Database → Usage
```

## 🎯 Atalhos de Desenvolvimento

```bash
# Alias úteis (adicione ao ~/.bashrc ou ~/.zshrc)
alias cdev='cd frontend && npm run dev'
alias cbuild='cd frontend && npm run build'
alias cclean='cd frontend && rm -rf .next node_modules && npm install'
```

---

**Dica**: Salve este arquivo para referência rápida! 📌
