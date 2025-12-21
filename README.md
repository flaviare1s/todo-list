# TODO List 📝

<div align="center">

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[🇧🇷 Português](README.md) | [🇺🇸 English](README-en.md)

[Ver Demo](https://todo-list-web-9d1d7.web.app/) | [Reportar Bug](https://github.com/flaviare1s/todo-list/issues) | [Solicitar Funcionalidade](https://github.com/flaviare1s/todo-list/issues)

</div>

---

## **📖 Visão Geral**

Uma aplicação de lista de tarefas colaborativa e moderna, desenvolvida para o **Frontend Day 2024**. Este projeto permite que múltiplos usuários criem, editem e compartilhem tarefas em tempo real, com autenticação segura e interface responsiva.

### ✨ **Destaques**

- 🔐 Autenticação segura com Firebase (Email/Senha e Google)
- 🤝 Compartilhamento colaborativo de tarefas e listas
- ⚡ Atualizações em tempo real
- 📱 Interface responsiva e moderna
- 🔔 Notificações de alterações em tempo real

---

## **🚀 Tecnologias Utilizadas**

### **Frontend**

- [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Vite](https://vitejs.dev/) - Build tool e dev server
- React Router - Navegação entre páginas
- React Hooks - Gerenciamento de estado e efeitos

### **Backend & Infraestrutura**

- [Firebase Authentication](https://firebase.google.com/products/auth) - Autenticação de usuários
- [Cloud Firestore](https://firebase.google.com/products/firestore) - Banco de dados NoSQL em tempo real
- [Firebase Hosting](https://firebase.google.com/products/hosting) - Hospedagem web
- Firestore Listeners - Notificações em tempo real

---

## **✨ Funcionalidades**

### 🔐 **Autenticação**

- ✅ Cadastro de usuários com email e senha
- ✅ Login de usuários existentes
- ✅ Login com Google (OAuth)
- ✅ Redefinição de senha
- ✅ Logout seguro

### 📋 **Gerenciamento de Tarefas**

- ✅ Criar novas tarefas
- ✅ Editar tarefas existentes
- ✅ Excluir tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Organização por listas

### 🤝 **Compartilhamento Colaborativo**

- ✅ **Compartilhamento de Tarefas Individuais**: Compartilhe tarefas específicas com permissões de edição
- ✅ **Compartilhamento de Listas Completas**: Compartilhe listas inteiras em modo somente leitura
- ✅ Gerenciamento de permissões (leitura/escrita)

### ⚡ **Tempo Real**

- ✅ Atualizações instantâneas de tarefas compartilhadas
- ✅ Notificações de alterações feitas por outros usuários
- ✅ Sincronização automática entre dispositivos

### 📊 **Histórico e Auditoria**

- ✅ Registro de quem criou cada tarefa
- ✅ Registro de quem editou cada tarefa
- ✅ Timestamp de última alteração

---

## **⚙️ Instalação e Configuração**

### **Pré-requisitos**

- Node.js (v16 ou superior)
- npm ou yarn
- Conta no Firebase

### **Passo a Passo**

#### 1️⃣ **Clone o Repositório**

```bash
git clone https://github.com/flaviare1s/todo-list.git
cd todo-list
```

#### 2️⃣ **Instale as Dependências**

```bash
npm install
# ou
yarn install
```

#### 3️⃣ **Configure o Firebase**

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Vá para **Configurações do Projeto** > **Seus aplicativos**
   Este projeto foi desenvolvido como resposta ao desafio do **Frontend Day 2024**, que propunha a criação de um aplicativo de lista de tarefas colaborativo.

### **🎯 Objetivo do Desafio**

Desenvolver uma aplicação web completa de gerenciamento de tarefas com suporte a múltiplos usuários, compartilhamento e atualizações em tempo real.

### **📋 Requisitos Implementados**

#### ✅ Autenticação de Usuário

- Firebase Authentication
- Login e registro com email/senha
- Login social com Google
- Recuperação de senha

#### ✅ Gerenciamento de Tarefas (CRUD)

- Criar, editar e excluir tarefas
- Marcar tarefas como concluídas
- Armazenamento no Firestore
- Interface clara e organizada

#### ✅ Compartilhamento Colaborativo

- Compartilhar listas e tarefas individuais
- Permissões configuráveis (leitura/escrita)
- Gerenciamento de acessos

#### ✅ Interface Responsiva

- Design moderno com Tailwind CSS
- Feedback visual para todas as ações
- Adaptável a diferentes dispositivos

#### ✅ Tempo Real

- Firestore Listeners para atualizações instantâneas
- Notificações de alterações por outros usuários
- Sincronização automática

#### ✅ Histórico e Segurança

- Registro de criação e edições
- Timestamps de alterações
- Firestore Security Rules implementadas
- Validação de dados no frontend e backend

---

## **👨‍💻 Autor**

Desenvolvido por [Flavia Reis](https://github.com/flaviare1s)

---

## **🤝 Contribuindo**

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

[🇧🇷 Português](README.md) | [🇺🇸 English](README-en.md)

## </div>

## **📁 Estrutura do Projeto**

```
todo-list/
├── src/
│   ├── assets/           # Recursos estáticos
│   ├── components/       # Componentes React reutilizáveis
│   │   ├── Header.jsx
│   │   ├── TodoItem.jsx
│   │   ├── ShareModal.jsx
│   │   └── ...
│   ├── contexts/         # Context API do React
│   │   └── UserContext.jsx
│   ├── firebase/         # Configuração e funções do Firebase
│   │   ├── auth.js
│   │   ├── list.js
│   │   ├── share.js
│   │   └── todo.js
│   ├── pages/            # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Todos.jsx
│   │   └── ...
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Ponto de entrada
├── public/               # Arquivos públicos
├── firebase.json         # Configuração do Firebase
├── vite.config.js        # Configuração do Vite
└── tailwind.config.js    # Configuração do Tailwind
```

---

## **🎯 Sobre o Desafio Frontend Day 2024**

### **Desafio: Criar um Aplicativo de Lista de Tarefas Colaborativo**

#### **Objetivo**

Desenvolver um aplicativo web de lista de tarefas (To-Do List) que permita aos usuários criar, editar e excluir tarefas. O aplicativo deve suportar autenticação de usuário e permitir que diferentes usuários compartilhem listas de tarefas entre si. O backend será gerenciado pelo Firebase.

#### **Requisitos do Desafio**

##### **Autenticação de Usuário**

- **Firebase Authentication:** Implementar autenticação de usuários utilizando Firebase Authentication.
- **Login e Registro:** Permitir login e registro de novos usuários usando email e senha.
- **Reset de Senha:** Implementar a função de reset de senha para recuperação de conta.

##### **Gerenciamento de Tarefas**

- **CRUD de Tarefas:** Os usuários devem poder criar, editar, marcar como concluídas e excluir tarefas.
- **Armazenamento:** As tarefas devem ser armazenadas no Firebase Firestore.
- **Interface de Usuário:** As tarefas devem ser exibidas em uma interface de usuário clara e organizada.

##### **Funcionalidade de Compartilhamento**

- **Compartilhamento de Listas:** Os usuários devem poder compartilhar suas listas de tarefas com outros usuários.
- **Permissões:** Implementar permissões de leitura e escrita para listas compartilhadas, permitindo que um usuário conceda acesso total ou apenas leitura a outros usuários.

##### **Interface de Usuário**

- **Responsividade:** A interface deve ser responsiva e fácil de usar, com feedback visual para ações como adicionar, editar e concluir tarefas.
- **Tecnologias:** Utilizar React e Tailwind para construir a interface.

##### **Notificações em Tempo Real**

- **Firestore com Listeners:** Implementar notificações em tempo real para alterações em listas compartilhadas usando Firestore com listeners.
- **Notificações de Alterações:** Notificar os usuários quando uma tarefa é adicionada ou modificada por outro usuário.

##### **Histórico de Alterações**

- **Registro de Alterações:** Manter um histórico básico de alterações para cada tarefa (quem criou, quem editou, quando foi feita a última alteração).

##### **Segurança e Validação**

- **Regras de Segurança:** Garantir que todas as operações no banco de dados estejam protegidas com regras de segurança adequadas (Firestore Rules).
- **Validação de Dados:** Validar todas as entradas do usuário para evitar erros e proteger contra ataques, como SQL Injection.
