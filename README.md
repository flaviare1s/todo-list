# TODO List

Esse projeto é uma Todo List Colaborativa criada para o desafio que oferece Ingresso para Iniciantes na Carreira de Desenvolvimento


## **Visão Geral**

O aplicativo TODO List é uma solução colaborativa para gerenciamento de tarefas, permitindo a criação, edição e exclusão de tarefas por múltiplos usuários. A autenticação segura é gerenciada pelo Firebase, e a aplicação oferece uma interface responsiva construída com React e Tailwind. As tarefas são armazenadas no Firebase Firestore e a funcionalidade de compartilhamento permite que usuários monitorem alterações e recebam notificações em tempo real. 


## **Tecnologias Utilizadas**

- **Frontend:**
  - **React:** Biblioteca JavaScript para construção da interface do usuário.
  - **Tailwind CSS:** Framework CSS para estilização e design responsivo.
- **Backend:**
  - **Firebase:** Plataforma para autenticação de usuários, armazenamento de dados e notificações em tempo real.
  - **Firebase Firestore:** Banco de dados NoSQL para armazenamento das tarefas e histórico de alterações.
- **Outras Tecnologias:**
  - **React Hooks:** Para gerenciar estados e efeitos colaterais.
  - **Firestore Listeners:** Para implementar notificações em tempo real.


## **Funcionalidades**

- **Autenticação:**
  - **Cadastro de Usuários:** Permite que novos usuários se registrem usando email e senha.
  - **Login de Usuários:** Funcionalidade de login para usuários existentes.
  - **Login com Google:** Opção para login utilizando contas Google.
  - **Redefinição de Senha:** Função para recuperação de senha em caso de esquecimento.
  - **Logout:** Opção para sair da conta e encerrar a sessão do usuário.

- **Gerenciamento de Tarefas:**
  - **Criação de Tarefas:** Usuários podem adicionar novas tarefas à lista.
  - **Edição de Tarefas:** Permite atualizar detalhes das tarefas existentes.
  - **Exclusão de Tarefas:** Opção para remover tarefas da lista.
  - **Mudança de Status:** Permite marcar tarefas como concluídas.

- **Funcionalidade de Compartilhamento:**
  - **Compartilhamento de Tarefas Individuais:** Usuários podem compartilhar tarefas específicas com outros usuários, permitindo que os destinatários editem e excluam essas tarefas.
  - **Compartilhamento de Lista de Tarefas:** Permite compartilhar toda a lista de tarefas em modo somente leitura com outros usuários, sem permitir alterações.

- **Atualização em Tempo Real:**
  - **Notificações de Alterações:** As tarefas compartilhadas são atualizadas em tempo real, renderizando adições ou modificações feitas por outros participantes da lista.
  Real**

- **Firestore com Listeners:** Implementar notificações em tempo real para alterações em listas compartilhadas usando Firestore com listeners.

Essas funcionalidades garantem uma experiência colaborativa e dinâmica, facilitando a gestão e o compartilhamento de tarefas entre os usuários.


## Instalação e Configuração:

1. Clone o repositório
  - Abra um terminal e execute o comando abaixo para clonar o repositório:
  - git clone https://github.com/flaviare1s/todo-list.git

2. Instale as dependências
  - No diretório do projeto, execute o comando a seguir para instalar todas as dependências necessárias:
  - npm install

3. Configuração do Firebase
  - Crie um Projeto no Firebase: Acesse o Console do Firebase e crie um novo projeto, se ainda não tiver um.
  - Obtenha os Dados da Configuração do SDK: No console do Firebase, vá para "Configurações do Projeto" (ícone de engrenagem no canto superior esquerdo) e, na aba "Geral", encontre a seção "Seus aplicativos". Selecione o ícone do aplicativo da Web para obter as credenciais de configuração do Firebase.
  - Configure o Firebase no Projeto: Crie um arquivo chamado config.js na pasta src/firebase do projeto e cole os dados da configuração do SDK que você copiou.

4. Inicie o Servidor de Desenvolvimento
  - Execute o comando a seguir para iniciar o servidor de desenvolvimento e acessar o aplicativo localmente:
  - npm run dev


## **Hospedagem**
  - O aplicativo está hospedado e disponível em: https://todo-list-web-9d1d7.web.app/




## Detalhes sobre o Desafio:
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
