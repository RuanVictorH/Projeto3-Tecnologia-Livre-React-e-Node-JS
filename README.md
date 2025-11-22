# 📘 Agenda de Estudos - Fullstack JS

Este projeto é uma reimplementação moderna de um sistema de Agenda de Estudos originalmente desenvolvido em Django. O objetivo foi migrar a arquitetura monolítica para uma arquitetura **Cliente-Servidor** utilizando tecnologias livres baseadas em JavaScript (Node.js e React).

O sistema permite o gerenciamento completo de vida acadêmica, incluindo matérias, tarefas, provas, horários de aula e ferramentas de produtividade como o Modo Foco (Pomodoro).

---

## 🚀 Tecnologias Utilizadas

### Backend (API)
- **Node.js** & **Express**: Servidor e rotas da API.
- **Sequelize**: ORM para gerenciamento do banco de dados.
- **SQLite**: Banco de dados relacional (arquivo local).
- **JWT (JSON Web Token)**: Autenticação segura de usuários.
- **Open-Meteo & NewsAPI**: Integrações externas para clima e notícias em tempo real.

### Frontend (Interface)
- **React** (Vite): Biblioteca para construção da interface reativa.
- **Bootstrap 5**: Framework de estilização e layout.
- **Axios**: Cliente HTTP para comunicação com a API.
- **FullCalendar**: Visualização de agenda e eventos.
- **Canvas Confetti**: Animações de gamificação.
- **Estilização Customizada**: Tema "Tech Dark" com efeitos de vidro (Glassmorphism) e neon.

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (Versão 16 ou superior)
* [Git](https://git-scm.com/)

---

## 🛠️ Como Rodar o Projeto

Este projeto é dividido em duas partes que precisam rodar simultaneamente em **dois terminais diferentes**: o Servidor (Backend) e a Interface (Frontend).

### 1. Configurando o Backend

Abra um terminal na raiz do projeto e execute os comandos abaixo:
```bash
# 1. Entre na pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de configuração .env
# (Copie o código da seção "Configuração do .env" abaixo e salve num arquivo chamado .env dentro da pasta backend)

# 4. Inicie o servidor
npm run dev
```
### 2. Configurando o Frontend
Abra um segundo terminal (mantenha o anterior rodando) na raiz do projeto e execute:
```bash
# 1. Entre na pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie a aplicação React
npm run dev
```
✨ Funcionalidades Principais
## 1. Dashboard Interativo (Tech Dark Theme):

Resumo de tarefas, provas e progresso geral com visualização moderna.

Widget de Clima: Temperatura e previsão de chuva em tempo real de Lavras-MG (API Open-Meteo).

Notícias Tech: Feed rotativo de notícias sobre tecnologia e IA.

Quadro de Horários: Visualização da próxima aula do dia e lista completa de horários.

## 2. Gestão de Matérias:

CRUD completo de disciplinas.

Barra de Progresso: Visualização gráfica da porcentagem de tarefas concluídas por matéria.

Links Rápidos: Acesso direto ao plano de ensino.

Quadro de Horários: Definição de dias e horas das aulas diretamente na edição da matéria.

## 3. Gestão de Tarefas:

Status (A Fazer, Em Andamento, Concluída) com indicadores visuais.

Modo Foco: Cronômetro Pomodoro (25min) integrado com alarme sonoro e conclusão automática.

Conclusão Rápida: Botão de check diretamente na listagem.

Anexo de links de estudo.

## 4. Gestão de Provas:

Agendamento de avaliações com data e observações.

Visualização destacada no Dashboard.

## 👥 Autores

### Ruan Víctor Henrique
### Marcos Vinícius Matias do Nascimento
### Layon Walker Tobias Pedro
