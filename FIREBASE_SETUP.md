# 🔥 Configuração do Firebase - Passo a Passo

## 1. Criar Projeto no Firebase

1. Acesse https://console.firebase.google.com/
2. Clique em "Adicionar projeto" ou "Create a project"
3. Digite o nome: **CondoCantina** (ou o nome que preferir)
4. Desative o Google Analytics (não é necessário para este projeto)
5. Clique em "Criar projeto"

## 2. Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de teste"** (permite leitura/escrita por 30 dias)
4. Escolha a localização: **southamerica-east1 (São Paulo)** para melhor performance
5. Clique em "Ativar"

### 2.1 Configurar Regras de Segurança (Importante!)

Após 30 dias, você precisará atualizar as regras. Vá em "Regras" e use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita em todas as coleções
    // IMPORTANTE: Em produção, adicione autenticação!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ ATENÇÃO**: Essas regras permitem acesso total ao banco. Para uso em produção, implemente autenticação!

## 3. Obter Credenciais do Firebase

1. No menu lateral, clique no ícone de **engrenagem ⚙️** → **Configurações do projeto**
2. Role até a seção **"Seus aplicativos"**
3. Clique no ícone **</> Web** para criar um app web
4. Digite um apelido: **CondoCantina Web**
5. **NÃO** marque "Também configure o Firebase Hosting"
6. Clique em **"Registrar app"**
7. Copie o objeto `firebaseConfig` que aparecerá

Exemplo do que você verá:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "condocantina-xxxx.firebaseapp.com",
  projectId: "condocantina-xxxx",
  storageBucket: "condocantina-xxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## 4. Configurar Variáveis de Ambiente

1. Na raiz do projeto `frontend/`, copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

2. Abra o arquivo `.env.local` e preencha com os valores do `firebaseConfig`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=condocantina-xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=condocantina-xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=condocantina-xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

3. Salve o arquivo

## 5. Testar a Conexão

1. Execute o projeto:

```bash
npm run dev
```

2. Abra http://localhost:3000
3. Tente cadastrar um cliente em "👥 Clientes"
4. Volte ao Firebase Console → Firestore Database
5. Você deverá ver a coleção `customers` criada automaticamente!

## 6. Estrutura Inicial (Opcional)

As coleções serão criadas automaticamente conforme você usa o sistema:

- **customers** - Criada ao cadastrar o primeiro cliente
- **products** - Criada ao cadastrar o primeiro produto  
- **transactions** - Criada ao fazer a primeira venda ou pagamento

### 6.1 Criar Produtos Iniciais (Sugestão)

Acesse http://localhost:3000/products e cadastre alguns produtos:

**Bebidas:**
- Coca-Cola Lata - R$ 5,00
- Água Mineral - R$ 2,50
- Suco Natural - R$ 6,00

**Salgados:**
- Coxinha - R$ 4,00
- Pastel - R$ 5,00
- Pão de Queijo - R$ 3,00

**Doces:**
- Brigadeiro - R$ 2,00
- Beijinho - R$ 2,00
- Chocolate - R$ 3,50

## 7. Segurança em Produção

### 7.1 Atualizar Regras do Firestore

Quando for para produção, atualize as regras em Firestore → Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir apenas leitura
    match /{document=**} {
      allow read: if true;
      allow write: if false;  // Desabilitar escrita pública
    }
  }
}
```

### 7.2 Implementar Autenticação (Futuro)

Para proteger o sistema, será necessário implementar Firebase Authentication.

## 8. Custo (Plano Gratuito)

O Firebase oferece um plano gratuito (Spark) que inclui:

- **Firestore**: 1 GB de armazenamento
- **50.000 leituras/dia**
- **20.000 escritas/dia**
- **20.000 exclusões/dia**

Isso é mais que suficiente para uma cantina de condomínio! 🎉

## 9. Backup (Recomendado)

Para fazer backup dos dados:

1. No Firebase Console → Firestore Database
2. Vá em "Importar/Exportar"
3. Configure exportações automáticas no Google Cloud Storage (grátis até 5GB)

## ✅ Pronto!

Seu sistema está configurado e pronto para uso! 🚀

Em caso de dúvidas, consulte a [Documentação Oficial do Firebase](https://firebase.google.com/docs/firestore).
